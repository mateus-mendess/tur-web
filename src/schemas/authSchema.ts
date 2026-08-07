import { z } from 'zod'

// Regex espelhando as validações do backend (UserRequest, POST /users).
const NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ ]{2,100}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

export const loginSchema = z.object({
  // Campos em português para compatibilidade com o form existente.
  // O service faz o mapeamento para { email, password } antes de enviar.
  email: z.string().email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Por favor, informe sua senha.'),
  manterConectado: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const signUpSchema = z
  .object({
    nome: z
      .string()
      .min(1, 'Por favor, informe seu nome.')
      .regex(
        NAME_REGEX,
        'O nome deve ter entre 2 e 100 caracteres e conter apenas letras e espaços.',
      ),
    email: z.string().email('Informe um e-mail válido.'),
    senha: z
      .string()
      .min(1, 'Por favor, crie uma senha.')
      .regex(
        PASSWORD_REGEX,
        'A senha deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.',
      ),
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
