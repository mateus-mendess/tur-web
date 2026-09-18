import { api } from '#/lib/axios'
import { handleApiError } from '#/lib/apiError'
import type { SpotFormData } from '#/schemas/spotSchema'
import type {
  TouristPointResponse,
  TouristPointRequest,
  TouristPointUpdateRequest,
} from '#/types/api'



export const spotsService = {
  /**
   * GET /tourist-points
   * Lista todos os pontos turísticos ativos. Não requer autenticação.
   */
  getSpots: async (): Promise<TouristPointResponse[]> => {
    const { data } = await api.get<TouristPointResponse[]>('/tourist-points')
    return data
  },

  /**
   * GET /tourist-points/{id}
   * Detalhe completo de um ponto turístico. Não requer autenticação.
   * Lança erro com mensagem legível em caso de 404.
   */
  getSpotById: async (id: string): Promise<TouristPointResponse> => {
    try {
      const { data } = await api.get<TouristPointResponse>(
        `/tourist-points/${id}`,
      )
      return data
    } catch (err) {
      handleApiError(err, {
        404: 'Ponto turístico não encontrado.',
      }, 'Erro ao carregar detalhes do ponto turístico.')
    }
  },

  /**
   * POST /tourist-points
   * Cria um novo ponto turístico. Requer autenticação (token enviado via interceptor).
   * Trata 400 (dados inválidos), 401 (não autenticado), 404 (stateId inválido)
   * e 503 (geocoding falhou — CEP/endereço não localizável).
   */
  createSpot: async (data: SpotFormData): Promise<TouristPointResponse> => {
    try {
      const payload: TouristPointRequest = {
        ...data,
        addressRequest: {
          ...data.addressRequest,
          complement: data.addressRequest.complement || undefined,
        },
      }

      const { data: created } = await api.post<TouristPointResponse>(
        '/tourist-points',
        payload,
      )
      return created
    } catch (err) {
      handleApiError(err, {
        400: 'Dados inválidos. Verifique o formulário.',
        401: 'Você precisa estar logado para cadastrar um ponto.',
        404: 'Estado selecionado não encontrado.',
        503: 'Não conseguimos localizar esse endereço. Verifique o CEP e tente novamente.',
      }, 'Erro ao cadastrar o ponto. Tente novamente.')
    }
  },

  /**
   * PATCH /tourist-points/{id}
   * Atualiza parcialmente nome e/ou descrição. Requer autenticação (apenas o dono).
   * Nota: não atualiza endereço, categorias, acessibilidade nem fotos —
   * cada um tem endpoint próprio.
   */
  updateSpot: async (
    id: string,
    data: TouristPointUpdateRequest,
  ): Promise<void> => {
    try {
      await api.patch(`/tourist-points/${id}`, data)
    } catch (err) {
      handleApiError(err, {
        400: 'Dados inválidos. Verifique os campos.',
        401: 'Você precisa estar logado para editar este ponto.',
        403: 'Você não tem permissão para editar este ponto.',
        404: 'Ponto turístico não encontrado.',
      }, 'Erro ao atualizar o ponto. Tente novamente.')
    }
  },

  /**
   * DELETE /tourist-points/{id}
   * Remove permanentemente um ponto e todos os dados associados.
   * Requer autenticação (apenas o dono).
   */
  deleteSpot: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tourist-points/${id}`)
    } catch (err) {
      handleApiError(err, {
        401: 'Você precisa estar logado para remover este ponto.',
        403: 'Você não tem permissão para remover este ponto.',
        404: 'Ponto turístico não encontrado.',
      }, 'Erro ao remover o ponto. Tente novamente.')
    }
  },
}
