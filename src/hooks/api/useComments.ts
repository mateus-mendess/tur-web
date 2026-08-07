import { useQuery } from '@tanstack/react-query'
import { commentsService } from '#/services/commentsService'

export function useComments(touristPointId: string) {
  return useQuery({
    queryKey: ['comments', touristPointId],
    queryFn: () => commentsService.getComments(touristPointId),
    enabled: !!touristPointId,
  })
}
