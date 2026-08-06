import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  senha: z
    .string()
    .min(1, 'Por favor, informe sua senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  manterConectado: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signUpSchema = z
  .object({
    nome: z
      .string()
      .min(1, 'Por favor, informe seu nome.')
      .min(2, 'O nome deve ter no mínimo 2 caracteres.'),
    email: z.string().email('Informe um e-mail válido.'),
    senha: z
      .string()
      .min(1, 'Por favor, crie uma senha.')
      .min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    confirmarSenha: z.string().min(1, 'Por favor, confirme sua senha.'),
    aceitoTermos: z.literal(true, {
      message: 'Você deve aceitar os Termos de Uso para continuar.',
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  })

export type SignUpFormData = z.infer<typeof signUpSchema>
