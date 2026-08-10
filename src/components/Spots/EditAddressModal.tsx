import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { addressService } from '#/services/addressService'
import type { TouristPointResponse } from '#/types/api'
import { useStates } from '#/hooks/api/useStates'

interface EditAddressModalProps {
  isOpen: boolean
  onClose: () => void
  rawSpot: TouristPointResponse
}

export function EditAddressModal({ isOpen, onClose, rawSpot }: EditAddressModalProps) {
  const queryClient = useQueryClient()
  const { data: states = [] } = useStates()
  
  const [street, setStreet] = useState('')
  const [complement, setComplement] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [stateId, setStateId] = useState<number | ''>('')
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen && states.length > 0) {
      setStreet(rawSpot.address.street || '')
      setComplement(rawSpot.address.complement || '')
      setNeighborhood(rawSpot.address.neighborhood || '')
      setCity(rawSpot.address.city || '')
      setZipcode(rawSpot.address.zipcode || '')
      
      const foundState = states.find(s => s.name === rawSpot.address.state)
      setStateId(foundState ? foundState.id : '')
      setError(null)
    }
  }, [isOpen, rawSpot, states])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!street || !neighborhood || !city || !zipcode || stateId === '') {
      setError('Preencha todos os campos obrigatórios.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await addressService.updateAddress(rawSpot.id, {
        street,
        complement,
        neighborhood,
        city,
        zipcode,
        stateId: Number(stateId)
      })
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar o endereço.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-xl">
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Editar Localização
        </h2>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="zipcode">CEP *</Label>
            <Input
              id="zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="00000000"
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="street">Rua *</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="neighborhood">Bairro *</Label>
            <Input
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-1 flex flex-col">
              <Label htmlFor="stateId">Estado *</Label>
              <select
                id="stateId"
                value={stateId}
                onChange={(e) => setStateId(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={isSubmitting || states.length === 0}
                className="w-full h-10 border border-black/20 rounded-none bg-transparent px-3 font-inter text-sm text-tur-dark outline-none focus:border-black"
              >
                <option value="">Selecione...</option>
                {states.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
          >
            Salvar
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
