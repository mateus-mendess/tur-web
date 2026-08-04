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

  // New fields for SpotDetailModal
  rating?: number
  publishedAt?: string
  description?: string
  tags?: string[]
  address?: string
  gallery?: string[]
  reviews?: SpotReview[]
}

const mockReviews: SpotReview[] = [
  {
    id: 'r1',
    user: 'Camila R.',
    avatarUrl: '',
    rating: 5.0,
    text: 'Lugar incrível, vista de tirar o fôlego! Recomendo chegar cedo para evitar filas.',
  },
  {
    id: 'r2',
    user: 'Marcos T.',
    avatarUrl: '',
    rating: 4.8,
    text: 'Experiência única. A infraestrutura melhorou bastante nos últimos anos.',
  },
  {
    id: 'r3',
    user: 'Juliana P.',
    avatarUrl: '',
    rating: 5.0,
    text: 'Um dos melhores passeios que já fiz. Inesquecível a energia do local!',
  },
  {
    id: 'r4',
    user: 'Rafael M.',
    avatarUrl: '',
    rating: 4.5,
    text: 'Perfeito para fotos, mas vá preparado para andar bastante e levar água.',
  },
  {
    id: 'r5',
    user: 'Beatriz L.',
    avatarUrl: '',
    rating: 5.0,
    text: 'Atendimento e recepção muito amigáveis. Um cartão postal impecável.',
  },
  {
    id: 'r6',
    user: 'Diego S.',
    avatarUrl: '',
    rating: 4.9,
    text: 'Vista fantástica da cidade inteira. O por do sol aqui é incomparável.',
  },
  {
    id: 'r7',
    user: 'Fernanda K.',
    avatarUrl: '',
    rating: 4.7,
    text: 'Muito bem conservado e com boa sinalização para os visitantes.',
  },
  {
    id: 'r8',
    user: 'Gustavo H.',
    avatarUrl: '',
    rating: 5.0,
    text: 'Vale cada segundo da visita. Dica: compre os ingressos online com antecedência.',
  },
  {
    id: 'r9',
    user: 'Patrícia A.',
    avatarUrl: '',
    rating: 4.8,
    text: 'Experiência sensacional para levar toda a família!',
  },
  {
    id: 'r10',
    user: 'Leonardo F.',
    avatarUrl: '',
    rating: 5.0,
    text: 'Um verdadeiro patrimônio histórico e cultural. Fiquei deslumbrado.',
  },
]

export const FEATURED_SPOTS: Spot[] = [
  {
    id: '1',
    number: '01',
    name: 'Cristo Redentor',
    location: 'Rio de Janeiro, RJ',
    category: 'Histórico',
    imageUrl:
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Mateus Mendes',
      handle: '@mateus.mendes',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [
      'Rampa de acesso',
      'Acessível para PCD',
      'Elevador panorâmico',
    ],
    rating: 4.9,
    publishedAt: 'Outubro, 2023',
    description:
      'O Cristo Redentor é um dos maiores símbolos do Brasil, localizado no topo do morro do Corcovado. Com 38 metros de altura, a estátua oferece uma vista panorâmica deslumbrante da cidade do Rio de Janeiro, incluindo o Pão de Açúcar, a Baía de Guanabara e as praias de Copacabana e Ipanema. É um passeio imperdível para quem visita a cidade maravilhosa.',
    tags: ['#Histórico', '#CartãoPostal', '#Vistas', '#Família'],
    address:
      'Parque Nacional da Tijuca - Alto da Boa Vista, Rio de Janeiro - RJ',
    gallery: [
      'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518666012465-38550478db19?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591113222379-3fb76f626f2a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571439226500-11b43d3b76cf?q=80&w=800&auto=format&fit=crop',
    ],
    reviews: mockReviews,
  },
  {
    id: '2',
    number: '02',
    name: 'Lençóis Maranhenses',
    location: 'Barreirinhas, MA',
    category: 'Natureza',
    imageUrl:
      'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Lucas Silva',
      handle: '@lucas.viajante',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
    rating: 4.8,
    publishedAt: 'Julho de 2023',
    description:
      'O Parque Nacional dos Lençóis Maranhenses é um paraíso ecológico com suas vastas dunas de areia branca e lagoas de água doce cristalina que se formam na época das chuvas. Um dos cenários mais exóticos e belos do mundo.',
    tags: ['#Natureza', '#Aventura', '#Trilhas', '#Exótico'],
    address: 'Parque Nacional dos Lençóis Maranhenses, MA',
    gallery: [
      'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596701389335-51978d38096f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1629813137979-42b7bd77b78a?q=80&w=800&auto=format&fit=crop', // Reusing images for mock
    ],
    reviews: mockReviews.slice(1, 3),
  },
  {
    id: '3',
    number: '03',
    name: 'Pelourinho Histórico',
    location: 'Salvador, BA',
    category: 'Histórico',
    imageUrl:
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ana Souza',
      handle: '@ana.souza',
      avatarUrl:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso'],
    rating: 4.7,
    publishedAt: 'Janeiro de 2024',
    description:
      'O Pelourinho é o coração histórico de Salvador. Suas ruas de paralelepípedos são cercadas por casarões coloniais coloridos e igrejas barrocas, muita música, cultura afro-brasileira e culinária típica.',
    tags: ['#Cultura', '#Música', '#Histórico', '#Gastronomia'],
    address: 'Largo do Pelourinho, Centro Histórico, Salvador - BA',
    gallery: [
      'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1626245155998-251f288fb983?q=80&w=800&auto=format&fit=crop',
    ],
    reviews: mockReviews.slice(0, 2),
  },
  {
    id: '4',
    number: '04',
    name: 'Chapada Diamantina',
    location: 'Lençóis, BA',
    category: 'Ecoturismo',
    imageUrl:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Carlos Oliveira',
      handle: '@carlos.trilhas',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
  },
  {
    id: '5',
    number: '05',
    name: 'Cataratas do Iguaçu',
    location: 'Foz do Iguaçu, PR',
    category: 'Ecoturismo',
    imageUrl:
      'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Tur. Comunidade',
      handle: '@tur.oficial',
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso', 'Acessível para PCD', 'Audiodescrição'],
  },
  {
    id: '6',
    number: '06',
    name: 'Fernando de Noronha',
    location: 'Noronha, PE',
    category: 'Praias',
    imageUrl:
      'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Marina Santos',
      handle: '@marina.praias',
      avatarUrl:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
  },
  {
    id: '7',
    number: '07',
    name: 'Mercado Municipal',
    location: 'São Paulo, SP',
    category: 'Gastronomia',
    imageUrl:
      'https://images.unsplash.com/photo-1629813137979-42b7bd77b78a?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'João Pedro',
      handle: '@joao.foodie',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso', 'Acessível para PCD'],
  },
]
