import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '#/components/UI/Icons'
import { PageContainer } from '#/components/UI/PageContainer'
import { Link } from '@tanstack/react-router'
import { ImagePlaceholder } from '#/components/UI/ImagePlaceholder'
import { useQuery } from '@tanstack/react-query'
import { spotsService } from '#/services/spotsService'
import { toSpot } from '#/types/spot'
import { queryKeys } from '#/lib/queryKeys'

export interface HeroLocation {
  id: string | number
  name?: string
  location?: string
  image: string
}

interface HeroCarouselProps {
  locations?: HeroLocation[]
  autoplay?: boolean
  showArrows?: boolean
}

export function HeroCarousel({ locations: overrideLocations, autoplay = true, showArrows = true }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: spots = [] } = useQuery({
    queryKey: queryKeys.spots.all,
    queryFn: spotsService.getSpots,
    enabled: !overrideLocations,
  })

  const defaultLocations: HeroLocation[] = spots.slice(0, 5).map(tp => {
    const spot = toSpot(tp)
    return {
      id: spot.id,
      name: spot.name,
      location: spot.location,
      image: spot.imageUrl,
    }
  })

  const locations = overrideLocations || defaultLocations

  useEffect(() => {
    if (!autoplay || locations.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % locations.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoplay, locations.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % locations.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + locations.length) % locations.length)
  }

  if (!locations.length) return null

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background group">
      {locations.map((loc, idx) => (
        <div
          key={loc.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <Link
            to="/pontos/$spotId"
            params={{ spotId: loc.id.toString() }}
            className="w-full h-full block relative focus:outline-none"
            aria-label={`Ver detalhes de ${loc.name}`}
          >
            {loc.image ? (
              <img src={loc.image} alt={loc.name || 'Carousel Image'} className="w-full h-full object-cover" />
            ) : (
              <ImagePlaceholder />
            )}
            <div className="absolute inset-0 bg-black/30" />
          </Link>
        </div>
      ))}
      
      {/* Navigation Arrows (visible on hover) */}
      {showArrows && locations.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        </>
      )}

      <div className="absolute bottom-16 inset-x-0 z-20 pointer-events-none">
        <PageContainer className="flex items-end justify-between w-full">
          <div className="pointer-events-auto">
            {(locations[currentIndex].name || locations[currentIndex].location) && (
              <Link
                to="/pontos/$spotId"
                params={{ spotId: locations[currentIndex].id.toString() }}
                className="text-surface block hover:opacity-90 transition-opacity"
              >
                {locations[currentIndex].name && <h1 className="text-5xl font-normal mb-2 drop-shadow-md">{locations[currentIndex].name}</h1>}
                {locations[currentIndex].location && <p className="text-xl opacity-90 drop-shadow-md">{locations[currentIndex].location}</p>}
              </Link>
            )}
          </div>

          {locations.length > 1 && (
            <div className="flex gap-2 shrink-0">
              {locations.map((_, idx) => (
                <div key={idx} className="w-16 h-[2px] bg-white/30 relative overflow-hidden">
                  <div 
                    key={`progress-${idx}-${currentIndex}`} // Force re-render of animation when active
                    className={`absolute top-0 left-0 h-full bg-white ${
                      idx === currentIndex 
                        ? (autoplay ? 'animate-[fillProgress_5s_linear_forwards]' : 'w-full')
                        : idx < currentIndex 
                          ? 'w-full' 
                          : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </PageContainer>
      </div>
    </div>
  )
}
