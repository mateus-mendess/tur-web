import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'

export function useUserSpots(userId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.spots.all, 'user', userId],
    queryFn: async () => {
      const allSpots = await spotsService.getSpots()
      return allSpots.filter(spot => spot.userId === userId)
    },
    enabled: !!userId,
  })
}
