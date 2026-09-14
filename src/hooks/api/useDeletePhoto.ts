import { useMutation, useQueryClient } from '@tanstack/react-query'

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
      setTimeout(() => window.location.reload(), 1000)
    },
    onError: () => {
    },
  })
}
