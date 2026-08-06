import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { SPOT_CATEGORIES } from '../../constants/spots'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR_SEARCHES = [
  'Destinos',
  'Praias',
  'Ecoturismo',
  'Histórico',
  'Gastronomia',
  'Pousadas',
]

// Tags que correspondem a categorias reais — navega com ?categoria=
const CATEGORY_TAGS = new Set<string>(SPOT_CATEGORIES)

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [shouldRender, setShouldRender] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle slide down animation phases
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true)
        })
      })
      return () => cancelAnimationFrame(raf)
    } else {
      setIsAnimating(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent background scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleSearch = () => {
    const term = searchTerm.trim()
    if (!term) return
    onClose()
    setSearchTerm('')
    void navigate({ to: '/explorar', search: { busca: term } })
  }

  const handlePopularSearch = (tag: string) => {
    onClose()
    setSearchTerm('')
    if (CATEGORY_TAGS.has(tag)) {
      // É uma categoria — filtra por categoria na página explorar
      void navigate({ to: '/explorar', search: { categoria: tag } })
    } else {
      // Busca de texto genérica
      void navigate({ to: '/explorar', search: { busca: tag } })
    }
  }

  if (!shouldRender) return null

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div
        className={`fixed inset-0 bg-black/65 z-[999] transition-opacity duration-300 ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Top Sliding Search Panel */}
      <div
        className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ease-in-out p-5 md:p-8 pointer-events-none flex justify-center ${
          isAnimating
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full'
        }`}
      >
        {/* Overlay Panel Wrapper */}
        <div className="relative max-w-[920px] w-full pointer-events-auto">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -right-12 top-0 max-md:right-4 max-md:top-4 bg-transparent border-none p-0 flex items-center justify-center cursor-pointer text-white hover:text-tur-accent max-md:text-tur-dark transition-colors duration-200 z-10"
            aria-label="Fechar busca"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-7 h-7"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Overlay Panel Container */}
          <div className="w-full bg-white/95 backdrop-blur-2xl border border-white/40 rounded-none shadow-2xl p-6 md:p-10 overflow-hidden">
            <div className="flex flex-col gap-6 w-full max-w-3xl">
              {/* Title */}
              <h2 className="font-dm-sans text-4xl md:text-5xl font-bold text-tur-dark tracking-tight m-0">
                Buscar
              </h2>

              {/* Search Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSearch()
                }}
                className="relative w-full"
              >
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-tur-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite um destino, estado ou categoria..."
                  className="w-full bg-white/60 backdrop-blur-md border border-tur-gray-300 rounded-none py-4 pl-12 pr-4 font-inter text-lg text-tur-dark placeholder:text-tur-gray-500 focus:outline-none focus:ring-2 focus:ring-tur-accent transition-shadow"
                  autoFocus={isOpen}
                />
                {/* Botão de submit invisível — captura o Enter do input */}
                <button type="submit" className="sr-only">
                  Buscar
                </button>
              </form>

              {/* Divider */}
              <div className="h-[1px] w-full bg-tur-gray-300/60 my-2" />

              {/* Popular Searches */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="font-inter text-sm font-semibold text-tur-gray-700 shrink-0">
                  Buscas em alta:
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handlePopularSearch(tag)}
                      className="font-inter text-sm px-4 py-2 rounded-none border border-tur-gray-400 bg-transparent text-tur-dark hover:border-tur-accent hover:text-tur-accent hover:bg-tur-accent/5 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
