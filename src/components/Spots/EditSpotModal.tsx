import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { spotsService } from '#/services/spotsService'
import type { Spot } from '#/types/spot'

interface EditSpotModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
}

export function EditSpotModal({ isOpen, onClose, spot }: EditSpotModalProps) {
  const queryClient = useQueryClient()
  
  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description || '')
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(spot.name)
      setDescription(spot.description || '')
      setError(null)
    }
  }, [isOpen, spot])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validations
    if (name.length < 5 || name.length > 100) {
      setError('O nome deve ter entre 5 e 100 caracteres.')
      return
    }
    if (description.trim().length < 1) {
      setError('A descrição não pode ficar vazia.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await spotsService.updateSpot(spot.id, {
        name,
        description
      })
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar o ponto turístico.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-lg">
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Editar Nome e Descrição
        </h2>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nome do local *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Cristo Redentor"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Descrição *</Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte um pouco sobre este lugar..."
              disabled={isSubmitting}
              className="w-full border border-black/20 rounded-none bg-transparent px-3 py-2 font-inter text-sm text-tur-dark placeholder:text-tur-gray-400 outline-none focus:border-black min-h-[120px] resize-y"
            />
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
