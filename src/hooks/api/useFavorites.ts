import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesService } from '#/services/favoritesService'

const FAVORITES_QUERY_KEY = 'favorites'

export function useSpotFavoriteStatus(spotId: string, userId?: string) {
  const queryClient = useQueryClient()

  const queryKey = [FAVORITES_QUERY_KEY, spotId, userId]

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!userId) return false
      const { isFavorite } = await favoritesService.checkFavoriteStatus(spotId, userId)
      return isFavorite
    },
    enabled: !!userId && !!spotId,
  })

  const mutation = useMutation({
    mutationFn: async (isCurrentlyFavorite: boolean) => {
      if (!userId) return
      if (isCurrentlyFavorite) {
        await favoritesService.removeFavorite(spotId, userId)
      } else {
        await favoritesService.addFavorite(spotId, userId)
      }
    },
    onMutate: async (isCurrentlyFavorite: boolean) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey })
      const previousState = queryClient.getQueryData<boolean>(queryKey)
      queryClient.setQueryData<boolean>(queryKey, !isCurrentlyFavorite)
      return { previousState }
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previousState !== undefined) {
        queryClient.setQueryData(queryKey, context.previousState)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    isFavorite: query.data || false,
    isLoading: query.isLoading,
    toggleFavorite: () => mutation.mutate(query.data || false),
    isToggling: mutation.isPending
  }
}
