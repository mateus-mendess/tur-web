import { useState, useEffect } from 'react'
import type { Spot } from '#/types/spot'

interface SpotReviewsListProps {
  currentSpot: Spot
  isOpen: boolean
}

export function SpotReviewsList({ currentSpot, isOpen }: SpotReviewsListProps) {
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5)

  useEffect(() => {
    if (isOpen) {
      setVisibleReviewsCount(5)
    }
  }, [isOpen, currentSpot])

  if (!currentSpot.reviews || currentSpot.reviews.length === 0) return null

  return (
    <section className="space-y-6 pt-8 border-t border-tur-dark/15">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-inter text-xs font-extrabold uppercase tracking-widest text-tur-accent block">
            DEPOIMENTOS DA COMUNIDADE
          </span>
          <h3 className="font-dm-sans text-2xl sm:text-3xl font-bold uppercase text-tur-dark">
            Avaliações dos Visitantes
          </h3>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button className="px-6 py-2.5 bg-tur-dark text-white font-inter font-bold text-xs uppercase tracking-widest border border-tur-dark rounded-none hover:bg-tur-accent transition-colors cursor-pointer">
            Avaliar
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mt-10 border-y border-dashed border-tur-dark divide-y divide-dashed divide-tur-dark">
        {currentSpot.reviews.slice(0, visibleReviewsCount).map((review) => (
          <div
            key={review.id}
            className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-8 items-center"
          >
            <div className="sm:col-span-4 lg:col-span-3 space-y-1">
              <span className="font-dm-sans font-bold text-sm uppercase tracking-wider text-tur-dark block">
                {review.user}
              </span>
              <span className="font-inter text-xs font-semibold text-tur-dark block">
                Nota: {review.rating ? review.rating.toFixed(1) : '5.0'} / 5.0
              </span>
            </div>
            <div className="sm:col-span-8 lg:col-span-9">
              <p className="font-inter text-base sm:text-lg text-tur-dark leading-relaxed font-normal text-justify">
                "{review.text}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {visibleReviewsCount < currentSpot.reviews.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setVisibleReviewsCount((prev) => prev + 5)}
            className="px-6 py-2 bg-transparent text-tur-dark border border-tur-dark font-inter font-black text-lg tracking-widest hover:bg-tur-dark hover:text-white transition-colors cursor-pointer rounded-none"
            title="Carregar mais comentários"
          >
            ...
          </button>
        </div>
      )}
    </section>
  )
}
