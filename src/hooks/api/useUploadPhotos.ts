import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { photosService } from '#/services/photosService'
import { queryKeys } from '#/lib/queryKeys'

export type UploadStatus = 'waiting' | 'uploading' | 'success' | 'error'

export interface FileProgress {
  file: File
  status: UploadStatus
  error?: string
}

export function useUploadPhotos() {
  const queryClient = useQueryClient()
  const [isPending, setIsPending] = useState(false)
  const [progress, setProgress] = useState<FileProgress[]>([])

  const uploadFiles = async (
    touristPointId: string,
    files: File[],
    initialPhotoCount: number,
  ) => {
    setIsPending(true)

    // Initialize progress state
    const initialProgress: FileProgress[] = files.map((file) => ({
      file,
      status: 'waiting',
    }))
    setProgress(initialProgress)

    let successCount = 0
    let currentCount = initialPhotoCount

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Update status to uploading
      setProgress((prev) =>
        prev.map((item, index) =>
          index === i ? { ...item, status: 'uploading' } : item,
        ),
      )

      try {
        await photosService.uploadPhoto(touristPointId, file, currentCount)
        successCount++
        currentCount++ // Increment count so the next validation knows about this new photo

        setProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'success' } : item,
          ),
        )
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Erro desconhecido'
        setProgress((prev) =>
          prev.map((item, index) =>
            index === i
              ? { ...item, status: 'error', error: errorMessage }
              : item,
          ),
        )
      }
    }

    // After all files are processed
    setIsPending(false)

    // Invalidate query once if at least one photo was uploaded successfully
    if (successCount > 0) {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.detail(touristPointId),
      })
      // If we are updating the list of all spots too:
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.all,
      })
    }

    // Show consolidated toast
    if (successCount === files.length) {
      toast.success(
        `${successCount} ${successCount === 1 ? 'foto enviada' : 'fotos enviadas'} com sucesso!`,
      )
    } else if (successCount > 0) {
      toast.warning(
        `${successCount} de ${files.length} fotos enviadas com sucesso.`,
      )
    } else {
      toast.error(
        `Falha ao enviar ${files.length === 1 ? 'a foto' : 'as fotos'}.`,
      )
    }

    if (successCount > 0) {
      setTimeout(() => window.location.reload(), 500)
    }

    return { successCount, totalFiles: files.length }
  }

  const resetProgress = () => {
    setProgress([])
    setIsPending(false)
  }

  return {
    uploadFiles,
    isPending,
    progress,
    resetProgress,
  }
}
