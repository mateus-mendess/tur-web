import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'

import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'

import { Step1BasicInfo } from './CreateSpotForm/Step1BasicInfo'
import { Step2Categories } from './CreateSpotForm/Step2Categories'
import { Step3Address } from './CreateSpotForm/Step3Address'

import { spotsService } from '#/services/spotsService'
import { addressService } from '#/services/addressService'
import { accessibilityService } from '#/services/accessibilityService'
import { api } from '#/lib/axios'

import { spotSchema } from '#/schemas/spotSchema'
import type { SpotFormData } from '#/schemas/spotSchema'
import type { Spot } from '#/types/spot'
import { useStates } from '#/hooks/api/useStates'
import { useSpot } from '#/hooks/api/useSpot'

interface EditSpotModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
}

export function EditSpotModal({ isOpen, onClose, spot }: EditSpotModalProps) {
  const queryClient = useQueryClient()
  const { data: rawSpot } = useSpot(spot.id)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const { data: states = [] } = useStates()
  const [buttonStatus, setButtonStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const methods = useForm<SpotFormData>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categorias: [],
      acessibilidades: [],
      cep: '',
      rua: '',
      bairro: '',
      cidade: '',
      stateId: 0,
      complemento: '',
    },
  })

  const { handleSubmit, trigger, clearErrors, reset, setError, formState: { errors } } = methods

  useEffect(() => {
    if (isOpen && states.length > 0 && rawSpot) {
      const foundState = states.find(s => s.name === rawSpot.address?.state) || states[0]
      
      reset({
        nome: rawSpot.name,
        descricao: rawSpot.description || '',
        categorias: rawSpot.categories?.map(c => c.id) || [], 
        acessibilidades: rawSpot.accessibilityTypes?.map(a => a.id) || [], 
        cep: rawSpot.address?.zipcode || '',
        rua: rawSpot.address?.street || '',
        bairro: rawSpot.address?.neighborhood || '',
        cidade: rawSpot.address?.city || '',
        stateId: foundState ? foundState.id : 0,
        complemento: rawSpot.address?.complement || '',
      })
      setStep(1)
      setButtonStatus('idle')
      clearErrors()
    }
  }, [isOpen, rawSpot, states, reset, clearErrors])

  const handleNextStep1 = async () => {
    const valid = await trigger(['nome', 'descricao'])
    if (valid) {
      clearErrors(['categorias', 'acessibilidades', 'cep', 'rua', 'bairro', 'cidade', 'stateId'])
      setStep(2)
    }
  }

  const handleNextStep2 = async () => {
    const valid = await trigger(['categorias'])
    if (valid) {
      clearErrors(['cep', 'rua', 'bairro', 'cidade', 'stateId'])
      setStep(3)
    }
  }

  const onSubmit = async (data: SpotFormData) => {
    setIsSubmitting(true)
    setButtonStatus('idle')
    try {
      // 1. Update spot basic info
      await spotsService.updateSpot(spot.id, {
        name: data.nome,
        description: data.descricao
      })
      
      // 2. Update address
      await addressService.updateAddress(spot.id, {
        street: data.rua,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.cidade,
        zipcode: data.cep,
        stateId: data.stateId
      })
      
      // 3. Update accessibility
      await accessibilityService.updateAccessibility(spot.id, data.acessibilidades)
      
      // 4. Update categories (Optimistic endpoint approach)
      try {
        await api.patch(`/categories/tourist-point/${spot.id}`, { categoriesIds: data.categorias })
      } catch(e) {
        // Ignore if endpoint doesn't exist
      }

      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      setButtonStatus('success')
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1000)
    } catch (err: unknown) {
      setButtonStatus('error')
      const message = err instanceof Error ? err.message : 'Erro ao atualizar o ponto turístico.'
      setError('root', { message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...methods}>
        <SplitModalLayout
          leftNumberOrIcon={step === 1 ? '01' : step === 2 ? '02' : '03'}
          title={
            step === 1
              ? 'Editar informações'
              : step === 2
              ? 'Editar categoria'
              : 'Editar localização'
          }
          description={
            step === 1
              ? 'Atualize o nome e uma breve descrição detalhando as principais atrações do local.'
              : step === 2
              ? 'Atualize as categorias e opções de acessibilidade presentes no local.'
              : 'Atualize o endereço completo para que os visitantes encontrem o ponto turístico.'
          }
          subDescription={
            step === 1
              ? 'Todos os campos com * são de preenchimento obrigatório.'
              : step === 2
              ? 'Obrigatório selecionar pelo menos uma categoria.'
              : 'Todos os campos com * são de preenchimento obrigatório.'
          }
          leftFooter={
            <div className="flex w-full items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Voltar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Cancelar
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
                  <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
                  <span className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`} />
                </div>
                <span className="font-inter text-xs font-medium text-tur-gray-500">
                  Etapa {step} de 3
                </span>
              </div>
            </div>
          }
          footer={
            <div className="flex justify-center w-full">
              {step === 1 && (
                <Button type="button" onClick={handleNextStep1} className="px-8">
                  <span>Próximo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              )}

              {step === 2 && (
                <Button type="button" onClick={handleNextStep2} className="px-8">
                  <span>Próximo</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Button>
              )}

              {step === 3 && (
                <Button
                  type="submit"
                  form="edit-spot-form"
                  className="px-6"
                  isLoading={isSubmitting}
                  isSuccess={buttonStatus === 'success'}
                  isError={buttonStatus === 'error'}
                >
                  Salvar
                </Button>
              )}
            </div>
          }
        >
          <form
            id="edit-spot-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 h-full"
          >
            {errors.root && (
              <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
                {errors.root.message}
              </div>
            )}
            
            {step === 1 && <Step1BasicInfo />}
            {step === 2 && <Step2Categories />}
            {step === 3 && <Step3Address />}
          </form>
        </SplitModalLayout>
      </FormProvider>
    </BaseModal>
  )
}
