import axios from 'axios'
import { api } from '#/lib/axios'
import type { SpotFormData } from '#/schemas/spotSchema'
import type {
  TouristPointResponse,
  TouristPointRequest,
  TouristPointUpdateRequest,
} from '#/types/api'

/**
 * Mapeia os campos do formulário (em português) para o formato
 * TouristPointRequest esperado pelo backend.
 */
function toTouristPointRequest(data: SpotFormData): TouristPointRequest {
  return {
    name: data.nome,
    description: data.descricao,
    categoriesIds: data.categorias,
    accessibilityTypesIds: data.acessibilidades,
    addressRequest: {
      street: data.rua,
      complement: data.complemento || undefined,
      neighborhood: data.bairro,
      city: data.cidade,
      zipcode: data.cep,
      stateId: data.stateId,
    },
  }
}

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
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        throw new Error('Ponto turístico não encontrado.')
      }
      throw new Error('Erro ao carregar o ponto turístico. Tente novamente.')
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
      const { data: created } = await api.post<TouristPointResponse>(
        '/tourist-points',
        toTouristPointRequest(data),
      )
      return created
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          throw new Error('Você precisa estar logado para cadastrar um ponto.')
        }
        if (status === 404) {
          throw new Error('Estado selecionado não encontrado.')
        }
        if (status === 503) {
          throw new Error(
            'Não conseguimos localizar esse endereço. Verifique o CEP e tente novamente.',
          )
        }
        if (status === 400) {
          const message =
            (err.response?.data as { message?: string } | undefined)
              ?.message ?? 'Dados inválidos. Verifique o formulário.'
          throw new Error(message)
        }
      }
      throw new Error('Erro ao cadastrar o ponto. Tente novamente.')
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
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          throw new Error('Você precisa estar logado para editar este ponto.')
        }
        if (status === 403) {
          throw new Error('Você não tem permissão para editar este ponto.')
        }
        if (status === 404) {
          throw new Error('Ponto turístico não encontrado.')
        }
        if (status === 400) {
          throw new Error('Dados inválidos. Verifique os campos.')
        }
      }
      throw new Error('Erro ao atualizar o ponto. Tente novamente.')
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
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 401) {
          throw new Error('Você precisa estar logado para remover este ponto.')
        }
        if (status === 403) {
          throw new Error('Você não tem permissão para remover este ponto.')
        }
        if (status === 404) {
          throw new Error('Ponto turístico não encontrado.')
        }
      }
      throw new Error('Erro ao remover o ponto. Tente novamente.')
    }
  },
}
