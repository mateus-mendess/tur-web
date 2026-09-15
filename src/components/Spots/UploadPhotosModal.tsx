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

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return

    // Filter by allowed types
    const validFiles = files.filter(f => 
      f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/webp'
    )

    if (validFiles.length < files.length) {
      toast.error('Alguns arquivos não são imagens (apenas JPEG, PNG, WebP).')
    }

    if (selectedFiles.length + validFiles.length > remainingSlots) {
      toast.error(`Você já tem ${currentPhotoCount} fotos cadastradas. Pode adicionar no máximo ${remainingSlots} novas (faltam ${remainingSlots - selectedFiles.length} slots livres na fila).`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending || remainingSlots === 0 || progress.length > 0) return
    handleFileSelect(Array.from(e.dataTransfer.files))
  }

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
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
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
                Adicionar Novas Fotos
              </h4>
              <span className="text-tur-gray-700 font-inter text-xs font-medium">
                Atuais: {currentPhotoCount}/4
              </span>
            </div>

            <div
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={() => {
                if (!(isAnyActionPending || remainingSlots === 0 || progress.length > 0)) {
                  fileInputRef.current?.click()
                }
              }}
              className={`mt-2 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8 transition-colors ${isAnyActionPending || remainingSlots === 0 || progress.length > 0 ? 'opacity-50 cursor-not-allowed border-black/20 bg-black/5' : 'border-black/30 bg-transparent hover:bg-black/5 hover:border-black/50 cursor-pointer'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tur-dark mb-4">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="font-sans text-sm text-tur-dark font-medium mb-1 text-center">
                Solte seus arquivos aqui ou clique para buscar
              </p>
              <p className="font-inter text-xs text-tur-gray-500 text-center">
                Tamanho máximo por arquivo: 2 MB
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileSelect(Array.from(e.target.files || []))}
              className="hidden"
            />
          </div>

          {/* Selected files preview / Progress list */}
          {(selectedFiles.length > 0 || progress.length > 0) && (
            <div className="mt-2 space-y-3">
              <h4 className="font-dm-sans font-bold text-sm uppercase text-tur-dark">
                {progress.length > 0 ? 'Progresso do Envio' : 'Uploads'}
              </h4>
              <ul className="space-y-3">
                {(progress.length > 0 ? progress : selectedFiles).map((item, idx) => {
                  const file = 'file' in item ? item.file : item
                  const status = 'status' in item ? item.status : 'waiting'
                  const error = 'error' in item ? item.error : undefined

                  return (
                    <li key={idx} className="flex flex-col border border-black/10 rounded-sm p-3 bg-white">
                      <div className="flex items-center gap-4">
                        {/* Thumbnail */}
                        <div className="w-12 h-12 shrink-0 bg-tur-gray-100 border border-black/10 flex items-center justify-center overflow-hidden rounded-sm">
                          <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)} />
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm text-tur-dark font-medium truncate">
                            {file.name}
                          </p>
                          <p className="font-inter text-xs text-tur-gray-500 mt-0.5">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        
                        {/* Actions / Status */}
                        <div className="shrink-0 pl-2">
                          {status === 'waiting' && progress.length === 0 && (
                             <button type="button" onClick={() => handleRemoveSelectedFile(idx)} className="p-2 text-tur-gray-500 hover:text-red-600 transition-colors bg-tur-gray-100 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm cursor-pointer" aria-label="Remover">
                                <TrashIcon className="w-4 h-4" />
                             </button>
                          )}
                          {status === 'waiting' && progress.length > 0 && (
                            <span className="font-inter text-xs text-tur-gray-500 font-semibold uppercase tracking-wider">Aguardando</span>
                          )}
                          {status === 'success' && (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                          {status === 'error' && (
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {status === 'uploading' && (
                        <div className="w-full h-1 bg-tur-gray-200 mt-4 rounded-full overflow-hidden">
                           <div className="h-full bg-tur-accent animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {error && (
                        <p className="font-inter text-xs text-red-600 mt-3 border-t border-red-100 pt-2">
                          <strong className="font-semibold">Erro:</strong> {error}
                        </p>
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
