import { z } from 'zod'

/**
 * Schema para criação de categoria.
 * Nota: o contrato usa regex sem âncora inicial ([A-Za-z...]{2,100}$).
 * Aqui usamos a versão ancorada (^...$) — mais restritiva no front,
 * o que é preferível para evitar surpresas com o comportamento do backend.
 * Ver seção 10, item 3 do contrato.
 */
const CATEGORY_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$/

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Por favor, informe o nome da categoria.')
    .max(30, 'O nome da categoria deve ter no máximo 30 caracteres.')
    .regex(
      CATEGORY_NAME_REGEX,
      'O nome deve ter entre 2 e 30 caracteres e conter apenas letras e espaços.',
    ),
})

export type CategoryFormData = z.infer<typeof categorySchema>
