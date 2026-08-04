import { useEffect, useRef, useState } from 'react'

interface ScrollRevealSectionProps {
  tagline?: string
  text?: string
}

const DEFAULT_TAGLINE = '[ Plataforma Open Source ]'
const DEFAULT_TEXT =
  'O Tur. é uma plataforma open source onde qualquer pessoa pode cadastrar e descobrir pontos turísticos, culturais e gastronômicos. Mapeie seu lugar favorito e ajude o mundo a explorar além do óbvio.'

export function ScrollRevealSection({
  tagline = DEFAULT_TAGLINE,
  text = DEFAULT_TEXT,
}: ScrollRevealSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  const words = text.split(' ')

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleQueryChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleQueryChange)

    let rafId: number

    const updateScrollProgress = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Keep activation moment EXACTLY at 40% of viewport height (as requested by user)
      const startPoint = windowHeight * 0.4
      // Extend endPoint far negative to create a long, smooth, unhurried reveal distance
      const endPoint = -windowHeight * 0.6
      const totalRange = startPoint - endPoint

      if (totalRange <= 0) return

      const progress = (startPoint - rect.top) / totalRange
      const clampedProgress = Math.max(0, Math.min(1, progress))

      setScrollProgress(clampedProgress)
    }

    const onScroll = () => {
      rafId = requestAnimationFrame(updateScrollProgress)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateScrollProgress)

    // Initial call to set position
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateScrollProgress)
      mediaQuery.removeEventListener('change', handleQueryChange)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section
      id="intro-section"
      ref={containerRef}
      className="relative bg-tur-bg py-44 md:py-60 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center select-none overflow-hidden min-h-[90vh]"
    >
      {/* Tagline Badge */}
      <div className="mb-8 md:mb-12 font-inter text-sm md:text-base font-medium tracking-wide text-tur-dark/80">
        {tagline}
      </div>

      {/* Main Animated Statement */}
      <div className="max-w-4xl font-dm-sans text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-medium leading-[1.35] md:leading-[1.4] tracking-[-0.5px]">
        {words.map((word, index) => {
          if (isReducedMotion) {
            return (
              <span
                key={index}
                className="text-tur-dark inline-block mr-[0.28em]"
              >
                {word}
              </span>
            )
          }

          // Calculate progress threshold for each word
          const start = index / words.length
          const end = (index + 1) / words.length

          // Interpolate opacity between 0.2 (muted light gray) and 1.0 (deep dark #111111)
          const wordStep = Math.max(
            0,
            Math.min(1, (scrollProgress - start) / (end - start)),
          )
          const opacity = 0.2 + wordStep * 0.8

          return (
            <span
              key={index}
              style={{
                opacity,
                color: '#111111',
                transition: 'opacity 0.2s ease-out',
                willChange: 'opacity',
              }}
              className="inline-block mr-[0.28em]"
            >
              {word}
            </span>
          )
        })}
      </div>
    </section>
  )
}
