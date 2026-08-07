import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { photosService } from '#/services/photosService'

export function useDeletePhoto(touristPointId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: string) => photosService.deletePhoto(photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['spots', touristPointId],
      })
      toast.success('Foto removida com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
