import { useQuery } from '@tanstack/react-query'
import { categoriesService } from '#/services/categoriesService'
import { queryKeys } from '#/lib/queryKeys'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesService.getCategories,
    // Categorias mudam raramente; staleTime de 5 minutos para minimizar requests
    staleTime: 1000 * 60 * 5,
  })
}
