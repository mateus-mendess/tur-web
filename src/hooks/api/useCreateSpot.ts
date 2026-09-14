import { useMutation, useQueryClient } from '@tanstack/react-query'

import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spotsService.createSpot,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.spots.all })
    },
    onError: () => {
    },
  })
}
