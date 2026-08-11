import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { spotsService } from '#/services/spotsService'
import type { TouristPointUpdateRequest } from '#/types/api'
import { queryKeys } from '#/lib/queryKeys'

export function useUpdateSpot(spotId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: TouristPointUpdateRequest) =>
      spotsService.updateSpot(spotId, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.detail(spotId),
      })
      void queryClient.invalidateQueries({ queryKey: queryKeys.spots.all })
      toast.success('Ponto turístico atualizado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
