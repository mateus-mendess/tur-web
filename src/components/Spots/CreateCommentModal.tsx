import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { Button } from '#/components/UI/Button'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { commentSchema } from '#/schemas/commentSchema'
import type { CommentFormData } from '#/schemas/commentSchema'
import { useCreateComment } from '#/hooks/api/useCreateComment'
import { useAuth } from '#/contexts/AuthContext'

interface CreateCommentModalProps {
  isOpen: boolean
  onClose: () => void
  touristPointId: string
}

export function CreateCommentModal({ isOpen, onClose, touristPointId }: CreateCommentModalProps) {
  const { user } = useAuth()
  const createComment = useCreateComment(touristPointId)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      authorName: '',
      note: 5,
      content: '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      reset({
        authorName: user?.nome || '',
        note: 5,
        content: '',
      })
    }
  }, [isOpen, user, reset])

  const onSubmit = handleSubmit((data) => {
    createComment.mutate(data, {
      onSuccess: () => {
        onClose()
      },
    })
  })

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-lg">
      <form onSubmit={onSubmit} className="bg-white p-6 sm:p-8 rounded-none flex flex-col gap-6">
        <h2 className="font-dm-sans text-2xl font-bold text-tur-dark m-0">
          Avaliar Ponto Turístico
        </h2>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="authorName" required>Nome</Label>
            <Input
              id="authorName"
              placeholder="Seu nome"
              disabled={isSubmitting || createComment.isPending}
              error={!!errors.authorName}
              {...register('authorName')}
            />
            {errors.authorName && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.authorName.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="note" required>Nota (1 a 5)</Label>
            <Input
              id="note"
              type="number"
              min="1"
              max="5"
              placeholder="5"
              disabled={isSubmitting || createComment.isPending}
              error={!!errors.note}
              {...register('note', { valueAsNumber: true })}
            />
            {errors.note && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.note.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="content" required>Comentário</Label>
            <textarea
              id="content"
              placeholder="Conte como foi sua experiência..."
              disabled={isSubmitting || createComment.isPending}
              className={`w-full border rounded-none bg-transparent px-3 py-2 font-inter text-sm text-tur-dark placeholder:text-tur-gray-400 outline-none focus:border-black min-h-[100px] resize-y ${
                errors.content ? 'border-tur-red' : 'border-black/20'
              }`}
              {...register('content')}
            />
            {errors.content && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.content.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting || createComment.isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || createComment.isPending}
          >
            {(isSubmitting || createComment.isPending) ? 'Enviando...' : 'Avaliar'}
          </Button>
        </div>
      </form>
    </BaseModal>
  )
}
