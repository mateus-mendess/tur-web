export interface Spot {
  id: string;
  number: string;
  name: string;
  location: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
  accessibility?: string[];
}

export const FEATURED_SPOTS: Spot[] = [
  {
    id: '1',
    number: '01',
    name: 'Cristo Redentor',
    location: 'Rio de Janeiro, RJ',
    category: 'Histórico',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Mateus Mendes',
      handle: '@mateus.mendes',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso', 'Acessível para PCD'],
  },
  {
    id: '2',
    number: '02',
    name: 'Lençóis Maranhenses',
    location: 'Barreirinhas, MA',
    category: 'Natureza',
    imageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Lucas Silva',
      handle: '@lucas.viajante',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
  },
  {
    id: '3',
    number: '03',
    name: 'Pelourinho Histórico',
    location: 'Salvador, BA',
    category: 'Histórico',
    imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ana Souza',
      handle: '@ana.souza',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso'],
  },
  {
    id: '4',
    number: '04',
    name: 'Chapada Diamantina',
    location: 'Lençóis, BA',
    category: 'Ecoturismo',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Carlos Oliveira',
      handle: '@carlos.trilhas',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
  },
  {
    id: '5',
    number: '05',
    name: 'Cataratas do Iguaçu',
    location: 'Foz do Iguaçu, PR',
    category: 'Ecoturismo',
    imageUrl: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Tur. Comunidade',
      handle: '@tur.oficial',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso', 'Acessível para PCD', 'Audiodescrição'],
  },
  {
    id: '6',
    number: '06',
    name: 'Fernando de Noronha',
    location: 'Noronha, PE',
    category: 'Praias',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Marina Santos',
      handle: '@marina.praias',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: [],
  },
  {
    id: '7',
    number: '07',
    name: 'Mercado Municipal',
    location: 'São Paulo, SP',
    category: 'Gastronomia',
    imageUrl: 'https://images.unsplash.com/photo-1629813137979-42b7bd77b78a?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'João Pedro',
      handle: '@joao.foodie',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    accessibility: ['Rampa de acesso', 'Acessível para PCD'],
  }
];
