import { useState } from 'react'
import type { FormEvent } from 'react'
import { BaseModal } from '../UI/BaseModal'
import { Input } from '../UI/Input'
import { Label } from '../UI/Label'
import { Button } from '../UI/Button'
import { Checkbox } from '../UI/Checkbox'

export interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
  onSignUpSuccess?: (data: { nome: string; email: string }) => void
  leftImageSrc?: string
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignUpSuccess,
}: SignUpModalProps) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [aceitoTermos, setAceitoTermos] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!nome.trim()) {
      setErrorMessage('Por favor, digite seu nome completo.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.')
      return
    }
    if (!senha) {
      setErrorMessage('Por favor, digite uma senha.')
      return
    }
    if (senha !== confirmarSenha) {
      setErrorMessage('As senhas não coincidem.')
      return
    }
    if (!aceitoTermos) {
      setErrorMessage(
        'Você deve aceitar os Termos de Uso e Política de Privacidade.',
      )
      return
    }

    if (onSignUpSuccess) {
      onSignUpSuccess({ nome, email })
    }
    onClose()
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="signup-title">
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[560px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA (TÍTULO E BOAS-VINDAS) */}
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
              onClick={onSwitchToLogin || onClose}
            >
              Faça login agora
            </Button>
          </div>
        </div>

        {/* COLUNA DA DIREITA (FORMULÁRIO DE CADASTRO) */}
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
            onSubmit={handleSubmit}
            className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
          >
            {errorMessage && (
              <div className="font-inter text-xs text-tur-red mt-0.5">
                {errorMessage}
              </div>
            )}

            {/* NOME COMPLETO */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-nome" required>
                Nome Completo
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="signup-nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            {/* E-MAIL */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="signup-email" required>
                E-mail
              </Label>
              <div className="relative flex items-center">
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* SENHA & CONFIRMAR SENHA */}
            <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-senha" required>
                  Senha
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="signup-senha"
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="signup-confirmar" required>
                  Confirmar Senha
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="signup-confirmar"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* TERMOS DE USO (CHECKBOX ÚNICO) */}
            <div className="flex items-start gap-2.5 mt-2">
              <Checkbox
                id="signup-terms"
                checked={aceitoTermos}
                onChange={(e) => setAceitoTermos(e.target.checked)}
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

            {/* BOTÃO DE AÇÃO PRINCIPAL (CTA) */}
            <div className="flex justify-center mt-3">
              <Button type="submit" className="w-[180px]">
                Criar conta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
