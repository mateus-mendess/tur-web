import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'

export function useSpot(id: string) {
  return useQuery({
    queryKey: queryKeys.spots.detail(id),
    queryFn: () => spotsService.getSpotById(id),
    enabled: !!id,
  })
}
