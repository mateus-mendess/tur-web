import { useState, useRef, useEffect } from 'react'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import type { Spot } from '#/types/spot'
import { useUploadPhotos } from '#/hooks/api/useUploadPhotos'
import { toast } from 'sonner'

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Calculate limits
  const currentPhotoCount = spot.gallery?.length || (spot.imageUrl ? 1 : 0)
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
      // All successful, close modal
      onClose()
    }
    // Else, keep modal open to show errors
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Cadastrar Imagens
        </h2>
        <div>
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
            disabled={isPending || remainingSlots === 0 || progress.length > 0}
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

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
          {progress.length > 0 && !isPending ? (
            <Button type="button" onClick={onClose}>
              Concluir
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={isPending || selectedFiles.length === 0 || remainingSlots === 0 || progress.length > 0}
              >
                {isPending ? 'Enviando...' : 'Fazer Upload'}
              </Button>
            </>
          )}
        </div>
      </div>
    </BaseModal>
  )
}
