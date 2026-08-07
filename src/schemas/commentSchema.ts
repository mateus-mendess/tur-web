import { z } from 'zod'

// Regex espelhando CommentRequest.authorName no contrato
const AUTHOR_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$/

export const commentSchema = z.object({
  content: z.string().min(1, 'Por favor, escreva seu comentário.'),
  note: z
    .number({ required_error: 'Por favor, informe a nota.' })
    .int()
    .min(1, 'A nota deve ser entre 1 e 5.')
    .max(5, 'A nota deve ser entre 1 e 5.'),
  authorName: z
    .string()
    .min(1, 'Por favor, informe seu nome.')
    .regex(
      AUTHOR_NAME_REGEX,
      'O nome deve ter entre 2 e 100 caracteres e conter apenas letras e espaços.',
    ),
})

export type CommentFormData = z.infer<typeof commentSchema>
