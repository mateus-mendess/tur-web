import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BaseModal } from '#/components/UI/BaseModal'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { useCreateComment } from '#/hooks/api/useCreateComment'
import { reviewSchema } from '#/schemas/reviewSchema'
import type { ReviewFormData } from '#/schemas/reviewSchema'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  spotId: string
  spotName: string
}

export function ReviewModal({ isOpen, onClose, spotId, spotName }: ReviewModalProps) {
  const [hoveredNote, setHoveredNote] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      authorName: '',
      content: '',
      note: 0,
    },
  })

  const note = watch('note')

  const { mutateAsync: createComment, isPending } = useCreateComment(spotId)

  const onReviewSubmit = handleSubmit(async (data) => {
    try {
      await createComment({
        authorName: data.authorName,
        content: data.content,
        note: data.note,
      })
      reset()
      onClose()
    } catch {
      // Error handled by hook
    }
  })

  // Generate 5 stars
  const stars = [1, 2, 3, 4, 5]

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} ariaLabel="Avaliar ponto turístico">
      <SplitModalLayout
        title="Avalie sua experiência"
        description={`Compartilhe suas impressões sobre ${spotName}.`}
        subDescription="Sua opinião é valiosa para outros viajantes!"
        leftFooter={
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 font-sans text-[15px] font-bold text-primary border-b-[1.5px] border-primary pb-[1px] hover:text-secondary hover:border-secondary transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        }
        footer={
          <div className="flex justify-center w-full">
            <Button onClick={onReviewSubmit} isLoading={isPending} disabled={note === 0}>
              Comentar
            </Button>
          </div>
        }
      >
        <form onSubmit={onReviewSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <Label required>Sua Nota</Label>
            <div className="flex items-center gap-2 mt-1">
              {stars.map((star) => {
                const isFilled = (hoveredNote || note) >= star
                return (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredNote(star)}
                    onMouseLeave={() => setHoveredNote(0)}
                    onClick={() => setValue('note', star, { shouldValidate: true })}
                  >
                    <svg
                      className={`w-8 h-8 transition-colors ${
                        isFilled ? 'text-secondary' : 'text-gray-200'
                      }`}
                      fill={isFilled ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </button>
                )
              })}
            </div>
            {errors.note && (
              <span className="font-sans text-xs text-error font-medium mt-1">
                {errors.note.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label required>Seu Nome</Label>
            <Input
              type="text"
              placeholder="Digite seu nome..."
              error={!!errors.authorName}
              {...register('authorName')}
            />
            {errors.authorName && (
              <span className="font-sans text-xs text-error font-medium">
                {errors.authorName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label required>Sua Avaliação</Label>
            <textarea
              className={`w-full font-inter text-sm px-4 py-3 rounded-none border bg-transparent text-tur-dark placeholder:text-black/40 outline-none transition-colors resize-y min-h-[120px] ${
                errors.content ? 'border-error focus:border-error' : 'border-black/30 focus:border-black'
              }`}
              placeholder="Descreva o que achou do local..."
              {...register('content')}
            />
            {errors.content && (
              <span className="font-sans text-xs text-error font-medium">
                {errors.content.message}
              </span>
            )}
          </div>
        </form>
      </SplitModalLayout>
    </BaseModal>
  )
}
