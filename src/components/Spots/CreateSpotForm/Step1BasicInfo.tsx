import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'

export function Step1BasicInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SpotFormData>()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="spot-nome" required>
          Nome do ponto turístico
        </Label>
        <Input
          id="spot-nome"
          placeholder="Ex: Praia de Antunes"
          error={!!errors.nome}
          {...register('nome')}
        />
        {errors.nome && (
          <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
            {errors.nome.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="spot-descricao" required>
          Descrição
        </Label>
        <textarea
          id="spot-descricao"
          rows={3}
          className={`w-full p-2 font-sans text-sm text-primary bg-transparent border-b border-x-0 border-t-0 rounded-none outline-none transition-colors duration-200 focus:border-primary focus:ring-0 placeholder-black/40 resize-none ${errors.descricao ? 'border-error' : 'border-black/20'}`}
          placeholder="Descreva as atrações e características do local..."
          {...register('descricao')}
        />
        {errors.descricao && (
          <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
            {errors.descricao.message}
          </span>
        )}
      </div>

    </div>
  )
}
