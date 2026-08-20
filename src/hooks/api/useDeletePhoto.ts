import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { photosService } from '#/services/photosService'
import { queryKeys } from '#/lib/queryKeys'

export function useDeletePhoto(touristPointId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (photoId: string) => photosService.deletePhoto(photoId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.detail(touristPointId),
      })
      toast.success('Foto removida com sucesso!')
      setTimeout(() => window.location.reload(), 500)
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
