import { z } from 'zod'

// Regex do CEP conforme contrato: ^\d{5}-?\d{3}$
const ZIPCODE_REGEX = /^\d{5}-?\d{3}$/

/**
 * Schema do formulário de criação de ponto turístico.
 * Campos em português para compatibilidade com a UI existente.
 * O service mapeia para TouristPointRequest antes de enviar à API.
 *
 * Mudanças em relação ao schema anterior:
 * - `categorias`: agora armazena UUIDs (string) dos IDs reais da API
 * - `acessibilidades`: agora armazena IDs numéricos dos tipos de acessibilidade
 * - `estado` (sigla) substituído por `stateId` (number) vindo de GET /states
 * - `cep` com regex do contrato; `nome` com limites 5–100 chars
 */
export const spotSchema = z.object({
  nome: z
    .string()
    .min(1, 'Por favor, digite o nome do ponto turístico.')
    .min(5, 'O nome deve ter no mínimo 5 caracteres.')
    .max(100, 'O nome deve ter no máximo 100 caracteres.'),
  descricao: z.string().min(1, 'Por favor, informe uma breve descrição.'),
  // UUIDs reais de GET /categories — validados com uuid()
  categorias: z
    .array(z.string().uuid('ID de categoria inválido.'))
    .min(1, 'Por favor, selecione pelo menos uma categoria.'),
  // IDs numéricos de GET /accessibility-types
  acessibilidades: z.array(z.number().int()),
  cep: z
    .string()
    .min(1, 'Por favor, informe o CEP.')
    .regex(ZIPCODE_REGEX, 'CEP deve estar no formato 00000-000 ou 00000000.'),
  rua: z.string().min(1, 'Por favor, informe a rua / logradouro.'),
  bairro: z.string().min(1, 'Por favor, informe o bairro.'),
  cidade: z.string().min(1, 'Por favor, informe a cidade.'),
  // ID numérico do estado vindo de GET /states (substitui sigla string)
  stateId: z
    .number({ message: 'Por favor, selecione um estado.' })
    .int()
    .positive('Por favor, selecione um estado.'),
  complemento: z.string().optional(),
})

export type SpotFormData = z.infer<typeof spotSchema>

export const editSpotSchema = spotSchema.pick({
  nome: true,
  descricao: true,
})
export type EditSpotFormData = z.infer<typeof editSpotSchema>

export const editAddressSchema = spotSchema.pick({
  cep: true,
  rua: true,
  bairro: true,
  cidade: true,
  stateId: true,
  complemento: true,
})
export type EditAddressFormData = z.infer<typeof editAddressSchema>
