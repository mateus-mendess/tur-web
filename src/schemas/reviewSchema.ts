import { z } from 'zod'

export const reviewSchema = z.object({
  authorName: z.string().min(1, 'Por favor, informe seu nome.'),
  content: z.string().min(1, 'Por favor, escreva sua avaliação.'),
  note: z.number().min(1, 'Selecione uma nota.').max(5),
})

export type ReviewFormData = z.infer<typeof reviewSchema>
