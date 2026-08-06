// Tipos centralizados de Spot — usados pelo serviço, hooks e componentes.
// Os dados mock em src/data/spots.ts importam deste arquivo.
// Quando a API estiver conectada, este arquivo define o contrato de resposta.

export interface SpotReview {
  id: string
  user: string
  avatarUrl: string
  text: string
  rating?: number
}

export interface Spot {
  id: string
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
  reviews?: SpotReview[]
}
