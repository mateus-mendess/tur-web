import axios from 'axios'
import { api } from '#/lib/axios'
import { decodeJwt } from '#/lib/jwt'
import type { LoginFormData, SignUpFormData } from '#/schemas/authSchema'
import { storage, TOKEN_STORAGE_KEY } from '#/lib/storage'

export interface AuthUser {
  id: string
  nome: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

/**
 * Extrai uma representação de nome do email (ex: "joao.silva@x.com" → "João Silva").
 * Fallback usado apenas quando não temos o nome diretamente (caso do login).
 */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? email
  return local
    .split(/[._-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export const authService = {
  /**
   * POST /auth/login
   * A API retorna apenas { token }. O AuthUser é construído localmente
   * pois não há endpoint GET /me documentado no contrato.
   */
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    try {
      const { data: response } = await api.post<{ token: string }>(
        '/auth/login',
        {
          email: data.email,
          password: data.senha,
        },
      )

      const decoded = decodeJwt(response.token)
      const userId = decoded?.sub ?? ''

      const user: AuthUser = {
        id: userId,
        nome: nameFromEmail(data.email),
        email: data.email,
      }

      return { token: response.token, user }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        throw new Error('E-mail ou senha inválidos.')
      }
      throw new Error('Não foi possível fazer login. Tente novamente.')
    }
  },

  /**
   * POST /users (registro) seguido de POST /auth/login (auto-login).
   * A resposta de POST /users é um objeto não especificado no contrato —
   * fazemos auto-login para obter o token válido.
   */
  register: async (data: SignUpFormData): Promise<AuthResponse> => {
    try {
      await api.post('/users', {
        name: data.nome,
        email: data.email,
        password: data.senha,
        confirmPassword: data.confirmarSenha,
      })
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        // Backend pode rejeitar por email já em uso ou dados inválidos
        const message =
          (err.response.data as { message?: string } | undefined)?.message ??
          'E-mail já cadastrado ou dados inválidos.'
        throw new Error(message)
      }
      throw new Error('Não foi possível criar a conta. Tente novamente.')
    }

    // Auto-login após registro bem-sucedido
    try {
      const { data: loginResponse } = await api.post<{ token: string }>(
        '/auth/login',
        {
          email: data.email,
          password: data.senha,
        },
      )

      const decoded = decodeJwt(loginResponse.token)
      const userId = decoded?.sub ?? ''

      const user: AuthUser = {
        id: userId,
        nome: data.nome,
        email: data.email,
      }

      return { token: loginResponse.token, user }
    } catch {
      throw new Error(
        'Conta criada! Faça login para continuar.',
      )
    }
  },

  logout: async (): Promise<void> => {
    storage.removeItem(TOKEN_STORAGE_KEY)
  },
}
