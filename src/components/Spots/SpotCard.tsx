import type { Spot } from '#/types/spot'
import { useState } from 'react'
import { ImagePlaceholder } from '#/components/UI/ImagePlaceholder'
import { ChevronLeftIcon, ChevronRightIcon } from '#/components/UI/Icons'


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
      <div className="relative aspect-square w-full overflow-hidden bg-tur-dark/5">
        {images[currentImageIndex] ? (
          <img
            src={images[currentImageIndex]}
            alt={spot.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <ImagePlaceholder className="transition-transform duration-500 group-hover:scale-105" />
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRightIcon className="w-4 h-4" />
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
      <div className="flex flex-col mt-0 gap-0.5 relative">
        <div className="pr-12">
          <span className="font-sans text-xs uppercase text-primary font-normal tracking-wide">
            {spot.location}
          </span>
          <h3 className="font-sans text-base text-primary m-0 font-normal mt-1">
            {spot.name}
          </h3>
        </div>
      </div>
    </article>
  )
}
