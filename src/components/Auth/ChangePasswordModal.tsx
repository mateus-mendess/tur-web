import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'

export interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

const changePasswordSchema = z
  .object({
    senhaAtual: z.string().min(1, 'A senha atual é obrigatória'),
    novaSenha: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres'),
    confirmaNovaSenha: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((data) => data.novaSenha === data.confirmaNovaSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmaNovaSenha'],
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      senhaAtual: '',
      novaSenha: '',
      confirmaNovaSenha: '',
    },
  })

  // Limpa o formulário ao fechar o modal
  const handleClose = () => {
    reset()
    setButtonStatus('idle')
    onClose()
  }

  const onSubmit = handleSubmit(async () => {
    setButtonStatus('loading')
    
    // Simula a chamada da API
    setTimeout(() => {
      setButtonStatus('success')
      setTimeout(() => {
        handleClose()
      }, 1000)
    }, 1200)
  })

  return (
    <BaseModal isOpen={isOpen} onClose={handleClose} ariaLabel="change-password-title">
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[580px] max-md:max-h-[80vh] max-md:overflow-y-auto">
        {/* COLUNA DA ESQUERDA */}
        <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
          <div className="z-[3] relative mb-6">
            <h3 className="font-sans text-[26px] font-normal text-black/60 tracking-[3px] m-0 leading-[1.2]">
              Alterar Senha
            </h3>
          </div>

          <div className="z-[3] relative font-sans text-[15px] text-black/80 leading-[1.6] font-normal">
            Atualize sua senha para manter sua conta sempre protegida.
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
              id="change-password-title"
              className="font-sans text-[28px] font-semibold text-primary tracking-[-0.5px] m-0 mb-2"
            >
              Alterar Senha
            </h2>
          </div>

          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative"
          >
            <div className="flex flex-col gap-6 pt-4">
              <div className="max-md:hidden mb-2">
                <h4 className="font-sans text-xl font-semibold text-primary mb-2">
                  Nova Senha
                </h4>
                <p className="font-sans text-[15px] text-black/70 leading-[1.6]">
                  Defina uma senha forte que você não esteja usando em outros lugares.
                </p>
              </div>

              {/* SENHA ATUAL */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="change-senha-atual" required>
                  Senha Atual
                </Label>
                <Input
                  id="change-senha-atual"
                  type="password"
                  placeholder="Sua senha atual"
                  error={!!errors.senhaAtual}
                  {...register('senhaAtual')}
                />
                {errors.senhaAtual && (
                  <span className="font-sans text-xs text-error font-medium">
                    {errors.senhaAtual.message}
                  </span>
                )}
              </div>

              {/* NOVA SENHA */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="change-nova-senha" required>
                  Nova Senha
                </Label>
                <Input
                  id="change-nova-senha"
                  type="password"
                  placeholder="Digite a nova senha"
                  error={!!errors.novaSenha}
                  {...register('novaSenha')}
                />
                {errors.novaSenha && (
                  <span className="font-sans text-xs text-error font-medium">
                    {errors.novaSenha.message}
                  </span>
                )}
              </div>

              {/* CONFIRMAR NOVA SENHA */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="change-confirma-senha" required>
                  Confirme nova senha
                </Label>
                <Input
                  id="change-confirma-senha"
                  type="password"
                  placeholder="Repita a nova senha"
                  error={!!errors.confirmaNovaSenha}
                  {...register('confirmaNovaSenha')}
                />
                {errors.confirmaNovaSenha && (
                  <span className="font-sans text-xs text-error font-medium">
                    {errors.confirmaNovaSenha.message}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center mt-auto pt-8 pb-4">
              <Button
                type="submit"
                className="w-[180px] transition-all duration-300"
                isLoading={buttonStatus === 'loading'}
                isSuccess={buttonStatus === 'success'}
                isError={buttonStatus === 'error'}
              >
                Salvar Senha
              </Button>
            </div>
          </form>
        </div>
      </div>
    </BaseModal>
  )
}
