import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { addressService } from '#/services/addressService'
import type { TouristPointResponse } from '#/types/api'
import { useStates } from '#/hooks/api/useStates'
import { editAddressSchema } from '#/schemas/spotSchema'
import type { EditAddressFormData } from '#/schemas/spotSchema'

interface EditAddressModalProps {
  isOpen: boolean
  onClose: () => void
  rawSpot: TouristPointResponse
}

export function EditAddressModal({ isOpen, onClose, rawSpot }: EditAddressModalProps) {
  const queryClient = useQueryClient()
  const { data: states = [] } = useStates()
  
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editAddressSchema),
    defaultValues: {
      rua: rawSpot.address.street || '',
      complemento: rawSpot.address.complement || '',
      bairro: rawSpot.address.neighborhood || '',
      cidade: rawSpot.address.city || '',
      cep: rawSpot.address.zipcode || '',
    },
  })

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && states.length > 0) {
      const foundState = states.find(s => s.name === rawSpot.address.state)
      
      reset({
        rua: rawSpot.address.street || '',
        complemento: rawSpot.address.complement || '',
        bairro: rawSpot.address.neighborhood || '',
        cidade: rawSpot.address.city || '',
        cep: rawSpot.address.zipcode || '',
        stateId: foundState ? foundState.id : undefined,
      })
    }
  }, [isOpen, rawSpot, states, reset])

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addressService.updateAddress(rawSpot.id, {
        street: data.rua,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.cidade,
        zipcode: data.cep,
        stateId: data.stateId
      })
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      onClose()
    } catch (err: any) {
      setError('root', {
        message: err.message || 'Erro ao atualizar o endereço.',
      })
    }
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-xl">
      <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Editar Localização
        </h2>

        {errors.root && (
          <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
            {errors.root.message}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              placeholder="00000000"
              disabled={isSubmitting}
              error={!!errors.cep}
              {...register('cep')}
              onChange={(e) => {
                setValue('cep', e.target.value.replace(/\D/g, '').slice(0, 8), {
                  shouldValidate: true,
                })
              }}
            />
            {errors.cep && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.cep.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="rua">Rua *</Label>
              <Input
                id="rua"
                disabled={isSubmitting}
                error={!!errors.rua}
                {...register('rua')}
              />
              {errors.rua && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.rua.message}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                disabled={isSubmitting}
                error={!!errors.complemento}
                {...register('complemento')}
              />
              {errors.complemento && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.complemento.message}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              disabled={isSubmitting}
              error={!!errors.bairro}
              {...register('bairro')}
            />
            {errors.bairro && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.bairro.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                disabled={isSubmitting}
                error={!!errors.cidade}
                {...register('cidade')}
              />
              {errors.cidade && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.cidade.message}
                </span>
              )}
            </div>
            <div className="space-y-1 flex flex-col">
              <Label htmlFor="stateId">Estado *</Label>
              <select
                id="stateId"
                disabled={isSubmitting || states.length === 0}
                className={`w-full h-10 border rounded-none bg-transparent px-3 font-inter text-sm text-tur-dark outline-none focus:border-black ${
                  errors.stateId ? 'border-tur-red' : 'border-black/20'
                }`}
                {...register('stateId', { valueAsNumber: true })}
              >
                <option value="">Selecione...</option>
                {states.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {errors.stateId && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.stateId.message}
                </span>
              )}
            </div>
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
