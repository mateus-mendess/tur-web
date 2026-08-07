import { api } from '#/lib/axios'
import type { StateResponse } from '#/types/api'

export const statesService = {
  /**
   * GET /states
   * Lista os 27 estados brasileiros.
   * Não requer autenticação. Dados estáticos — usar com staleTime alto.
   */
  getStates: async (): Promise<StateResponse[]> => {
    const { data } = await api.get<StateResponse[]>('/states')
    return data
  },
}
