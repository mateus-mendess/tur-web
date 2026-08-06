import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'

interface Step1BasicInfoProps {
  onNext: () => void
}

export function Step1BasicInfo({ onNext }: Step1BasicInfoProps) {
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
          className={`w-full p-2.5 font-inter text-xs text-tur-dark bg-transparent border rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-400 resize-none ${errors.descricao ? 'border-tur-red' : 'border-tur-gray-300'}`}
          placeholder="Descreva as atrações e características do local..."
          {...register('descricao')}
        />
        {errors.descricao && (
          <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
            {errors.descricao.message}
          </span>
        )}
      </div>

      <div className="flex justify-end mt-auto pt-6">
        <Button type="button" onClick={onNext} className="px-8">
          <span>Próximo</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
