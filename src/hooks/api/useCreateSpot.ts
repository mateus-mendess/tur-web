import { useMutation, useQueryClient } from '@tanstack/react-query'
import { spotsService } from '../../services/spotsService'

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spotsService.createSpot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
    },
  })
}
