// Constantes de domínio — compartilhadas entre explorar.tsx, CreateSpotForm e SearchOverlay.
// Quando a API entregar esses dados dinamicamente, esses arrays serão substituídos
// pelos retornos dos endpoints GET /categorias e GET /acessibilidades.

export const SPOT_CATEGORIES = [
  'Praias',
  'Ecoturismo',
  'Histórico',
  'Gastronomia',
  'Natureza',
  'Aventura',
  'Cultura',
] as const

export type SpotCategory = (typeof SPOT_CATEGORIES)[number]

export const ACCESSIBILITY_OPTIONS = [
  'Acessível para PCD',
  'Rampa de acesso',
  'Audiodescrição',
  'Elevador adaptado',
  'Banheiro acessível',
  'Sinalização tátil',
] as const

export const BRAZILIAN_STATES = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const
