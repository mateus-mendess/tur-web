import { useState } from 'react'
import type { FormEvent } from 'react'
import { BaseModal } from '../UI/BaseModal'
import { Input } from '../UI/Input'
import { Label } from '../UI/Label'
import { Button } from '../UI/Button'
import { Checkbox } from '../UI/Checkbox'

export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignUp?: () => void
  onLoginSuccess?: (data: { email: string }) => void
  leftImageSrc?: string
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLoginSuccess,
}: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mantenhaConectado, setMantenhaConectado] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.')
      return
    }
    if (!senha) {
      setErrorMessage('Por favor, digite sua senha.')
      return
    }

    if (onLoginSuccess) {
      onLoginSuccess({ email })
    }
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="login-title">
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[520px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA (TÍTULO E BOAS-VINDAS) */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-dm-sans text-[26px] font-normal text-tur-gray-600 tracking-[3px] uppercase m-0 leading-[1.2]">
              Bem-vindo
            </h3>
          </div>

          <div className="z-[3] relative font-inter text-[15px] text-tur-gray-700 leading-[1.6] font-normal">
            Preencha os dados ao lado para acessar sua conta no tur.
          </div>

          <div className="mt-auto pt-8 z-[3] relative font-inter text-sm text-tur-gray-700 leading-normal font-normal">
            Ainda não tem conta?{' '}
            <Button
              variant="ghost"
              type="button"
              className="inline font-semibold underline underline-offset-[3px]"
              onClick={onSwitchToSignUp || onClose}
            >
              Cadastre-se agora
            </Button>
          </div>
        </div>

        {/* COLUNA DA DIREITA (FORMULÁRIO DE LOGIN) */}
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
              Entrar na sua conta
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
          >
            {errorMessage && (
              <div className="font-inter text-xs text-tur-red mt-0.5">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-4">
              {/* E-MAIL */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-email" required>
                  E-mail
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="login-senha" required>
                  Senha
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="login-senha"
                    type="password"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>

              {/* OPÇÕES ADICIONAIS: LEMBRAR-ME & ESQUECEU A SENHA */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="login-remember"
                    checked={mantenhaConectado}
                    onChange={(e) => setMantenhaConectado(e.target.checked)}
                  />
                  <label
                    htmlFor="login-remember"
                    className="font-inter text-[13px] text-tur-gray-700 cursor-pointer select-none"
                  >
                    Mantenha-me conectado
                  </label>
                </div>

                <a
                  href="#esqueci-senha"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Funcionalidade de recuperação de senha em breve.')
                  }}
                  className="font-inter text-xs text-tur-gray-600 hover:text-tur-accent transition-colors underline underline-offset-2"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* BOTÃO DE AÇÃO PRINCIPAL (CTA) */}
            <div className="flex justify-center mt-4">
              <Button type="submit" className="w-[180px]">
                Entrar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
