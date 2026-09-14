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
          className={`w-full border rounded-none bg-transparent px-3 py-2 font-inter text-sm text-tur-dark placeholder:text-tur-gray-400 outline-none focus:border-black min-h-[120px] resize-y ${
            errors.descricao ? 'border-tur-red' : 'border-black/20'
          }`}
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
