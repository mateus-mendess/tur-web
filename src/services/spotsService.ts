import { FEATURED_SPOTS as mockSpots } from '../data/spots'
import type { Spot } from '../data/spots'
import type { SpotFormData } from '../schemas/spotSchema'

// Mock state simulando DB em memória
let localSpots = [...mockSpots]

export const spotsService = {
  getSpots: async (): Promise<Spot[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localSpots)
      }, 800)
    })
  },

  getSpotById: async (id: string): Promise<Spot | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localSpots.find((s) => s.id === id))
      }, 500)
    })
  },

  createSpot: async (data: SpotFormData): Promise<Spot> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSpot: Spot = {
          id: String(Date.now()),
          number: String(localSpots.length + 1).padStart(2, '0'),
          name: data.nome,
          location: `${data.cidade}, ${data.estado}`,
          category: data.categorias[0] || 'Turismo',
          imageUrl:
            'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
          rating: 0,
          author: { name: 'Usuário Atual', handle: '@usuario.atual' },
          tags: data.categorias.map((c) => `#${c}`),
          description: data.descricao,
          accessibility: data.acessibilidades,
          gallery: [],
          address: `${data.rua}, ${data.bairro} - ${data.cidade} / ${data.estado}`,
        }
        localSpots = [newSpot, ...localSpots]
        resolve(newSpot)
      }, 1000)
    })
  },
}
