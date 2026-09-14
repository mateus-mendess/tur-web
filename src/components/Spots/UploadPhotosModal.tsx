import { useState, useRef, useEffect } from 'react'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import type { Spot } from '#/types/spot'
import { useUploadPhotos } from '#/hooks/api/useUploadPhotos'
import { useDeletePhoto } from '#/hooks/api/useDeletePhoto'
import { toast } from 'sonner'
import { TrashIcon } from '#/components/UI/Icons'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFiles, isPending, progress, resetProgress } = useUploadPhotos()
  const deletePhoto = useDeletePhoto(spot.id)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const [uploadButtonStatus, setUploadButtonStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Calculate limits using spot.photos directly
  const currentPhotoCount = spot.photos?.length || 0
  const remainingSlots = Math.max(0, 4 - currentPhotoCount)

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setSelectedFiles([])
      resetProgress()
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [isOpen])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    
    const files = Array.from(e.target.files)
    
    if (files.length > remainingSlots) {
      toast.error(`Você já tem ${currentPhotoCount} fotos. Pode adicionar no máximo ${remainingSlots} agora.`)
      // Limpar seleção inválida
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    
    setSelectedFiles(files)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return

    const { successCount, totalFiles } = await uploadFiles(spot.id, selectedFiles, currentPhotoCount)
    
    if (successCount === totalFiles) {
      setUploadButtonStatus('success')
      setTimeout(() => {
        onClose()
      }, 700)
    } else {
      setUploadButtonStatus('error')
    }
  }

  const handleDeletePhoto = (photoId: string) => {
    setDeletingPhotoId(photoId)
    deletePhoto.mutate(photoId, {
      onSettled: () => {
        setDeletingPhotoId(null)
      }
    })
  }

  const isAnyActionPending = isPending || deletingPhotoId !== null

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <SplitModalLayout
        title="Editar Imagens"
        description="Adicione ou remova fotos do ponto turístico para manter a galeria atualizada."
        footer={
          <>
            {progress.length > 0 && !isPending ? (
              <div />
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isAnyActionPending}
              >
                Cancelar
              </Button>
            )}

            {progress.length > 0 && !isPending ? (
              <Button type="button" onClick={onClose}>
                Concluir
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleUpload}
                isLoading={isPending}
                isSuccess={uploadButtonStatus === 'success'}
                isError={uploadButtonStatus === 'error'}
              >
                Fazer Upload
              </Button>
            )}
          </>
        }
      >
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 max-h-[500px]">
          {/* Existing photos preview */}
          {spot.photos && spot.photos.length > 0 && (
            <div className="space-y-3 pb-6">
              <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
                Fotos Atuais
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {spot.photos.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square bg-tur-gray-100 border border-black/10">
                    <img
                      src={photo.url}
                      alt="Foto do ponto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleDeletePhoto(photo.id)}
                        disabled={isAnyActionPending && deletingPhotoId !== photo.id}
                        isLoading={deletingPhotoId === photo.id}
                        className="p-2 bg-white text-red-600 rounded-none hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Excluir foto"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark mb-2">
              Adicionar Novas Fotos
            </h4>
            <p className="text-tur-gray-700 font-inter text-sm mb-4">
              Você pode enviar até 4 fotos do seu ponto turístico. (Atuais: {currentPhotoCount}/4)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileSelect}
              className="block w-full text-sm text-tur-dark bg-white border border-black/20 rounded-none
                file:mr-4 file:py-2.5 file:px-4
                file:rounded-none file:border-0 file:border-r file:border-black/20
                file:text-xs file:font-bold file:uppercase file:tracking-widest
                file:bg-tur-dark file:text-white
                hover:file:bg-tur-accent hover:file:cursor-pointer transition-colors"
              disabled={isAnyActionPending || remainingSlots === 0 || progress.length > 0}
            />
          </div>

          {/* Selected files preview / Progress list */}
          {(selectedFiles.length > 0 || progress.length > 0) && (
            <div className="border border-black/10 p-4 space-y-3">
              <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
                {progress.length > 0 ? 'Progresso do Envio' : 'Arquivos Selecionados'}
              </h4>
              <ul className="space-y-2">
                {(progress.length > 0 ? progress : selectedFiles).map((item, idx) => {
                  const file = 'file' in item ? item.file : item
                  const status = 'status' in item ? item.status : 'waiting'
                  const error = 'error' in item ? item.error : undefined

                  return (
                    <li key={idx} className="flex flex-col text-sm font-inter">
                      <div className="flex items-center justify-between">
                        <span className="text-tur-dark truncate max-w-[200px] sm:max-w-[300px]">
                          {file.name}
                        </span>
                        <span className={`font-semibold text-xs uppercase tracking-wider ${
                          status === 'success' ? 'text-green-600' :
                          status === 'error' ? 'text-red-600' :
                          status === 'uploading' ? 'text-tur-accent animate-pulse' :
                          'text-tur-gray-500'
                        }`}>
                          {status === 'waiting' && 'Aguardando'}
                          {status === 'uploading' && 'Enviando...'}
                          {status === 'success' && 'Enviado'}
                          {status === 'error' && 'Falha'}
                        </span>
                      </div>
                      {error && (
                        <span className="text-red-600 text-xs mt-1">
                          Motivo: {error}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </SplitModalLayout>
    </BaseModal>
  )
}
