import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { photosService } from '#/services/photosService'
import { queryKeys } from '#/lib/queryKeys'

interface UploadPhotoParams {
  touristPointId: string
  file: File
  currentPhotoCount: number
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      touristPointId,
      file,
      currentPhotoCount,
    }: UploadPhotoParams) =>
      photosService.uploadPhoto(touristPointId, file, currentPhotoCount),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.detail(variables.touristPointId),
      })
      toast.success('Foto enviada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
