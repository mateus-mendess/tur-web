import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'
import { queryKeys } from '#/lib/queryKeys'
import { getStoredFavorites } from '#/services/favoritesService'

export function useFavoriteSpots(userId: string | undefined) {
  return useQuery({
    queryKey: [...queryKeys.spots.all, 'favorites', userId],
    queryFn: async () => {
      if (!userId) return []
      const favoriteIds = getStoredFavorites(userId)
      const allSpots = await spotsService.getSpots()
      return allSpots.filter(spot => favoriteIds.includes(spot.id))
    },
    enabled: !!userId,
  })
}
