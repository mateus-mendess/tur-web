import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { spotSchema } from '#/schemas/spotSchema'
import type { SpotFormData } from '#/schemas/spotSchema'
import { useCreateSpot } from '#/hooks/api/useCreateSpot'

import { Step1BasicInfo } from './CreateSpotForm/Step1BasicInfo'
import { Step2Categories } from './CreateSpotForm/Step2Categories'
import { Step3Address } from './CreateSpotForm/Step3Address'

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

  const { handleSubmit, trigger } = methods

  const handleNextStep1 = async () => {
    const isStep1Valid = await trigger(['nome', 'descricao'])
    if (isStep1Valid) setStep(2)
  }

  const handleNextStep2 = async () => {
    const isStep2Valid = await trigger(['categorias', 'acessibilidades'])
    if (isStep2Valid) setStep(3)
  }

  const onSubmit = (data: SpotFormData) => {
    createSpot.mutate(data, {
      onSuccess: () => {
        onSuccess?.(data)
        onCancel()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[520px]">
        {/* COLUNA DA ESQUERDA (INSTRUÇÕES E PASSO A PASSO) */}
        <div className="relative bg-white p-[45px_40px] max-md:p-[32px_24px] flex flex-col justify-between after:content-[''] after:absolute after:right-0 after:top-[10%] after:bottom-[10%] after:w-px after:bg-black/20 max-md:after:hidden">
          <div>
            {/* Grand Step Number */}
            <div className="font-dm-sans text-[72px] font-extralight text-tur-gray-400/80 leading-none select-none tracking-tighter">
              {step === 1 ? '01' : step === 2 ? '02' : '03'}
            </div>

            {step === 1 && (
              <div>
                <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                  Informações básicas
                </h3>
                <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                  Informe o nome e uma breve descrição detalhando as principais
                  atrações do local.
                </p>
                <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                  Todos os campos com * são de preenchimento obrigatório.
                </p>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                  Escolha da categoria
                </h3>
                <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                  Selecione uma ou mais categorias e opções de acessibilidade
                  presentes no local.
                </p>
                <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                  Obrigatório selecionar pelo menos uma categoria.
                </p>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="font-dm-sans text-[26px] font-normal text-tur-dark tracking-[-0.5px] leading-[1.2] mt-4 mb-3">
                  Localização do ponto
                </h3>
                <p className="font-inter text-[14px] text-tur-gray-600 leading-[1.6] mb-5">
                  Informe o endereço completo para que os visitantes encontrem o
                  ponto turístico.
                </p>
                <p className="font-inter text-[13px] text-tur-gray-500 leading-[1.5]">
                  Todos os campos com * são de preenchimento obrigatório.
                </p>
              </div>
            )}
          </div>

          {/* Stepper Footer (3 etapas) */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${step === 1 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${step === 2 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`}
              />
              <span
                className={`h-1.5 rounded-full transition-all duration-300 ${step === 3 ? 'w-6 bg-tur-dark' : 'w-2 bg-tur-gray-300'}`}
              />
            </div>
            <span className="font-inter text-xs font-medium text-tur-gray-500">
              Etapa {step} de 3
            </span>
          </div>
        </div>

        {/* COLUNA DA DIREITA (FORMULÁRIO) */}
        <div className="relative bg-white p-[45px_40px_36px_40px] max-md:p-[32px_24px] flex flex-col justify-between">
          <div className="absolute top-6 right-8 max-md:hidden">
            <img
              src="/assets/images/selo-img.png"
              alt="Selo postal"
              className="w-[90px] h-auto object-contain drop-shadow-sm opacity-90 grayscale-[0.2]"
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 flex-1 justify-between mt-[115px] max-md:mt-6"
          >
            {step === 1 && <Step1BasicInfo onNext={handleNextStep1} />}
            {step === 2 && (
              <Step2Categories
                onBack={() => setStep(1)}
                onNext={handleNextStep2}
              />
            )}
            {step === 3 && (
              <Step3Address
                onBack={() => setStep(2)}
                isSubmitting={createSpot.isPending}
              />
            )}
          </form>
        </div>
      </div>
    </FormProvider>
  )
}
