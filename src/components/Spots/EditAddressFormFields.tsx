import type { UseFormRegister, FieldErrors, UseFormSetValue } from 'react-hook-form'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { ChevronDownIcon } from '#/components/UI/Icons'
import type { StateResponse } from '#/types/api'

interface EditAddressFormFieldsProps {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  isSubmitting: boolean
  setValue: UseFormSetValue<any>
  estadoMenu: { isOpen: boolean; toggle: () => void; close: () => void }
  states: StateResponse[]
  stateIdWatch: number | undefined
  selectedStateLabel: string
}

export function EditAddressFormFields({
  register,
  errors,
  isSubmitting,
  setValue,
  estadoMenu,
  states,
  stateIdWatch,
  selectedStateLabel
}: EditAddressFormFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="zipcode" required>CEP</Label>
          <Input
            id="zipcode"
            placeholder="00000000"
            disabled={isSubmitting}
            error={!!errors.zipcode}
            {...register('zipcode')}
            onChange={(e) => {
              setValue('zipcode', e.target.value.replace(/\D/g, '').slice(0, 8), {
                shouldValidate: true,
              })
            }}
          />
          {errors.zipcode && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.zipcode.message as string}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label htmlFor="street" required>Rua / Logradouro</Label>
          <Input
            id="street"
            disabled={isSubmitting}
            error={!!errors.street}
            {...register('street')}
          />
          {errors.street && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.street.message as string}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="neighborhood" required>Bairro</Label>
        <Input
          id="neighborhood"
          disabled={isSubmitting}
          error={!!errors.neighborhood}
          {...register('neighborhood')}
        />
        {errors.neighborhood && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.neighborhood.message as string}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="city" required>Cidade</Label>
          <Input
            id="city"
            disabled={isSubmitting}
            error={!!errors.city}
            {...register('city')}
          />
          {errors.city && (
            <span className="text-red-500 text-xs mt-1 block">
              {errors.city.message as string}
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
        <Label htmlFor="complement">Complemento / Ponto de Referência</Label>
        <Input
          id="complement"
          disabled={isSubmitting}
          error={!!errors.complement}
          {...register('complement')}
        />
        {errors.complement && (
          <span className="text-red-500 text-xs mt-1 block">
            {errors.complement.message as string}
          </span>
        )}
      </div>
    </div>
  )
}
