import { useQuery } from '@tanstack/react-query'
import { commentsService } from '#/services/commentsService'
import { queryKeys } from '#/lib/queryKeys'

export function useComments(touristPointId: string) {
  return useQuery({
    queryKey: queryKeys.comments(touristPointId),
    queryFn: () => commentsService.getComments(touristPointId),
    enabled: !!touristPointId,
  })
}
