import { useQuery } from '@tanstack/react-query'
import { categoriesService } from '#/services/categoriesService'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
    // Categorias mudam raramente; staleTime de 5 minutos para minimizar requests
    staleTime: 1000 * 60 * 5,
  })
}
