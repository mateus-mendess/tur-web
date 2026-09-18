import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { Checkbox } from '#/components/UI/Checkbox'
import { loginSchema } from '#/schemas/authSchema'
import type { LoginFormData } from '#/schemas/authSchema'
import { GoogleIcon, GitHubIcon } from '#/components/UI/Icons'
import { ForgotPasswordFlow } from './ForgotPasswordFlow'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
  onLogin: (data: LoginFormData) => Promise<void>
  defaultEmail?: string
}

type ViewState = 'login' | 'forgot'

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLogin,
  defaultEmail,
}: LoginModalProps) {
  // Login form state
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultEmail || '',
      senha: '',
      manterConectado: false,
    },
  })

  // View state and forgot password data
  const [view, setView] = useState<ViewState>('login')

  // Shared button status for transitions
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const manterConectado = watch('manterConectado')

  useEffect(() => {
    if (isOpen && defaultEmail) {
      setValue('email', defaultEmail)
    }
    if (!isOpen) {
      setButtonStatus('idle')
      setView('login')
      reset()
    }
  }, [isOpen, defaultEmail, setValue, reset])

  const onLoginSubmit = handleSubmit(async (data) => {
    try {
      await onLogin(data)
      setButtonStatus('success')
      setTimeout(() => onClose(), 1000)
    } catch {
      setButtonStatus('error')
      setError('root', {
        message: 'E-mail ou senha incorretos. Verifique seus dados.',
      })
    }
  })



  const renderLoginView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="login-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Acesse sua conta
        </h2>
      </div>

      <form
        onSubmit={onLoginSubmit}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        {errors.root && (
          <div className="font-sans text-xs text-error mt-0.5">
            {errors.root.message}
          </div>
        )}

        {/* E-MAIL */}
        <div className="flex flex-col gap-1.5 mt-3">
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
            <span className="font-sans text-xs text-error font-medium">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* SENHA E MANTER CONECTADO */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login-senha" required>
              Senha
            </Label>
            <Input
              id="login-senha"
              type="password"
              placeholder="Sua senha"
              error={!!errors.senha}
              {...register('senha')}
            />
            {errors.senha && (
              <span className="font-sans text-xs text-error font-medium">
                {errors.senha.message}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center mt-0.5">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="login-remember"
                checked={!!manterConectado}
                onChange={(e) => setValue('manterConectado', e.target.checked)}
              />
              <label
                htmlFor="login-remember"
                className="font-sans text-[13px] text-black/80 cursor-pointer select-none"
              >
                Manter conectado
              </label>
            </div>
            
              <a
                href="#esqueci-senha"
                className="font-sans text-xs text-black/60 hover:text-secondary underline underline-offset-2 transition-colors duration-200"
                onClick={(e) => {
                  e.preventDefault()
                  setView('forgot')
                }}
              >
              Esqueceu a senha?
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-3">
          <Button
            type="submit"
            className="w-[180px]"
            isLoading={isSubmitting || buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Entrar
          </Button>
        </div>

        {/* Social Login */}
        <div className="mt-6 flex flex-col items-center">
          <span className="font-sans text-[13px] text-black/50 mb-3">Ou entre com</span>
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



  // Determine left side content dynamically based on view
  const leftTitle = 'Bem-vindo'
  let leftSubtitle = 'Entre na sua conta e continue explorando o Brasil.'
  
  if (view === 'forgot') {
    leftSubtitle = 'Siga as etapas para definir uma nova senha para sua conta.'
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="login-title" showCloseButton>
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[580px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-sans text-[26px] font-normal text-black/60 tracking-[3px] m-0 leading-[1.2]">
              {leftTitle}
            </h3>
          </div>

          <div className="z-[3] relative font-sans text-[15px] text-black/80 leading-[1.6] font-normal">
            {leftSubtitle}
          </div>

          <div className="mt-auto pt-8 z-[3] relative font-sans text-sm text-black/80 leading-normal font-normal">
            {view === 'login' ? (
              <>
                Ainda não tem conta?{' '}
                <Button
                  variant="ghost"
                  type="button"
                  className="inline font-semibold underline underline-offset-[3px]"
                  onClick={onSwitchToSignUp ?? onClose}
                >
                  Cadastre-se agora
                </Button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setView('login')}
                className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar ao login
              </button>
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

          {view === 'login' && renderLoginView()}
          {view === 'forgot' && (
            <ForgotPasswordFlow
              onBackToLogin={() => setView('login')}
              onPasswordReset={(email) => {
                setValue('email', email)
                setView('login')
              }}
            />
          )}
          
        </div>
      </div>
    </BaseModal>
  )
}
