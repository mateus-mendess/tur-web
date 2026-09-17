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
import { OtpInput } from '#/components/UI/OtpInput'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
  onLogin: (data: LoginFormData) => Promise<void>
  defaultEmail?: string
}

type ViewState = 'login' | 'forgot_email' | 'forgot_code' | 'forgot_reset'

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
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [forgotError, setForgotError] = useState('')

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
      setForgotEmail('')
      setOtpValue('')
      setNewPassword('')
      setConfirmNewPassword('')
      setForgotError('')
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

  // ---- Forgot Password Handlers ----

  const onForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    if (!forgotEmail || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setForgotError('Insira um e-mail válido.')
      return
    }
    setButtonStatus('loading')
    
    // Simulate sending email API call
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => {
        setButtonStatus('idle')
        setView('forgot_code')
      }, 1000)
    }, 1000)
  }

  const onForgotCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otpValue.length < 6) return
    setButtonStatus('loading')
    
    // Simulate code verification API call
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => {
        setButtonStatus('idle')
        setView('forgot_reset')
      }, 1000)
    }, 1200)
  }

  const onForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    if (newPassword.length < 6) {
      setForgotError('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('As senhas não coincidem.')
      return
    }
    setButtonStatus('loading')
    
    // Simulate password reset API call
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => {
        setButtonStatus('idle')
        setValue('email', forgotEmail) // Auto-fill the reset email to login
        setView('login')
      }, 1500)
    }, 1000)
  }

  // ---- View Renderers ----

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
                setView('forgot_email')
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

  const renderForgotEmailView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="forgot-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Recuperar senha
        </h2>
      </div>

      <form
        onSubmit={onForgotEmailSubmit}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        <div className="flex flex-col gap-6 pt-4">
          <div>
            <h4 className="font-sans text-xl font-semibold text-primary mb-2">
              Esqueceu sua senha?
            </h4>
            <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
              Digite o e-mail associado à sua conta e enviaremos um código para redefinição.
            </p>
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <Label htmlFor="forgot-email" required>
              E-mail cadastrado
            </Label>
            <Input
              id="forgot-email"
              type="email"
              placeholder="seuemail@exemplo.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              error={!!forgotError}
            />
            {forgotError && (
              <span className="font-sans text-xs text-error font-medium">
                {forgotError}
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-auto pb-4">
          <Button
            type="submit"
            className="w-[180px] transition-all duration-300"
            isLoading={buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Enviar código
          </Button>
        </div>
      </form>
    </>
  )

  const renderForgotCodeView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="forgot-code-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Verifique seu e-mail
        </h2>
      </div>

      <form
        onSubmit={onForgotCodeSubmit}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        <div className="flex flex-col gap-6 text-center pt-4">
          <div>
            <h4 className="font-sans text-xl font-semibold text-primary mb-2">
              Quase lá!
            </h4>
            <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
              Enviamos um código de 6 dígitos para o e-mail<br />
              <span className="font-semibold text-primary">{forgotEmail}</span>
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
            Verificar
          </Button>
        </div>
      </form>
    </>
  )

  const renderForgotResetView = () => (
    <>
      <div className="mb-2 max-md:block hidden">
        <h2
          id="forgot-reset-title"
          className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
        >
          Nova Senha
        </h2>
      </div>

      <form
        onSubmit={onForgotResetSubmit}
        className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
      >
        <div className="flex flex-col gap-6 pt-4">
          <div>
            <h4 className="font-sans text-xl font-semibold text-primary mb-2">
              Defina sua nova senha
            </h4>
            <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
              Crie uma nova senha forte para acessar sua conta.
            </p>
          </div>

          {forgotError && (
            <div className="font-sans text-xs text-error -mb-2">
              {forgotError}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reset-senha" required>
              Nova senha
            </Label>
            <Input
              id="reset-senha"
              type="password"
              placeholder="Digite a nova senha"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!forgotError}
            />
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            <Label htmlFor="reset-confirmar" required>
              Confirmar nova senha
            </Label>
            <Input
              id="reset-confirmar"
              type="password"
              placeholder="Repita a nova senha"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              error={!!forgotError}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-auto pb-4">
          <Button
            type="submit"
            className="w-[180px] transition-all duration-300"
            isLoading={buttonStatus === 'loading'}
            isSuccess={buttonStatus === 'success'}
            isError={buttonStatus === 'error'}
          >
            Salvar senha
          </Button>
        </div>
      </form>
    </>
  )

  // Determine left side content dynamically based on view
  const leftTitle = 'Bem-vindo'
  let leftSubtitle = 'Entre na sua conta e continue explorando o Brasil.'
  
  if (view === 'forgot_email' || view === 'forgot_code' || view === 'forgot_reset') {
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
          {view === 'forgot_email' && renderForgotEmailView()}
          {view === 'forgot_code' && renderForgotCodeView()}
          {view === 'forgot_reset' && renderForgotResetView()}
          
        </div>
      </div>
    </BaseModal>
  )
}
