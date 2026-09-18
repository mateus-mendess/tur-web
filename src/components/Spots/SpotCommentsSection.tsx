import React, { Suspense } from 'react'
import type { CommentResponse } from '#/types/api'
import type { Spot } from '#/types/spot'
import { ClientOnly } from '#/components/UI/ClientOnly'
import { MapSkeleton } from '#/components/Spots/MapSkeleton'
import { UserIcon } from '#/components/UI/Icons'
import { PageContainer } from '#/components/UI/PageContainer'

const SpotMiniMap = React.lazy(() => import('#/components/Spots/SpotMiniMap'))

const STAR_FILLED = '★'
const STAR_EMPTY = '☆'

interface SpotCommentsSectionProps {
  spot: Spot
  comments: CommentResponse[]
  isLoadingComments: boolean
  onReviewClick: () => void
}

export function SpotCommentsSection({
  spot,
  comments,
  isLoadingComments,
  onReviewClick,
}: SpotCommentsSectionProps) {
  return (
    <section className="bg-background text-primary py-16 font-sans border-t border-black/10">
      <PageContainer className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:h-[700px]">

        {/* Left Column: Comments List */}
        <div className="lg:w-1/2 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 shrink-0 pr-4">
            <h2 className="text-3xl font-normal">Comentários</h2>
            <button
              type="button"
              onClick={onReviewClick}
              className="border border-primary text-primary px-6 py-2 rounded-sm font-normal text-sm hover:bg-primary hover:text-surface transition-colors duration-200 cursor-pointer"
            >
              Avaliar
            </button>
          </div>

          <div className="flex flex-col border-t border-black/10 overflow-y-auto pr-4 flex-1 scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
            {comments.map((review, idx) => (
              <div key={`${review.authorName}-${idx}`} className="py-8 border-b border-black/10 flex gap-4">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/40 shrink-0">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-base">{review.authorName}</p>
                    <div className="text-secondary text-sm tracking-widest">
                      {STAR_FILLED.repeat(Math.round(review.note))}{STAR_EMPTY.repeat(5 - Math.round(review.note))}
                    </div>
                  </div>
                  <p className="text-black/80 text-sm leading-relaxed line-clamp-3 relative group">
                    {review.content}
                    {review.content.length > 150 && (
                      <button className="text-primary font-bold mt-1 text-xs hover:underline block">Ver mais</button>
                    )}
                  </p>
                </div>
              </div>
            ))}

            {comments.length === 0 && !isLoadingComments && (
              <div className="py-12 text-center text-black/60">
                Ainda não há avaliações para este ponto turístico.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Map */}
        <div className="lg:w-1/2 min-h-[400px] lg:min-h-0 lg:h-full relative shrink-0">
          {spot.latitude && spot.longitude ? (
            <ClientOnly fallback={<MapSkeleton />}>
              <Suspense fallback={<MapSkeleton />}>
                <SpotMiniMap latitude={spot.latitude} longitude={spot.longitude} spotName={spot.name} />
              </Suspense>
            </ClientOnly>
          ) : (
            <div className="w-full h-full min-h-[400px] bg-black/5 flex items-center justify-center text-black/50 border border-black/10 rounded-[6px]">
              Localização exata não disponível no momento.
            </div>
          )}
        </div>

      </PageContainer>
    </section>
  )
}
