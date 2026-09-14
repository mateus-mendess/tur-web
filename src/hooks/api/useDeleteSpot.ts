import { useMutation, useQueryClient } from '@tanstack/react-query'

import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'

export function useDeleteSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (spotId: string) => spotsService.deleteSpot(spotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.spots.all })
    },
    onError: () => {
    },
  })
}
