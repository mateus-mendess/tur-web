import { api } from '#/lib/axios'
import { handleApiError } from '#/lib/apiError'
import type { AccessibilityTypeResponse } from '#/types/api'

export const accessibilityService = {
  /**
   * GET /accessibility-types
   * Lista todos os tipos de acessibilidade. Não requer autenticação.
   */
  getAccessibilityTypes: async (): Promise<AccessibilityTypeResponse[]> => {
    const { data } =
      await api.get<AccessibilityTypeResponse[]>('/accessibility-types')
    return data
  },

  /**
   * PATCH /accessibility-types/tourist-point/{id}
   * Substitui (não mescla) todos os tipos de acessibilidade de um ponto.
   * Enviar a lista completa desejada — não um diff.
   * Requer autenticação (apenas o dono).
   */
  updateAccessibility: async (
    touristPointId: string,
    accessibilityTypesIds: number[],
  ): Promise<void> => {
    try {
      await api.patch(`/accessibility-types/tourist-point/${touristPointId}`, {
        accessibilityTypesIds,
      })
    } catch (err) {
      handleApiError(err, {
        401: 'Você precisa estar logado para atualizar a acessibilidade.',
        403: 'Você não tem permissão para atualizar a acessibilidade deste ponto.',
        404: 'Ponto turístico ou tipo de acessibilidade não encontrado.',
      }, 'Erro ao atualizar a acessibilidade. Tente novamente.')
    }
  },
}
