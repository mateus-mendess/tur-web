import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { spotSchema } from '#/schemas/spotSchema'
import type { SpotFormData } from '#/schemas/spotSchema'
import { useCreateSpot } from '#/hooks/api/useCreateSpot'

import { Step1BasicInfo } from './CreateSpot/Step1BasicInfo'
import { Step2Categories } from './CreateSpot/Step2Categories'
import { Step3Address } from './CreateSpot/Step3Address'
import { Button } from '#/components/UI/Button'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'

export interface CreateSpotFormProps {
  onSuccess?: (data: SpotFormData) => void
  onCancel: () => void
}

export function CreateSpotForm({ onSuccess, onCancel }: CreateSpotFormProps) {
  const createSpot = useCreateSpot()
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const methods = useForm<SpotFormData>({
    resolver: zodResolver(spotSchema),
    defaultValues: {
      name: '',
      description: '',
      categoriesIds: [],
      accessibilityTypesIds: [],
      addressRequest: {
        zipcode: '',
        street: '',
        neighborhood: '',
        city: '',
        stateId: 0,
        complement: '',
      }
    },
  })

  const { handleSubmit, trigger, clearErrors } = methods

  // Avança para Etapa 2 — valida SOMENTE campos da Etapa 1
  const handleNextStep1 = async () => {
    const valid = await trigger(['name', 'description'])
    if (valid) {
      // Limpa quaisquer erros que o resolver possa ter gerado para etapas futuras
      clearErrors(['categoriesIds', 'accessibilityTypesIds', 'addressRequest'])
      setStep(2)
    }
  }

  // Avança para Etapa 3 — valida SOMENTE campos da Etapa 2
  const handleNextStep2 = async () => {
    const valid = await trigger(['categoriesIds'])
    if (valid) {
      // Limpa quaisquer erros que o resolver possa ter gerado para etapa 3
      clearErrors(['addressRequest'])
      setStep(3)
    }
  }

  // Submit real — só é chamado pelo botão "Cadastrar" (type="submit") na Etapa 3
  const onSubmit = (data: SpotFormData) => {
    createSpot.mutate(data, {
      onSuccess: () => {
        setTimeout(() => {
          onSuccess?.(data)
          onCancel()
        }, 1000)
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <SplitModalLayout
        leftNumberOrIcon={step === 1 ? '01' : step === 2 ? '02' : '03'}
        title={
          step === 1
            ? 'Informações básicas'
            : step === 2
            ? 'Escolha da categoria'
            : 'Localização do ponto'
        }
        description={
          step === 1
            ? 'Informe o nome e uma breve descrição detalhando as principais atrações do local.'
            : step === 2
            ? 'Selecione uma ou mais categorias e opções de acessibilidade presentes no local.'
            : 'Informe o endereço completo para que os visitantes encontrem o ponto turístico.'
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
                className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Voltar
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors"
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
                form="create-spot-form"
                className="px-6"
                isLoading={createSpot.isPending}
                isSuccess={createSpot.isSuccess}
                isError={createSpot.isError}
              >
                Cadastrar
              </Button>
            )}
          </div>
        }
      >
        <form
          id="create-spot-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 h-full"
        >
          {step === 1 && <Step1BasicInfo />}
          {step === 2 && <Step2Categories />}
          {step === 3 && <Step3Address />}
        </form>
      </SplitModalLayout>
    </FormProvider>
  )
}
