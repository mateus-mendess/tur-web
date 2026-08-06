import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { spotSchema } from '../../schemas/spotSchema'
import type { SpotFormData } from '../../schemas/spotSchema'
import { Input } from '../UI/Input'
import { Label } from '../UI/Label'
import { Button } from '../UI/Button'
import { SearchableDropdown } from '../UI/SearchableDropdown'
import { useCreateSpot } from '../../hooks/api/useCreateSpot'
import {
  SPOT_CATEGORIES,
  ACCESSIBILITY_OPTIONS,
  BRAZILIAN_STATES,
} from '../../constants/spots'

export interface CreateSpotFormProps {
  onSuccess?: (data: SpotFormData) => void
  onCancel: () => void
}

export function CreateSpotForm({ onSuccess, onCancel }: CreateSpotFormProps) {
  const createSpot = useCreateSpot()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [categoriesOptions, setCategoriesOptions] =
    useState<string[]>([...SPOT_CATEGORIES])
  const [newCategoryInput, setNewCategoryInput] = useState('')

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false)
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false)
  const [isEstadoMenuOpen, setIsEstadoMenuOpen] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SpotFormData>({
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
      estado: '',
      complemento: '',
    },
  })

  const categoriasWatch = watch('categorias')
  const acessibilidadesWatch = watch('acessibilidades')
  const estadoWatch = watch('estado')

  const handleNextStep1 = async () => {
    const isStep1Valid = await trigger(['nome', 'descricao'])
    if (isStep1Valid) setStep(2)
  }

  const handleNextStep2 = async () => {
    const isStep2Valid = await trigger(['categorias', 'acessibilidades'])
    if (isStep2Valid) {
      setIsCategoryMenuOpen(false)
      setIsAccessMenuOpen(false)
      setStep(3)
    }
  }

  const onSubmit = (data: SpotFormData) => {
    createSpot.mutate(data, {
      onSuccess: () => {
        onSuccess?.(data)
        onCancel()
      },
    })
  }

  const handleAddCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const trimmed = newCategoryInput.trim()
    if (!trimmed) return

    if (!categoriesOptions.includes(trimmed)) {
      setCategoriesOptions((prev) => [...prev, trimmed])
    }
    if (!categoriasWatch.includes(trimmed)) {
      setValue('categorias', [...categoriasWatch, trimmed], {
        shouldValidate: true,
      })
    }
    setNewCategoryInput('')
  }

  return (
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
          {/* ETAPA 1 */}
          <div className={step === 1 ? 'flex flex-col gap-4' : 'hidden'}>
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
              <Button type="button" onClick={handleNextStep1} className="px-8">
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

          {/* ETAPA 2 */}
          <div className={step === 2 ? 'flex flex-col gap-4' : 'hidden'}>
            <div className="flex flex-col gap-1.5">
              <Label required>Categoria(s)</Label>
              <SearchableDropdown
                options={categoriesOptions}
                selectedValues={categoriasWatch}
                isOpen={isCategoryMenuOpen}
                onToggle={() => {
                  setIsCategoryMenuOpen((prev) => !prev)
                  setIsAccessMenuOpen(false)
                }}
                onClose={() => setIsCategoryMenuOpen(false)}
                onSelect={(val) => {
                  const next = categoriasWatch.includes(val)
                    ? categoriasWatch.filter((c) => c !== val)
                    : [...categoriasWatch, val]
                  setValue('categorias', next, { shouldValidate: true })
                }}
                placeholder="Buscar categoria..."
                triggerContent={
                  <span className="truncate">
                    {categoriasWatch.length > 0
                      ? `${categoriasWatch.length} categoria(s) selecionada(s)`
                      : 'Selecionar categorias...'}
                  </span>
                }
                triggerClassName={`w-full font-inter text-xs px-3.5 py-2.5 rounded-none border bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2 ${errors.categorias ? 'border-tur-red' : 'border-black/30'}`}
                popoverWidthClass="w-full"
                emptyMessage="Nenhuma categoria encontrada"
                footerContent={
                  <div className="border-t border-black/10 pt-2 flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      placeholder="Nova categoria..."
                      value={newCategoryInput}
                      onChange={(e) => setNewCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCategory()
                        }
                      }}
                      className="flex-1 font-inter text-xs border border-black/30 px-2 py-1 rounded-none outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="bg-black text-white px-2 py-1 border border-black font-bold hover:bg-tur-accent transition-colors cursor-pointer rounded-none shrink-0"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                }
              />
              {errors.categorias && (
                <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                  {errors.categorias.message}
                </span>
              )}
              {categoriasWatch.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {categoriasWatch.map((cat) => (
                    <span
                      key={cat}
                      className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setValue(
                            'categorias',
                            categoriasWatch.filter((c) => c !== cat),
                            { shouldValidate: true },
                          )
                        }}
                        className="hover:text-tur-accent font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <Label>Acessibilidade</Label>
              <SearchableDropdown
                options={ACCESSIBILITY_OPTIONS}
                selectedValues={acessibilidadesWatch}
                isOpen={isAccessMenuOpen}
                onToggle={() => {
                  setIsAccessMenuOpen((prev) => !prev)
                  setIsCategoryMenuOpen(false)
                }}
                onClose={() => setIsAccessMenuOpen(false)}
                onSelect={(val) => {
                  const next = acessibilidadesWatch.includes(val)
                    ? acessibilidadesWatch.filter((c) => c !== val)
                    : [...acessibilidadesWatch, val]
                  setValue('acessibilidades', next)
                }}
                placeholder="Buscar acessibilidade..."
                triggerContent={
                  <span className="truncate">
                    {acessibilidadesWatch.length > 0
                      ? `${acessibilidadesWatch.length} opção(ões) selecionada(s)`
                      : 'Selecionar acessibilidade...'}
                  </span>
                }
                triggerClassName="w-full font-inter text-xs px-3.5 py-2.5 rounded-none border border-black/30 bg-transparent text-tur-dark hover:border-black font-medium cursor-pointer transition-all flex items-center justify-between gap-2"
                popoverWidthClass="w-full"
                emptyMessage="Nenhuma opção encontrada"
              />
              {acessibilidadesWatch.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {acessibilidadesWatch.map((acc) => (
                    <span
                      key={acc}
                      className="font-inter text-[11px] bg-tur-dark text-white px-2 py-0.5 rounded-none flex items-center gap-1.5"
                    >
                      <span>{acc}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setValue(
                            'acessibilidades',
                            acessibilidadesWatch.filter((c) => c !== acc),
                          )
                        }}
                        className="hover:text-tur-accent font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(1)}
                className="px-4"
              >
                Voltar
              </Button>
              <Button type="button" onClick={handleNextStep2} className="px-8">
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

          {/* ETAPA 3 */}
          <div className={step === 3 ? 'flex flex-col gap-4' : 'hidden'}>
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="spot-cep" required>
                  CEP
                </Label>
                <Input
                  id="spot-cep"
                  placeholder="00000-000"
                  error={!!errors.cep}
                  {...register('cep')}
                />
                {errors.cep && (
                  <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                    {errors.cep.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="spot-rua" required>
                  Rua / Logradouro
                </Label>
                <Input
                  id="spot-rua"
                  placeholder="Ex: Av. Beira Mar, nº 100"
                  error={!!errors.rua}
                  {...register('rua')}
                />
                {errors.rua && (
                  <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                    {errors.rua.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="spot-bairro" required>
                Bairro
              </Label>
              <Input
                id="spot-bairro"
                placeholder="Ex: Centro"
                error={!!errors.bairro}
                {...register('bairro')}
              />
              {errors.bairro && (
                <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                  {errors.bairro.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-[2fr_1fr] gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="spot-cidade" required>
                  Cidade
                </Label>
                <Input
                  id="spot-cidade"
                  placeholder="Ex: Maragogi"
                  error={!!errors.cidade}
                  {...register('cidade')}
                />
                {errors.cidade && (
                  <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                    {errors.cidade.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label required>Estado</Label>
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setIsEstadoMenuOpen((prev) => !prev)}
                    className={`w-full h-10 px-0.5 font-inter text-sm bg-transparent border-b rounded-none outline-none transition-colors duration-200 cursor-pointer flex items-center justify-between ${errors.estado ? 'border-tur-red' : 'border-tur-gray-300'}`}
                  >
                    <span
                      className={
                        estadoWatch
                          ? 'text-tur-dark font-medium'
                          : 'text-tur-gray-400'
                      }
                    >
                      {estadoWatch || 'UF'}
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
                      className={`transition-transform duration-200 shrink-0 text-tur-gray-500 ${isEstadoMenuOpen ? 'rotate-180' : ''}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isEstadoMenuOpen && (
                    <div
                      className="fixed inset-0 z-20"
                      onClick={() => setIsEstadoMenuOpen(false)}
                    />
                  )}

                  <div
                    className={`absolute right-0 top-full mt-1 w-24 bg-white border border-black shadow-2xl z-30 p-1 flex flex-col gap-0.5 rounded-none transition-all duration-200 ease-out transform origin-top-right ${
                      isEstadoMenuOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                  >
                    <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
                      {BRAZILIAN_STATES.map((uf) => (
                        <button
                          key={uf}
                          type="button"
                          onClick={() => {
                            setValue('estado', uf, { shouldValidate: true })
                            setIsEstadoMenuOpen(false)
                          }}
                          className={`text-center font-inter text-xs py-1 px-2 transition-colors rounded-none hover:bg-black/5 cursor-pointer ${
                            estadoWatch === uf
                              ? 'bg-tur-dark text-white font-bold'
                              : 'text-tur-dark'
                          }`}
                        >
                          {uf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {errors.estado && (
                  <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
                    {errors.estado.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label htmlFor="spot-complemento">
                Complemento / Ponto de Referência
              </Label>
              <Input
                id="spot-complemento"
                placeholder="Ex: Próximo à praça principal"
                {...register('complemento')}
              />
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 w-full">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setStep(2)}
                className="px-4"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="px-6"
                disabled={createSpot.isPending}
              >
                {createSpot.isPending ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
