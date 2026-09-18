import { api } from '#/lib/axios'
import { handleApiError } from '#/lib/apiError'
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
      handleApiError(err, {
        400: 'Categoria inválida ou já existe.',
        401: 'Você precisa estar logado para criar uma categoria.',
        404: 'Usuário autenticado não encontrado.',
      }, 'Erro ao criar a categoria. Tente novamente.')
    }
  },

  /**
   * PATCH /categories/tourist-point/:id
   * Atualiza as categorias de um ponto turístico.
   */
  updateSpotCategories: async (spotId: string, categoriesIds: string[]): Promise<void> => {
    await api.patch(`/categories/tourist-point/${spotId}`, { categoriesIds })
  },
}
