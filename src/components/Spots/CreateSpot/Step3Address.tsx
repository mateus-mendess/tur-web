import { useFormContext } from 'react-hook-form'
import type { SpotFormData } from '#/schemas/spotSchema'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { useDropdown } from '#/hooks/useDropdown'
import { useStates } from '#/hooks/api/useStates'
import { ChevronDownIcon } from '#/components/UI/Icons'

export function Step3Address() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<SpotFormData>()

  const estadoMenu = useDropdown()
  const { data: states = [] } = useStates()
  const stateIdWatch = watch('addressRequest.stateId')
  // Exibição: mostra a abreviação do estado selecionado
  const selectedStateLabel = states.find((s) => s.id === stateIdWatch)?.abbreviation ?? ''

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="spot-cep" required>
            CEP
          </Label>
          <Input
            id="spot-cep"
            placeholder="00000-000"
            error={!!errors.addressRequest?.zipcode}
            {...register('addressRequest.zipcode')}
          />
          {errors.addressRequest?.zipcode && (
            <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
              {errors.addressRequest.zipcode.message}
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
            error={!!errors.addressRequest?.street}
            {...register('addressRequest.street')}
          />
          {errors.addressRequest?.street && (
            <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
              {errors.addressRequest.street.message}
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
          error={!!errors.addressRequest?.neighborhood}
          {...register('addressRequest.neighborhood')}
        />
        {errors.addressRequest?.neighborhood && (
          <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
            {errors.addressRequest.neighborhood.message}
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
            error={!!errors.addressRequest?.city}
            {...register('addressRequest.city')}
          />
          {errors.addressRequest?.city && (
            <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
              {errors.addressRequest.city.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <Label required>Estado</Label>
          <div className="relative w-full">
            <button
              type="button"
              onClick={estadoMenu.toggle}
              className={`w-full h-10 px-0.5 font-inter text-sm bg-transparent border-b rounded-none outline-none transition-colors duration-200 cursor-pointer flex items-center justify-between ${errors.addressRequest?.stateId ? 'border-tur-red' : 'border-tur-gray-300'}`}
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
              <ChevronDownIcon
                className={`w-3 h-3 transition-transform duration-200 shrink-0 text-tur-gray-500 ${estadoMenu.isOpen ? 'rotate-180' : ''}`}
                strokeWidth="2.5"
              />
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
                      setValue('addressRequest.stateId', state.id, { shouldValidate: true })
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
          {errors.addressRequest?.stateId && (
            <span className="font-inter text-xs text-tur-red mt-0.5 block font-medium">
              {errors.addressRequest.stateId.message}
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
          {...register('addressRequest.complement')}
        />
      </div>

    </div>
  )
}
