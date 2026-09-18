import { useState, useRef, useEffect } from 'react'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import type { Spot } from '#/types/spot'
import { useUploadPhotos } from '#/hooks/api/useUploadPhotos'
import { useDeletePhoto } from '#/hooks/api/useDeletePhoto'
import { toast } from 'sonner'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'
import { UploadPhotosDropzone } from './UploadPhotos/UploadPhotosDropzone'
import { UploadPhotosList } from './UploadPhotos/UploadPhotosList'
import type { UnifiedItem } from './UploadPhotos/UploadPhotosList'

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


  const unifiedItems: UnifiedItem[] = []
  
  if (spot.photos) {
    spot.photos.forEach((photo) => {
      unifiedItems.push({
        type: 'existing',
        id: photo.id,
        url: photo.url,
        name: `imagem_salva_${photo.id.substring(0, 5)}.jpg`,
        status: 'success'
      })
    })
  }

  const newItems = progress.length > 0 ? progress : selectedFiles
  newItems.forEach((item, idx) => {
    const file = 'file' in item ? item.file : item
    const status = 'status' in item ? item.status : 'waiting'
    const error = 'error' in item ? item.error : undefined
    unifiedItems.push({
      type: 'new',
      index: idx,
      file,
      status,
      error
    })
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <SplitModalLayout
        title="Editar Imagens"
        description="Adicione ou remova fotos do ponto turístico para manter a galeria atualizada."
        leftFooter={
          <>
            {progress.length > 0 && !isPending ? null : (
              <button
                type="button"
                onClick={onClose}
                disabled={isAnyActionPending}
                className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Cancelar
              </button>
            )}
          </>
        }
        footer={
          <div className="flex justify-center w-full">
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
          </div>
        }
      >
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 max-h-[500px]">
          <UploadPhotosDropzone
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => {
              if (!(isAnyActionPending || remainingSlots === 0 || progress.length > 0)) {
                fileInputRef.current?.click()
              }
            }}
            onFileSelect={handleFileSelect}
            fileInputRef={fileInputRef}
            isDisabled={isAnyActionPending || remainingSlots === 0 || progress.length > 0}
            currentPhotoCount={currentPhotoCount}
          />

          <UploadPhotosList
            unifiedItems={unifiedItems}
            progressLength={progress.length}
            isAnyActionPending={isAnyActionPending}
            deletingPhotoId={deletingPhotoId}
            onDeletePhoto={handleDeletePhoto}
            onRemoveSelectedFile={handleRemoveSelectedFile}
          />
        </div>
      </SplitModalLayout>
    </BaseModal>
  )
}
