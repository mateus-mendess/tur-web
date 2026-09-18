import { useState, useEffect } from 'react'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { signUpSchema } from '#/schemas/authSchema'
import type { SignUpFormData } from '#/schemas/authSchema'
import { SignUpFormView } from './SignUpFormView'
import { SignUpVerificationView } from './SignUpVerificationView'

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
    <SignUpFormView
      onSubmitSignup={onSubmitSignup}
      register={register}
      errors={errors}
      setValue={setValue}
      aceitoTermos={aceitoTermos}
      buttonStatus={buttonStatus}
    />
  )

  const renderVerificationView = () => (
    <SignUpVerificationView
      onVerifyOtp={onVerifyOtp}
      otpValue={otpValue}
      setOtpValue={setOtpValue}
      registeredEmail={registeredEmail}
      buttonStatus={buttonStatus}
    />
  )

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel={view === 'signup' ? "signup-title" : "verification-title"} showCloseButton>
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
              <button
                type="button"
                onClick={() => setView('signup')}
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
                Voltar ao cadastro
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

          {view === 'signup' ? renderSignupView() : renderVerificationView()}

        </div>
      </div>
    </BaseModal>
  )
}
