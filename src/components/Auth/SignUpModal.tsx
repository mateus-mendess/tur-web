import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { Checkbox } from '#/components/UI/Checkbox'
import { signUpSchema } from '#/schemas/authSchema'
import type { SignUpFormData } from '#/schemas/authSchema'

export interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: (email?: string) => void
  onSignUp: (data: SignUpFormData) => Promise<void>
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignUp,
}: SignUpModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      aceitoTermos: undefined,
    },
  })

  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  useEffect(() => {
    if (!isOpen) {
      setButtonStatus('idle')
    }
  }, [isOpen])

  const aceitoTermos = watch('aceitoTermos')

  const onSubmit = handleSubmit(async (data) => {
    setButtonStatus('loading')
    try {
      await onSignUp(data)
      setButtonStatus('success')
      
      setTimeout(() => {
        onClose()
        if (onSwitchToLogin) onSwitchToLogin(data.email)
      }, 700)
    } catch (error: any) {
      setButtonStatus('idle')
      const errData = error?.response?.data
      if (errData?.field && errData?.detail) {
        if (['nome', 'email', 'senha', 'confirmarSenha', 'aceitoTermos'].includes(errData.field)) {
          setError(errData.field as keyof SignUpFormData, { message: errData.detail })
        } else {
          setError('root', { message: errData.detail })
        }
      } else {
        setError('root', {
          message: 'Não foi possível criar sua conta. Tente novamente.',
        })
      }
    }
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="signup-title">
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[560px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-dm-sans text-[26px] font-normal text-tur-gray-600 tracking-[3px] uppercase m-0 leading-[1.2]">
              Bem-vindo
            </h3>
          </div>

          <div className="z-[3] relative font-inter text-[15px] text-tur-gray-700 leading-[1.6] font-normal">
            Preencha os dados ao lado para criar sua conta no tur.
          </div>

          <div className="mt-auto pt-8 z-[3] relative font-inter text-sm text-tur-gray-700 leading-normal font-normal">
            Já é um membro?{' '}
            <Button
              variant="ghost"
              type="button"
              className="inline font-semibold underline underline-offset-[3px]"
              onClick={() => (onSwitchToLogin ? onSwitchToLogin() : onClose())}
            >
              Faça login agora
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
              id="signup-title"
              className="font-dm-sans text-[28px] font-semibold text-tur-dark tracking-[-0.5px] m-0 mb-2"
            >
              Cadastre-se para explorar
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

            {/* NOME COMPLETO */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-nome" required>
                Nome Completo
              </Label>
              <Input
                id="signup-nome"
                type="text"
                placeholder="Digite seu nome completo"
                error={!!errors.nome}
                {...register('nome')}
              />
              {errors.nome && (
                <span className="font-inter text-xs text-tur-red font-medium">
                  {errors.nome.message}
                </span>
              )}
            </div>

            {/* E-MAIL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-email" required>
                E-mail
              </Label>
              <Input
                id="signup-email"
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

            {/* SENHA & CONFIRMAR SENHA */}
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-senha" required>
                  Senha
                </Label>
                <Input
                  id="signup-senha"
                  type="password"
                  placeholder="Senha"
                  error={!!errors.senha}
                  {...register('senha')}
                />
                {errors.senha && (
                  <span className="font-inter text-xs text-tur-red font-medium">
                    {errors.senha.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-confirmar" required>
                  Confirmar Senha
                </Label>
                <Input
                  id="signup-confirmar"
                  type="password"
                  placeholder="Repita a senha"
                  error={!!errors.confirmarSenha}
                  {...register('confirmarSenha')}
                />
                {errors.confirmarSenha && (
                  <span className="font-inter text-xs text-tur-red font-medium">
                    {errors.confirmarSenha.message}
                  </span>
                )}
              </div>
            </div>

            {/* TERMOS DE USO */}
            <div className="flex flex-col gap-1">
              <div className="flex items-start gap-2.5 mt-2">
                <Checkbox
                  id="signup-terms"
                  checked={!!aceitoTermos}
                  onChange={(e) =>
                    setValue(
                      'aceitoTermos',
                      e.target.checked ? true : (undefined as unknown as true),
                      { shouldValidate: true },
                    )
                  }
                />
                <label
                  htmlFor="signup-terms"
                  className="font-inter text-[13px] text-tur-gray-700 leading-[1.4] cursor-pointer select-none"
                >
                  Li e aceito os{' '}
                  <a
                    href="#termos"
                    className="text-tur-dark font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-tur-accent"
                    onClick={(e) => e.preventDefault()}
                  >
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a
                    href="#privacidade"
                    className="text-tur-dark font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-tur-accent"
                    onClick={(e) => e.preventDefault()}
                  >
                    Política de Privacidade
                  </a>
                  .
                </label>
              </div>
              {errors.aceitoTermos && (
                <span className="font-inter text-xs text-tur-red font-medium">
                  {errors.aceitoTermos.message}
                </span>
              )}
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-3">
              <Button
                type="submit"
                className="w-[180px] transition-all duration-300"
                disabled={buttonStatus === 'loading' || buttonStatus === 'success'}
              >
                {buttonStatus === 'idle' && 'Criar conta'}
                {buttonStatus === 'loading' && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {buttonStatus === 'success' && (
                  <svg className="h-6 w-6 text-white transform transition-transform duration-300 scale-100 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
