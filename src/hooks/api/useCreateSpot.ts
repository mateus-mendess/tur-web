import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { spotsService } from '../../services/spotsService'

export function useCreateSpot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: spotsService.createSpot,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['spots'] })
      toast.success('Ponto turístico cadastrado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao cadastrar o ponto. Tente novamente.')
    },
  })
}
