import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { Checkbox } from '#/components/UI/Checkbox'
import { signUpSchema } from '#/schemas/authSchema'
import type { SignUpFormData } from '#/schemas/authSchema'
import { GoogleIcon, GitHubIcon } from '#/components/UI/Icons'
import { OtpInput } from '#/components/UI/OtpInput'

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
  const [view, setView] = useState<'signup' | 'verification'>('signup')
  const [otpValue, setOtpValue] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    reset,
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

  useEffect(() => {
    if (!isOpen) {
      setButtonStatus('idle')
      setView('signup')
      setOtpValue('')
      reset()
    }
  }, [isOpen, reset])

  const aceitoTermos = watch('aceitoTermos')

  const onSubmitSignup = handleSubmit(async (data) => {
    setButtonStatus('loading')
    try {
      await onSignUp(data)

      setButtonStatus('success')
      setRegisteredEmail(data.email)
      
      setTimeout(() => {
        // Transition to verification step
        setButtonStatus('idle')
        setView('verification')
      }, 1000)
    } catch (error: unknown) {
      setButtonStatus('error')
      const errData = axios.isAxiosError(error) ? error.response?.data : undefined
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

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) return
    setButtonStatus('loading')
    
    // Simulate API delay for verification
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => {
        onClose()
        if (onSwitchToLogin) onSwitchToLogin(registeredEmail)
      }, 1000)
    }, 1200)
  }

  const renderSignupView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="signup-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Cadastre-se para explorar
        </h2>
      </div>

      <form
        onSubmit={onSubmitSignup}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        {/* Erro global da API */}
        {errors.root && (
          <div className="font-sans text-xs text-error mt-0.5">
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
            <span className="font-sans text-xs text-error font-medium">
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
            <span className="font-sans text-xs text-error font-medium">
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
              <span className="font-sans text-xs text-error font-medium">
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
              <span className="font-sans text-xs text-error font-medium">
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
              className="font-sans text-[13px] text-black/80 leading-[1.4] cursor-pointer select-none"
            >
              Li e aceito os{' '}
              <a
                href="#termos"
                className="text-primary font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-secondary"
                onClick={(e) => e.preventDefault()}
              >
                Termos de Uso
              </a>{' '}
              e{' '}
              <a
                href="#privacidade"
                className="text-primary font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-secondary"
                onClick={(e) => e.preventDefault()}
              >
                Política de Privacidade
              </a>
              .
            </label>
          </div>
          {errors.aceitoTermos && (
            <span className="font-sans text-xs text-error font-medium">
              {errors.aceitoTermos.message}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-3">
          <Button
            type="submit"
            className="w-[180px] transition-all duration-300"
            isLoading={buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Criar conta
          </Button>
        </div>

        {/* Social Signup */}
        <div className="mt-6 flex flex-col items-center">
          <span className="font-sans text-[13px] text-black/50 mb-3">Ou cadastre-se com</span>
          <div className="flex gap-3 w-full justify-center">
             <button type="button" className="flex items-center justify-center gap-2 border border-black/10 bg-surface rounded-[4px] py-2 px-4 hover:bg-black/5 transition-colors w-[140px]">
                <GoogleIcon />
                <span className="font-sans text-sm text-primary font-normal">Google</span>
             </button>
             <button type="button" className="flex items-center justify-center gap-2 border border-black/10 bg-surface rounded-[4px] py-2 px-4 hover:bg-black/5 transition-colors w-[140px]">
                <GitHubIcon />
                <span className="font-sans text-sm text-primary font-normal">GitHub</span>
             </button>
          </div>
        </div>
      </form>
    </>
  )

  const renderVerificationView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="verification-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Verifique seu e-mail
        </h2>
      </div>

      <form
        onSubmit={onVerifyOtp}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        <div className="flex flex-col gap-6 text-center pt-4">
          
          <div>
            <h4 className="font-sans text-xl font-semibold text-primary mb-2">
              Quase lá!
            </h4>
            <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
              Enviamos um código de 6 dígitos para o e-mail<br />
              <span className="font-semibold text-primary">{registeredEmail}</span>
            </p>
          </div>

          <div className="py-4 w-full flex justify-center">
             <OtpInput 
                length={6} 
                value={otpValue} 
                onChange={setOtpValue} 
                disabled={buttonStatus === 'loading' || buttonStatus === 'success'}
             />
          </div>

          <p className="font-sans text-sm text-black/60">
            Não recebeu o e-mail?{' '}
            <button 
               type="button" 
               className="font-semibold text-primary underline underline-offset-[3px] hover:text-black"
               onClick={() => {
                 setOtpValue('')
                 // Add re-send mock if needed
               }}
            >
              Reenviar código
            </button>
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-auto pb-4">
          <Button
            type="submit"
            disabled={otpValue.length < 6}
            className="w-[180px] transition-all duration-300"
            isLoading={buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Verificar e Entrar
          </Button>
        </div>
      </form>
    </>
  )

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel={view === 'signup' ? "signup-title" : "verification-title"}>
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[580px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-sans text-[26px] font-normal text-black/60 tracking-[3px] m-0 leading-[1.2]">
              {view === 'signup' ? 'Bem-vindo' : 'Verifique seu email'}
            </h3>
          </div>

          <div className="z-[3] relative font-sans text-[15px] text-black/80 leading-[1.6] font-normal">
            {view === 'signup' 
               ? 'Preencha os dados ao lado para criar sua conta no tur.'
               : 'Para garantir a segurança da sua conta, por favor confirme seu e-mail digitando o código que acabamos de enviar.'}
          </div>

          <div className="mt-auto pt-8 z-[3] relative font-sans text-sm text-black/80 leading-normal font-normal">
            {view === 'signup' ? (
              <>
                Já é um membro?{' '}
                <Button
                  variant="ghost"
                  type="button"
                  className="inline font-semibold underline underline-offset-[3px]"
                  onClick={() => (onSwitchToLogin ? onSwitchToLogin() : onClose())}
                >
                  Faça login agora
                </Button>
              </>
            ) : (
              <Button
                  variant="ghost"
                  type="button"
                  className="inline font-semibold underline underline-offset-[3px]"
                  onClick={() => setView('signup')}
                >
                  ← Voltar ao cadastro
              </Button>
            )}
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

          {view === 'signup' ? renderSignupView() : renderVerificationView()}

        </div>
      </div>
    </BaseModal>
  )
}
