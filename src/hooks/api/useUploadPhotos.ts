import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

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

    const uploadPromises = files.map(async (file, i) => {
      // Set to uploading
      setProgress((prev) =>
        prev.map((item, index) =>
          index === i ? { ...item, status: 'uploading' } : item
        )
      )

      try {
        await photosService.uploadPhoto(touristPointId, file, initialPhotoCount + i)
        
        // On Success
        setProgress((prev) =>
          prev.map((item, index) =>
            index === i ? { ...item, status: 'success' } : item
          )
        )
        return { success: true }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
        
        // On Error
        setProgress((prev) =>
          prev.map((item, index) =>
            index === i
              ? { ...item, status: 'error', error: errorMessage }
              : item
          )
        )
        return { success: false }
      }
    })

    const results = await Promise.allSettled(uploadPromises)
    
    // Count how many succeeded
    const successCount = results.filter(
      (res) => res.status === 'fulfilled' && res.value.success
    ).length

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

    if (successCount > 0) {
      setTimeout(() => window.location.reload(), 1000)
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
