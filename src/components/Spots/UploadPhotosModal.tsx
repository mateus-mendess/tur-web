import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { photosService } from '#/services/photosService'
import type { Spot } from '#/types/spot'

interface UploadPhotosModalProps {
  isOpen: boolean
  onClose: () => void
  spot: Spot
}

export function UploadPhotosModal({
  isOpen,
  onClose,
  spot,
}: UploadPhotosModalProps) {
  const queryClient = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use spot.gallery se existir, senão considera a imageUrl como 1 foto (ou 0 se vazia)
  const currentPhotoCount = spot.gallery?.length || (spot.imageUrl ? 1 : 0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsSubmitting(true)
    setError(null)

    try {
      await photosService.uploadPhoto(spot.id, file, currentPhotoCount)
      await queryClient.invalidateQueries({ queryKey: ['spots'] })
      setFile(null)
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload da imagem.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-lg">
      <div className="bg-white p-6 sm:p-8 rounded-none">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark mb-4">
          Cadastrar Imagens
        </h2>
        
        <div className="font-inter text-sm text-tur-gray-700 mb-6 space-y-2">
          <p>Formatos permitidos: JPEG, PNG, WebP</p>
          <p>Tamanho máximo: 2 MB</p>
          <p>Limite de fotos: {currentPhotoCount} / 4 cadastradas</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 text-red-600 font-inter text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="mb-8">
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="font-inter text-sm w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-tur-dark file:text-white file:font-semibold hover:file:bg-tur-dark-hover file:cursor-pointer cursor-pointer disabled:opacity-50"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUpload}
            isLoading={isSubmitting}
            disabled={!file}
          >
            Enviar Imagem
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
