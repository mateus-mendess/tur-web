import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { accessibilityService } from '#/services/accessibilityService'
import { queryKeys } from '#/lib/queryKeys'

export function useUpdateAccessibility(touristPointId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (accessibilityTypesIds: number[]) =>
      accessibilityService.updateAccessibility(
        touristPointId,
        accessibilityTypesIds,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.spots.detail(touristPointId),
      })
      toast.success('Acessibilidade atualizada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
