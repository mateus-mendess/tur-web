import { useState } from 'react'
import { BaseModal } from '#/components/UI/BaseModal'
import { SplitModalLayout } from '#/components/UI/SplitModalLayout'
import { Input } from '#/components/UI/Input'
import { Label } from '#/components/UI/Label'
import { Button } from '#/components/UI/Button'
import { useCreateComment } from '#/hooks/api/useCreateComment'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  spotId: string
  spotName: string
}

export function ReviewModal({ isOpen, onClose, spotId, spotName }: ReviewModalProps) {
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [note, setNote] = useState(0)
  const [hoveredNote, setHoveredNote] = useState(0)

  const { mutateAsync: createComment, isPending } = useCreateComment(spotId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!authorName.trim() || !content.trim() || note === 0) return

    try {
      await createComment({
        authorName,
        content,
        note,
      })
      // Reset form and close
      setAuthorName('')
      setContent('')
      setNote(0)
      onClose()
    } catch {
      // Error is handled by the hook (toast)
    }
  }

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
            <Button onClick={(e) => { void handleSubmit(e as unknown as React.FormEvent) }} isLoading={isPending} disabled={note === 0 || !authorName.trim() || !content.trim()}>
              Comentar
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                    onClick={() => setNote(star)}
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
          </div>

          <div className="flex flex-col gap-1.5">
            <Label required>Seu Nome</Label>
            <Input
              type="text"
              placeholder="Digite seu nome..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label required>Sua Avaliação</Label>
            <textarea
              className="w-full font-inter text-sm px-4 py-3 rounded-none border border-black/30 bg-transparent text-tur-dark placeholder:text-black/40 focus:border-black outline-none transition-colors resize-y min-h-[120px]"
              placeholder="Descreva o que achou do local..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </form>
      </SplitModalLayout>
    </BaseModal>
  )
}
