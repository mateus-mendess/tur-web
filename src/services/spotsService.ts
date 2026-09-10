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

const mockSpots: TouristPointResponse[] = [
  {
    id: 'mock-1',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Lençóis Maranhenses',
    description: 'Um deserto de areias brancas com lagoas cristalinas incríveis.',
    accessibilityTypes: [{ id: 1, name: 'Trilha Acessível' }],
    address: { street: 'Parque Nacional', city: 'Barreirinhas', state: 'Maranhão', zipcode: '65590-000', neighborhood: 'Zona Rural', complement: '' },
    photos: [{ id: 'photo-1', url: 'https://images.unsplash.com/photo-1549421295-884d5df68b8e?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-1', name: 'Natureza' }]
  },
  {
    id: 'mock-2',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Chapada Diamantina',
    description: 'Montanhas deslumbrantes, cachoeiras e grutas de águas azuis.',
    accessibilityTypes: [],
    address: { street: 'Parque Nacional', city: 'Lençóis', state: 'Bahia', zipcode: '46960-000', neighborhood: 'Zona Rural', complement: '' },
    photos: [{ id: 'photo-2', url: 'https://images.unsplash.com/photo-1616781986420-008271101ab0?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-1', name: 'Aventura' }]
  },
  {
    id: 'mock-3',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Cristo Redentor',
    description: 'Uma das sete maravilhas do mundo moderno, vigiando a cidade maravilhosa.',
    accessibilityTypes: [{ id: 2, name: 'Elevador' }, { id: 3, name: 'Rampa' }],
    address: { street: 'Parque Nacional da Tijuca', city: 'Rio de Janeiro', state: 'Rio de Janeiro', zipcode: '22241-125', neighborhood: 'Alto da Boa Vista', complement: '' },
    photos: [{ id: 'photo-3', url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-3', name: 'Monumento' }]
  },
  {
    id: 'mock-4',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Jalapão',
    description: 'Fervedouros de águas transparentes e dunas alaranjadas no coração do Brasil.',
    accessibilityTypes: [],
    address: { street: 'Parque Estadual', city: 'Mateiros', state: 'Tocantins', zipcode: '77593-000', neighborhood: 'Zona Rural', complement: '' },
    photos: [{ id: 'photo-4', url: 'https://images.unsplash.com/photo-1598418045330-8041c215d2ea?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-1', name: 'Ecoturismo' }]
  },
  {
    id: 'mock-5',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Fernando de Noronha',
    description: 'Um arquipélago paradisíaco com as praias mais bonitas do mundo.',
    accessibilityTypes: [],
    address: { street: 'Vila dos Remédios', city: 'Fernando de Noronha', state: 'Pernambuco', zipcode: '53990-000', neighborhood: 'Centro', complement: '' },
    photos: [{ id: 'photo-5', url: 'https://images.unsplash.com/photo-1559405629-9e8a719c2eb0?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-4', name: 'Praia' }]
  },
  {
    id: 'mock-6',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Ouro Preto',
    description: 'Um museu a céu aberto da história do Brasil com arquitetura barroca.',
    accessibilityTypes: [],
    address: { street: 'Praça Tiradentes', city: 'Ouro Preto', state: 'Minas Gerais', zipcode: '35400-000', neighborhood: 'Centro Histórico', complement: '' },
    photos: [{ id: 'photo-6', url: 'https://images.unsplash.com/photo-1599818804907-f10f4492bf22?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-5', name: 'Histórico' }]
  },
  {
    id: 'mock-7',
    userId: 'user-1',
    userName: 'Mock User',
    name: 'Cataratas do Iguaçu',
    description: 'O maior conjunto de quedas de água do mundo, impressionante pela sua força.',
    accessibilityTypes: [{ id: 4, name: 'Passarela Acessível' }, { id: 5, name: 'Ônibus Adaptado' }],
    address: { street: 'BR-469', city: 'Foz do Iguaçu', state: 'Paraná', zipcode: '85855-750', neighborhood: 'Parque Nacional', complement: '' },
    photos: [{ id: 'photo-7', url: 'https://images.unsplash.com/photo-1518182170546-076616fd4628?q=80&w=800&auto=format&fit=crop' }],
    categories: [{ id: 'cat-1', name: 'Natureza' }]
  }
];

export const spotsService = {
  /**
   * GET /tourist-points
   * Lista todos os pontos turísticos ativos. Não requer autenticação.
   */
  getSpots: async (): Promise<TouristPointResponse[]> => {
    // const { data } = await api.get<TouristPointResponse[]>('/tourist-points')
    // return data
    return mockSpots
  },

  /**
   * GET /tourist-points/{id}
   * Detalhe completo de um ponto turístico. Não requer autenticação.
   * Lança erro com mensagem legível em caso de 404.
   */
  getSpotById: async (id: string): Promise<TouristPointResponse> => {
    // MOCK TEMPORÁRIO PARA TESTE DE UI
    const mock = mockSpots.find(s => s.id === id) || { ...mockSpots[0], id }
    return Promise.resolve(mock)

    /*
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
    */
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
