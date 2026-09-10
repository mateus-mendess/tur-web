import type { Spot } from '#/types/spot'
import { useState } from 'react'

interface SpotCardProps {
  spot: Spot
  onClick?: () => void
}

export function SpotCard({ spot, onClick }: SpotCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Use gallery images or fallback to the single imageUrl
  const images = spot.gallery && spot.gallery.length > 0 ? spot.gallery : [spot.imageUrl]
  const hasMultipleImages = images.length > 1

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    setCurrentImageIndex(index)
  }

  return (
    <article
      className="group w-full flex flex-col cursor-pointer transition-all duration-300 ease-out"
      onClick={onClick}
    >
      {/* Card Container with Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-tur-dark/5">
        <img
          src={images[currentImageIndex]}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Imagem anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Próxima imagem"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => handleDotClick(e, idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentImageIndex ? 'bg-white opacity-100 scale-110' : 'bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info Section (Outside Image) */}
      <div className="flex flex-col mt-3 gap-0.5">
        <span className="font-sans text-xs uppercase text-primary/60 font-normal tracking-wide">
          {spot.location}
        </span>
        <h3 className="font-sans text-base text-primary m-0 font-normal mt-1">
          {spot.name}
        </h3>
      </div>
    </article>
  )
}
