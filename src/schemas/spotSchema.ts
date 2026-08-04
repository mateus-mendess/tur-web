import { z } from 'zod'

export const spotSchema = z.object({
  nome: z.string().min(1, 'Por favor, digite o nome do ponto turístico.'),
  descricao: z.string().min(1, 'Por favor, informe uma breve descrição.'),
  categorias: z
    .array(z.string())
    .min(1, 'Por favor, selecione pelo menos uma categoria.'),
  acessibilidades: z.array(z.string()),
  cep: z.string().min(1, 'Por favor, informe o CEP.'),
  rua: z.string().min(1, 'Por favor, informe a rua / logradouro.'),
  bairro: z.string().min(1, 'Por favor, informe o bairro.'),
  cidade: z.string().min(1, 'Por favor, informe a cidade.'),
  estado: z.string().min(1, 'Por favor, selecione um estado.'),
  complemento: z.string(),
})

export type SpotFormData = z.infer<typeof spotSchema>
