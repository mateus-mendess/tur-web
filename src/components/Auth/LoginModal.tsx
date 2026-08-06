import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '../UI/BaseModal'
import { Input } from '../UI/Input'
import { Label } from '../UI/Label'
import { Button } from '../UI/Button'
import { Checkbox } from '../UI/Checkbox'
import { loginSchema, type LoginFormData } from '../../schemas/authSchema'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
  onLogin: (data: LoginFormData) => Promise<void>
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLogin,
}: LoginModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      senha: '',
      manterConectado: false,
    },
  })

  const manterConectado = watch('manterConectado')

  const onSubmit = handleSubmit(async (data) => {
    try {
      await onLogin(data)
    } catch {
      setError('root', {
        message: 'E-mail ou senha incorretos. Verifique seus dados.',
      })
    }
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="login-title">
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[520px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-dm-sans text-[26px] font-normal text-tur-gray-600 tracking-[3px] uppercase m-0 leading-[1.2]">
              Bem-vindo
            </h3>
          </div>

          <div className="z-[3] relative font-inter text-[15px] text-tur-gray-700 leading-[1.6] font-normal">
            Entre na sua conta e continue explorando o Brasil.
          </div>

          <div className="mt-auto pt-8 z-[3] relative font-inter text-sm text-tur-gray-700 leading-normal font-normal">
            Ainda não tem conta?{' '}
            <Button
              variant="ghost"
              type="button"
              className="inline font-semibold underline underline-offset-[3px]"
              onClick={onSwitchToSignUp ?? onClose}
            >
              Cadastre-se agora
            </Button>
          </div>
        </div>

        {/* COLUNA DA DIREITA — FORMULÁRIO */}
        <div className="relative bg-white p-[50px_44px_36px_44px] max-md:p-[32px_24px] flex flex-col justify-between">
          <div className="absolute top-6 right-8 max-md:hidden">
            <img
              src="/assets/images/selo-img.png"
              alt="Selo postal"
              className="w-[95px] h-auto object-contain drop-shadow-sm opacity-90 grayscale-[0.2]"
            />
          </div>

          <div className="mb-2 max-md:block hidden">
            <h2
              id="login-title"
              className="font-dm-sans text-[28px] font-semibold text-tur-dark tracking-[-0.5px] m-0 mb-2"
            >
              Acesse sua conta
            </h2>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
          >
            {/* Erro global da API */}
            {errors.root && (
              <div className="font-inter text-xs text-tur-red mt-0.5">
                {errors.root.message}
              </div>
            )}

            {/* E-MAIL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-email" required>
                E-mail
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="seuemail@exemplo.com"
                error={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <span className="font-inter text-xs text-tur-red font-medium">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* SENHA */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="login-senha" required>
                  Senha
                </Label>
                <a
                  href="#esqueci-senha"
                  className="font-inter text-xs text-tur-gray-600 hover:text-tur-accent underline underline-offset-2 transition-colors duration-200"
                  onClick={(e) => {
                    e.preventDefault()
                  }}
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="login-senha"
                type="password"
                placeholder="Sua senha"
                error={!!errors.senha}
                {...register('senha')}
              />
              {errors.senha && (
                <span className="font-inter text-xs text-tur-red font-medium">
                  {errors.senha.message}
                </span>
              )}
            </div>

            {/* MANTER CONECTADO */}
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="login-remember"
                checked={manterConectado ?? false}
                onChange={(e) => setValue('manterConectado', e.target.checked)}
              />
              <label
                htmlFor="login-remember"
                className="font-inter text-[13px] text-tur-gray-700 cursor-pointer select-none"
              >
                Manter conectado
              </label>
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-3">
              <Button type="submit" className="w-[180px]" disabled={isSubmitting}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
