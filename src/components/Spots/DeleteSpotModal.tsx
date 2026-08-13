import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Button } from '#/components/UI/Button'
import { spotsService } from '#/services/spotsService'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import type { Spot } from '#/types/spot'

interface DeleteSpotModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
  onDeleted: () => void
}

export function DeleteSpotModal({ isOpen, onClose, spot, onDeleted }: DeleteSpotModalProps) {
  const queryClient = useQueryClient()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await spotsService.deleteSpot(spot.id)
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      toast.success('Ponto turístico excluído com sucesso.')
      onDeleted()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao excluir o ponto turístico.'
      setError(message)
      setIsDeleting(false)
    }
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/65 z-[1000] data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
          <Dialog.Content className="bg-white p-6 sm:p-8 rounded-none w-full max-w-sm flex flex-col gap-5 data-[state=open]:animate-scale-up data-[state=closed]:animate-scale-down outline-none">
            
            <h2 className="font-dm-sans text-xl font-bold text-tur-dark m-0">
              Excluir ponto
            </h2>

            <p className="font-inter text-sm text-tur-gray-700 m-0 leading-relaxed">
              Tem certeza que deseja excluir <strong>"{spot.name}"</strong>? Essa ação não pode ser desfeita.
            </p>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 text-white"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
