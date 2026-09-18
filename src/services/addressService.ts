import { api } from '#/lib/axios'
import { handleApiError } from '#/lib/apiError'
import type { AddressRequest } from '#/types/api'

export const addressService = {
  /**
   * PUT /addresses/tourist-point/{id}
   * Atualiza o endereço de um ponto turístico existente.
   * Revalida coordenadas via geocoding.
   * Requer autenticação (assumido — ver nota no contrato).
   *
   * Trata 503 com mensagem específica (geocoding falhou).
   */
  updateAddress: async (
    touristPointId: string,
    address: AddressRequest,
  ): Promise<void> => {
    try {
      await api.put(`/addresses/tourist-point/${touristPointId}`, address)
    } catch (err) {
      handleApiError(err, {
        404: 'Ponto turístico ou estado não encontrado.',
        503: 'Não conseguimos localizar esse endereço. Verifique o CEP e tente novamente.',
      }, 'Erro ao atualizar o endereço. Tente novamente.')
    }
  },
}
