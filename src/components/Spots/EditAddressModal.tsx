import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'
import { EditAddressFormFields } from './EditAddressFormFields'
import { addressService } from '#/services/addressService'
import { useSpot } from '#/hooks/api/useSpot'
import { useStates } from '#/hooks/api/useStates'
import { useDropdown } from '#/hooks/useDropdown'
import { editAddressSchema } from '#/schemas/spotSchema'
import type { Spot } from '#/types/spot'

interface EditAddressModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
}

export function EditAddressModal({ isOpen, onClose, spot }: EditAddressModalProps) {
  const queryClient = useQueryClient()
  const { data: states = [] } = useStates()
  const { data: rawSpot } = useSpot(spot.id)
  
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editAddressSchema),
    defaultValues: {
      street: rawSpot?.address.street || '',
      complement: rawSpot?.address.complement || '',
      neighborhood: rawSpot?.address.neighborhood || '',
      city: rawSpot?.address.city || '',
      zipcode: rawSpot?.address.zipcode || '',
      stateId: undefined as number | undefined,
    },
  })

  const estadoMenu = useDropdown()
  const stateIdWatch = watch('stateId')
  const selectedStateLabel = states.find((s) => s.id === stateIdWatch)?.abbreviation ?? ''

  const [buttonStatus, setButtonStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Initialize form when modal opens and rawSpot is available
  useEffect(() => {
    if (isOpen && states.length > 0 && rawSpot) {
      const foundState = states.find(s => s.name === rawSpot.address.state)
      
      reset({
        street: rawSpot.address.street,
        complement: rawSpot.address.complement || '',
        neighborhood: rawSpot.address.neighborhood,
        city: rawSpot.address.city,
        zipcode: rawSpot.address.zipcode,
        stateId: foundState ? foundState.id : undefined,
      })
      setButtonStatus('idle')
    }
  }, [isOpen, rawSpot, states, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!rawSpot) return
    try {
      await addressService.updateAddress(rawSpot.id, {
        street: data.street,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        zipcode: data.zipcode,
        stateId: data.stateId
      })
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      setButtonStatus('success')
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1000)
    } catch (err: unknown) {
      setButtonStatus('error')
      const message = err instanceof Error ? err.message : 'Erro ao atualizar o endereço.'
      setError('root', {
        message,
      })
    }
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <SplitModalLayout
        title="Editar Localização"
        description="Atualize o endereço completo para que os visitantes encontrem o ponto turístico."
        subDescription="Todos os campos com * são de preenchimento obrigatório."
        footer={
          <>
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
              onClick={onSubmit}
              isLoading={isSubmitting}
              isSuccess={buttonStatus === 'success'}
              isError={buttonStatus === 'error'}
            >
              Salvar
            </Button>
          </>
        }
      >
        <form id="edit-address-form" onSubmit={onSubmit} className="flex flex-col gap-6">
          {errors.root && (
            <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
              {errors.root.message}
            </div>
          )}

          <EditAddressFormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            setValue={setValue}
            estadoMenu={estadoMenu}
            states={states}
            stateIdWatch={stateIdWatch}
            selectedStateLabel={selectedStateLabel}
          />
        </form>
      </SplitModalLayout>
    </BaseModal>
  )
}
