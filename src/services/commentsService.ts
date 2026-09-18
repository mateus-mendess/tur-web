import { api } from '#/lib/axios'
import { handleApiError } from '#/lib/apiError'
import type { CommentResponse, CommentRequest } from '#/types/api'
import { storage, TOKEN_STORAGE_KEY } from '#/lib/storage'

export const commentsService = {
  /**
   * GET /tourist-points/{touristPointId}/comments
   * Lista todos os comentários de um ponto. Não requer autenticação.
   */
  getComments: async (touristPointId: string): Promise<CommentResponse[]> => {

    const { data } = await api.get<CommentResponse[]>(
      `/tourist-points/${touristPointId}/comments`,
    )
    return data
  },

  /**
   * POST /tourist-points/{touristPointId}/comments
   * Submete um comentário com nota (1–5).
   *
   * ⚠️ Inconsistência no contrato (seção 10, item 2):
   * - Descrição textual: não requer autenticação
   * - Schema OpenAPI: define security bearerAuth
   *
   * Implementado para enviar o token SE disponível (via header),
   * sem forçar autenticação. Se a API retornar 401 mesmo com token,
   * o erro é propagado para ajuste futuro.
   */
  createComment: async (
    touristPointId: string,
    comment: CommentRequest,
  ): Promise<void> => {
    try {
      // Verifica se há token disponível para enviar (sem forçar)
      const token = storage.getItem(TOKEN_STORAGE_KEY)
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      await api.post(
        `/tourist-points/${touristPointId}/comments`,
        comment,
        { headers },
      )
    } catch (err) {
      handleApiError(err, {
        400: 'Dados do comentário inválidos.',
        401: 'Você precisa estar logado para comentar.',
        404: 'Ponto turístico não encontrado.',
      }, 'Erro ao enviar o comentário. Tente novamente.')
    }
  },
}
