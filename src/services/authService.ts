import { api } from '#/lib/axios'
import type { LoginFormData, SignUpFormData } from '#/schemas/authSchema'
import { storage } from '#/lib/storage'

export interface AuthUser {
  id: string
  nome: string
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export const authService = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    // TODO: Descomentar quando a API estiver pronta
    // const { data: response } = await api.post<AuthResponse>('/auth/login', {
    //   email: data.email,
    //   senha: data.senha,
    // })
    // return response

    // Mock temporário
    void api // evitar erro de "importado mas não usado" durante fase mock
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-token-12345',
          user: { id: '1', nome: 'Usuário Tur.', email: data.email },
        })
      }, 800)
    })
  },

  register: async (data: SignUpFormData): Promise<AuthResponse> => {
    // TODO: Descomentar quando a API estiver pronta
    // const { data: response } = await api.post<AuthResponse>('/auth/register', {
    //   nome: data.nome,
    //   email: data.email,
    //   senha: data.senha,
    // })
    // return response

    // Mock temporário
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'mock-token-12345',
          user: { id: '1', nome: data.nome, email: data.email },
        })
      }, 1000)
    })
  },

  logout: async (): Promise<void> => {
    // TODO: Descomentar quando a API estiver pronta
    // await api.post('/auth/logout')

    storage.removeItem('tur_token')
  },
}
