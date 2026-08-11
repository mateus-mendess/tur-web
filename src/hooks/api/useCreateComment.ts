import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { commentsService } from '#/services/commentsService'
import type { CommentRequest } from '#/types/api'
import { queryKeys } from '#/lib/queryKeys'

export function useCreateComment(touristPointId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: CommentRequest) =>
      commentsService.createComment(touristPointId, comment),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments(touristPointId),
      })
      toast.success('Comentário enviado com sucesso!')
    },
    onError: (error: Error) => {
      toast.error(error.message)
    },
  })
}
