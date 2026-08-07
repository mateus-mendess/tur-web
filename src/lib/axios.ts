import axios from 'axios'
import { storage } from './storage'

const BASE_URL =
  (import.meta.env['VITE_API_URL'] as string | undefined) ??
  'http://localhost:8081'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
})

// Injeta o token Bearer em todas as requisições autenticadas
api.interceptors.request.use((config) => {
  const token = storage.getItem('tur_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Trata erros globais de resposta
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status
      if (status === 401) {
        // Token expirado ou inválido — limpar sessão
        storage.removeItem('tur_token')
        // Redirecionar para home se necessário (implementar quando tiver auth real)
      }
    }
    return Promise.reject(error)
  },
)
