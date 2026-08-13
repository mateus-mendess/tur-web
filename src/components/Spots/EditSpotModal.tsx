import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { spotsService } from '#/services/spotsService'
import type { Spot } from '#/types/spot'
import { editSpotSchema } from '#/schemas/spotSchema'
import type { EditSpotFormData } from '#/schemas/spotSchema'

interface EditSpotModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
}

export function EditSpotModal({ isOpen, onClose, spot }: EditSpotModalProps) {
  const queryClient = useQueryClient()
  
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSpotFormData>({
    resolver: zodResolver(editSpotSchema),
    defaultValues: {
      nome: spot.name,
      descricao: spot.description || '',
    },
  })

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        nome: spot.name,
        descricao: spot.description || '',
      })
    }
  }, [isOpen, spot, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await spotsService.updateSpot(spot.id, {
        name: data.nome,
        description: data.descricao
      })
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      onClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar o ponto turístico.'
      setError('root', {
        message,
      })
    }
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-lg">
      <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Editar Informações
        </h2>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome do local *</Label>
            <Input
              id="nome"
              placeholder="Ex: Cristo Redentor"
              disabled={isSubmitting}
              error={!!errors.nome}
              {...register('nome')}
            />
            {errors.nome && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.nome.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="descricao">Descrição *</Label>
            <textarea
              id="descricao"
              placeholder="Conte um pouco sobre este lugar..."
              disabled={isSubmitting}
              className={`w-full border rounded-none bg-transparent px-3 py-2 font-inter text-sm text-tur-dark placeholder:text-tur-gray-400 outline-none focus:border-black min-h-[120px] resize-y ${
                errors.descricao ? 'border-tur-red' : 'border-black/20'
              }`}
              {...register('descricao')}
            />
            {errors.descricao && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.descricao.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
