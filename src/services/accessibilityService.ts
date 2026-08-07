import axios from 'axios'
import { api } from '#/lib/axios'
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
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          throw new Error(
            'Você precisa estar logado para atualizar a acessibilidade.',
          )
        }
        if (status === 403) {
          throw new Error(
            'Você não tem permissão para atualizar a acessibilidade deste ponto.',
          )
        }
        if (status === 404) {
          throw new Error(
            'Ponto turístico ou tipo de acessibilidade não encontrado.',
          )
        }
      }
      throw new Error('Erro ao atualizar a acessibilidade. Tente novamente.')
    }
  },
}
