import axios from 'axios'
import { api } from '#/lib/axios'
import type { CategoryResponse } from '#/types/api'

export const categoriesService = {
  /**
   * GET /categories
   * Lista todas as categorias ativas. Não requer autenticação.
   */
  getCategories: async (): Promise<CategoryResponse[]> => {
    const { data } = await api.get<CategoryResponse[]>('/categories')
    return data
  },

  /**
   * POST /categories
   * Cria uma nova categoria. Requer autenticação.
   * Retorna o objeto da categoria criada (incluindo o UUID gerado pelo backend).
   * Nota: o contrato documenta "sem shape de retorno" — na prática, espera-se
   * CategoryResponse; validar no teste manual.
   */
  createCategory: async (name: string): Promise<CategoryResponse> => {
    try {
      const { data } = await api.post<CategoryResponse>('/categories', { name })
      return data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 400) {
          const message =
            (err.response?.data as { message?: string } | undefined)
              ?.message ?? 'Categoria inválida ou já existe.'
          throw new Error(message)
        }
        if (status === 401) {
          throw new Error('Você precisa estar logado para criar uma categoria.')
        }
        if (status === 404) {
          throw new Error('Usuário autenticado não encontrado.')
        }
      }
      throw new Error('Erro ao criar a categoria. Tente novamente.')
    }
  },
}
