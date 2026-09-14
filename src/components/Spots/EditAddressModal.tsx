import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'
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
      rua: rawSpot?.address.street || '',
      complemento: rawSpot?.address.complement || '',
      bairro: rawSpot?.address.neighborhood || '',
      cidade: rawSpot?.address.city || '',
      cep: rawSpot?.address.zipcode || '',
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
        rua: rawSpot.address.street || '',
        complemento: rawSpot.address.complement || '',
        bairro: rawSpot.address.neighborhood || '',
        cidade: rawSpot.address.city || '',
        cep: rawSpot.address.zipcode || '',
        stateId: foundState ? foundState.id : undefined,
      })
      setButtonStatus('idle')
    }
  }, [isOpen, rawSpot, states, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (!rawSpot) return
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

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="cep" required>CEP</Label>
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
              <div className="flex flex-col gap-1">
                <Label htmlFor="rua" required>Rua / Logradouro</Label>
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
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="bairro" required>Bairro</Label>
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

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="cidade" required>Cidade</Label>
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
              <div className="flex flex-col gap-1">
                <Label required>Estado</Label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={estadoMenu.toggle}
                    disabled={isSubmitting || states.length === 0}
                    className={`w-full h-10 px-0.5 font-inter text-sm bg-transparent border-b rounded-none outline-none transition-colors duration-200 cursor-pointer flex items-center justify-between ${errors.stateId ? 'border-tur-red' : 'border-tur-gray-300'}`}
                  >
                    <span
                      className={
                        stateIdWatch
                          ? 'text-tur-dark font-medium'
                          : 'text-tur-gray-400'
                      }
                    >
                      {selectedStateLabel || 'UF'}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-200 shrink-0 text-tur-gray-500 ${estadoMenu.isOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {estadoMenu.isOpen && (
                    <div
                      className="fixed inset-0 z-20"
                      onClick={estadoMenu.close}
                    />
                  )}

                  <div
                    className={`absolute right-0 top-full mt-1 w-24 bg-white border border-black shadow-2xl z-30 p-1 flex flex-col gap-0.5 rounded-none transition-all duration-200 ease-out transform origin-top-right ${
                      estadoMenu.isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                      {states.map((state) => (
                        <button
                          key={state.id}
                          type="button"
                          onClick={() => {
                            setValue('stateId', state.id, { shouldValidate: true })
                            estadoMenu.close()
                          }}
                          className={`text-center font-inter text-xs py-1 px-2 transition-colors rounded-none cursor-pointer ${
                            stateIdWatch === state.id
                              ? 'bg-secondary text-white font-bold'
                              : 'text-tur-dark'
                          }`}
                        >
                          {state.abbreviation}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.stateId && (
                  <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                    {errors.stateId.message as string}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="complemento">Complemento / Ponto de Referência</Label>
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
        </form>
      </SplitModalLayout>
    </BaseModal>
  )
}
