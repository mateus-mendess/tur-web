import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoriesService } from '#/services/categoriesService'
import { queryKeys } from '#/lib/queryKeys'

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => categoriesService.createCategory(name),
    onSuccess: () => {
      // Invalida o cache para que a lista de categorias seja recarregada
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
