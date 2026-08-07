import axios from 'axios'
import { api } from '#/lib/axios'
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
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 404) {
          throw new Error('Ponto turístico ou estado não encontrado.')
        }
        if (status === 503) {
          throw new Error(
            'Não conseguimos localizar esse endereço. Verifique o CEP e tente novamente.',
          )
        }
      }
      throw new Error('Erro ao atualizar o endereço. Tente novamente.')
    }
  },
}
