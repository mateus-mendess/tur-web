import { useEffect, useRef, useState } from 'react'
import { toSpot  } from '#/types/spot'
import { useSpots } from '#/hooks/api/useSpots'
import { FeaturedSpotSkeleton } from '#/components/UI/Skeleton'
import { useNavigate } from '@tanstack/react-router'
import { PageContainer } from '#/components/UI/PageContainer'

export function FeaturedSpotsSection() {
  const navigate = useNavigate()
  const { data: spots = [], isLoading } = useSpots()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackContainerRef = useRef<HTMLDivElement>(null)
  const trackContentRef = useRef<HTMLDivElement>(null)

  const [translateX, setTranslateX] = useState(0)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleQueryChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleQueryChange)

    let rafId: number

    const updateTranslateX = () => {
      if (
        !sectionRef.current ||
        !trackContainerRef.current ||
        !trackContentRef.current
      )
        return

      const sectionRect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const totalVerticalScrollable = sectionRect.height - windowHeight

      if (totalVerticalScrollable <= 0) return

      // Calculate vertical scroll progress through this section (0.0 to 1.0)
      const currentScroll = -sectionRect.top
      const progress = Math.max(
        0,
        Math.min(1, currentScroll / totalVerticalScrollable),
      )

      // Calculate max horizontal scroll width
      const maxTranslate = Math.max(
        0,
        trackContentRef.current.scrollWidth -
          trackContainerRef.current.clientWidth,
      )

      setTranslateX(progress * maxTranslate)
    }

    const onScroll = () => {
      rafId = requestAnimationFrame(updateTranslateX)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateTranslateX)

    updateTranslateX()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateTranslateX)
      mediaQuery.removeEventListener('change', handleQueryChange)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="relative bg-tur-bg h-auto py-20">
        <div className="sticky top-0 h-auto flex items-center overflow-hidden">
          <PageContainer className="w-full">
            <div className="flex gap-2 md:gap-3 py-8 pl-6 md:pl-12 lg:pl-20 pr-12 overflow-x-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <FeaturedSpotSkeleton key={i} />
              ))}
            </div>
          </PageContainer>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={sectionRef}
      className={`relative bg-tur-bg ${
        isReducedMotion ? 'h-auto py-20' : 'h-[320vh]'
      }`}
    >
      {/* Sticky Viewport Container */}
      <div
        ref={trackContainerRef}
        className={`${
          isReducedMotion
            ? 'relative h-auto'
            : 'sticky top-0 h-screen overflow-hidden'
        } flex items-center`}
      >
        <PageContainer className="w-full">
          {/* Full Horizontal Sliding Track (Header Panel + All 6 Cards) */}
          <div
            ref={trackContentRef}
            style={{
              transform: isReducedMotion
                ? 'none'
                : `translateX(-${translateX}px)`,
            }}
            className={`flex items-center gap-2 md:gap-3 py-8 pr-12 md:pr-24 will-change-transform transition-transform ease-out ${
              isReducedMotion ? 'overflow-x-auto py-4 w-full' : ''
            }`}
          >
          {/* Header Title Panel (Slides horizontally together with all cards) */}
          <div className="w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] shrink-0 flex flex-col justify-center py-6 pr-4">

            <h2 className="font-dm-sans text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-tur-dark leading-[1.05] mb-5">
              Destinos em Destaque.
            </h2>
            <p className="font-inter text-sm md:text-base text-tur-gray-700 leading-relaxed m-0">
              Deslize para explorar a nossa coleção curada de pontos turísticos,
              culturais e gastronômicos por todo o Brasil.
            </p>

            {/* Interactive Scroll Prompt Indicator */}
            <div className="mt-8 flex items-center gap-3 font-inter text-xs font-bold uppercase tracking-[1.5px] text-tur-dark/70">
              <span className="text-secondary">ROLANDO PARA EXPLORAR</span>
              <div className="w-8 h-8 rounded-none border border-tur-dark/30 flex items-center justify-center text-sm animate-pulse">
                →
              </div>
            </div>
          </div>

          {/* 6 Destination Cards */}
          {spots.map((rawSpot) => {
            const spot = toSpot(rawSpot)
            return (
                <article
                key={spot.id}
                className="group shrink-0 w-[280px] sm:w-[320px] md:w-[360px] flex flex-col cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:z-10"
                onClick={() => navigate({ to: '/pontos/$spotId', params: { spotId: spot.id } })}
              >
                {/* Card Container with Image */}
                <div className="relative aspect-[3/4] w-full rounded-none overflow-hidden shadow-xs group-hover:shadow-xl transition-shadow bg-tur-dark/5">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                <div className="mt-4 flex flex-col gap-1 px-1">
                  <div className="font-inter text-xs sm:text-sm font-normal uppercase tracking-wider text-gray-500">
                    <span>{spot.location}</span>
                  </div>
                  <h3 className="font-dm-sans text-base sm:text-lg md:text-xl font-normal tracking-tight text-tur-dark leading-snug">
                    {spot.name}
                  </h3>
                </div>
              </article>
            )
          })}
        </div>
        </PageContainer>
      </div>
    </div>
  )
}
