// Tipos centralizados da API tur-api — shapes de resposta e request conforme contrato.
// Referência: .agents/context/tur-api-endpoints.md

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** POST /auth/login → 200 */
export interface AuthTokenResponse {
  token: string
}

// ─── Users ────────────────────────────────────────────────────────────────────

/** POST /users — request body */
export interface UserRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// ─── States ───────────────────────────────────────────────────────────────────

/** GET /states → 200 (array) */
export interface StateResponse {
  id: number
  name: string
  abbreviation: string
}

// ─── Categories ───────────────────────────────────────────────────────────────

/** GET /categories → 200 (array) */
export interface CategoryResponse {
  id: string // UUID
  name: string
}

/** POST /categories — request body */
export interface CategoryRequest {
  name: string
}

// ─── Accessibility ────────────────────────────────────────────────────────────

/** GET /accessibility-types → 200 (array) */
export interface AccessibilityTypeResponse {
  id: number
  name: string
}

/** PATCH /accessibility-types/tourist-point/{id} — request body */
export interface AccessibilityUpdateRequest {
  accessibilityTypesIds: number[]
}

// ─── Address ──────────────────────────────────────────────────────────────────

/**
 * Endereço aninhado no TouristPointRequest e usado em PUT /addresses/tourist-point/{id}.
 * Nota: stateId (int64) no request; address.state (string = nome) na resposta.
 */
export interface AddressRequest {
  street: string
  complement?: string
  neighborhood: string
  city: string
  zipcode: string
  stateId: number
}

/** Endereço retornado dentro de TouristPointResponse */
export interface AddressResponse {
  street: string
  complement?: string
  neighborhood: string
  city: string
  /** Nome do estado (string), não o ID numérico */
  state: string
  zipcode: string
}

// ─── Photos ───────────────────────────────────────────────────────────────────

/** Shape de foto dentro de TouristPointResponse e provavelmente retornado por POST /photos */
export interface PhotoResponse {
  id: string // UUID
  path: string
}

// ─── Comments ─────────────────────────────────────────────────────────────────

/** GET /tourist-points/{id}/comments → 200 (array) */
export interface CommentResponse {
  content: string
  /** Nota de 1 a 5 */
  note: number
  authorName: string
}

/** POST /tourist-points/{id}/comments — request body */
export interface CommentRequest {
  content: string
  note: number
  authorName: string
}

// ─── Tourist Points ───────────────────────────────────────────────────────────

/**
 * Shape completo retornado por GET /tourist-points, GET /tourist-points/{id} e POST /tourist-points.
 * Referência: seção 3 do contrato.
 */
export interface TouristPointResponse {
  id: string // UUID
  name: string
  description: string
  accessibilityTypes: AccessibilityTypeResponse[]
  address: AddressResponse
  photos: PhotoResponse[]
  categories: CategoryResponse[]
}

/** POST /tourist-points — request body */
export interface TouristPointRequest {
  name: string
  description: string
  /** Array de UUIDs de categorias — mínimo 1 item */
  categoriesIds: string[]
  /** Array de IDs numéricos de tipos de acessibilidade — pode ser vazio */
  accessibilityTypesIds: number[]
  /** Obrigatório na prática (geocoding), embora não marcado no schema OpenAPI) */
  addressRequest: AddressRequest
}

/** PATCH /tourist-points/{id} — request body (campos opcionais) */
export interface TouristPointUpdateRequest {
  name?: string
  description?: string
}
