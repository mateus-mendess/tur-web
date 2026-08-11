import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'

export function useSpots() {
  return useQuery({
    queryKey: queryKeys.spots.all,
    queryFn: spotsService.getSpots,
  })
}
