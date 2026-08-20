// Tipos de UI do Spot — usados pelo SpotCard e SpotDetailModal.
// A interface Spot serve como camada de apresentação dos dados de TouristPointResponse.
// Use toSpot() para converter dados da API para este formato.
import type { TouristPointResponse } from './api'

export interface SpotReview {
  id: string
  user: string
  avatarUrl: string
  text: string
  rating?: number
}

export interface Spot {
  id: string
  userId?: string
  number: string
  name: string
  location: string
  category: string
  imageUrl: string
  author: {
    name: string
    handle: string
    avatarUrl?: string
  }
  accessibility?: string[]

  // Campos de detalhe — presentes na resposta de /spots/:id
  rating?: number
  publishedAt?: string
  description?: string
  tags?: string[]
  address?: string
  gallery?: string[]
  photos?: { id: string; url: string }[]
  reviews?: SpotReview[]
}

/**
 * Adapta um TouristPointResponse (formato da API) para o formato Spot
 * esperado pelos componentes visuais (SpotCard, SpotDetailModal).
 * Permite reutilizar os componentes sem alterar seu JSX.
 */
export function toSpot(tp: TouristPointResponse): Spot {
  const primaryPhotoUrl = tp.photos.length > 0 ? tp.photos[0].url : ''
  return {
    id: tp.id,
    userId: tp.userId,
    number: tp.id.slice(0, 2).toUpperCase(),
    name: tp.name,
    location: `${tp.address.city}, ${tp.address.state}`,
    category: tp.categories.length > 0 ? tp.categories[0].name : '',
    imageUrl: primaryPhotoUrl,
    author: { name: tp.userName, handle: '' },
    accessibility: tp.accessibilityTypes.map((a) => a.name),
    description: tp.description,
    tags: tp.categories.map((c) => `#${c.name}`),
    address: `${tp.address.street}, ${tp.address.neighborhood} - ${tp.address.city} / ${tp.address.state}`,
    gallery: tp.photos.map((p) => p.url),
    photos: tp.photos.map((p) => ({ id: p.id, url: p.url })),
  }
}
