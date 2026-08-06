import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'

export function useSpot(id: string) {
  return useQuery({
    queryKey: ['spots', id],
    queryFn: () => spotsService.getSpotById(id),
    enabled: !!id,
  })
}
