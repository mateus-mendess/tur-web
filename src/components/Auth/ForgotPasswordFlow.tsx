import { useState } from 'react'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { OtpInput } from '#/components/UI/OtpInput'

export type ForgotPasswordStep = 'email' | 'code' | 'reset'

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void
  onPasswordReset: (email: string) => void
}

export function ForgotPasswordFlow({ onPasswordReset }: ForgotPasswordFlowProps) {
  const [step, setStep] = useState<ForgotPasswordStep>('email')
  
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  
  const [forgotError, setForgotError] = useState('')
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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
        setStep('code')
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
        setStep('reset')
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
        onPasswordReset(forgotEmail)
      }, 1500)
    }, 1000)
  }

  if (step === 'email') {
    return (
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
  }

  if (step === 'code') {
    return (
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
  }

  return (
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
}
