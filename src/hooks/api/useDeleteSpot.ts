import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { spotsService } from '#/services/spotsService'

export function useDeleteSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (spotId: string) => spotsService.deleteSpot(spotId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['spots'] })
      toast.success('Ponto turístico removido com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
