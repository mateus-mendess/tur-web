import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { Checkbox } from '#/components/UI/Checkbox'
import type { SignUpFormData } from '#/schemas/authSchema'
import { GoogleIcon, GitHubIcon } from '#/components/UI/Icons'

interface SignUpFormViewProps {
  onSubmitSignup: (e?: React.BaseSyntheticEvent) => Promise<void>
  register: UseFormRegister<SignUpFormData>
  errors: FieldErrors<SignUpFormData>
  setValue: UseFormSetValue<SignUpFormData>
  aceitoTermos: boolean | undefined
  buttonStatus: 'idle' | 'loading' | 'success' | 'error'
}

export function SignUpFormView({
  onSubmitSignup,
  register,
  errors,
  setValue,
  aceitoTermos,
  buttonStatus
}: SignUpFormViewProps) {
  return (
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
}
