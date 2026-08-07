import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { BaseModal } from '#/components/UI/BaseModal'
import type { Spot } from '#/types/spot'
import { BookmarkIcon, ShareIcon, CloseIcon, MapPinIcon } from '#/components/UI/Icons'

interface SpotDetailModalProps {
  spot: Spot | null
  isOpen: boolean
  onClose: () => void
}

export function SpotDetailModal({
  spot,
  isOpen,
  onClose,
}: SpotDetailModalProps) {
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5)

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setVisibleReviewsCount(5)
    }
  }, [isOpen, spot])

  if (!spot) return null

  const images =
    spot.gallery && spot.gallery.length > 0 ? spot.gallery : [spot.imageUrl]

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay container */}
        <div className="fixed inset-0 z-[1000] flex flex-col justify-end pointer-events-none">
          {/* Darkened Blur Backdrop */}
          <Dialog.Overlay className="absolute inset-0 bg-black/65 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out transition-opacity pointer-events-auto" />

          {/* Sheet Container */}
          <Dialog.Content
            aria-describedby={undefined}
            className="pointer-events-auto relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] mt-14 md:mt-16 bg-tur-bg text-tur-dark overflow-y-auto flex flex-col font-inter border-t border-tur-dark data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom duration-300 rounded-none z-10 outline-none"
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
              }
            }}
          >
            <Dialog.Title className="sr-only">{spot.name}</Dialog.Title>

            {/* 1. TOP BAR */}
            <header className="sticky top-0 z-40 w-full bg-tur-bg/95 backdrop-blur-md border-b border-tur-dark/15 px-6 md:px-12 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-dm-sans font-bold text-base text-tur-dark uppercase tracking-wider">
                    {spot.name}
                  </span>
                  <span className="font-inter text-xs text-tur-gray-700">
                    por{' '}
                    <strong className="text-tur-dark font-semibold">
                      {spot.author.name}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2.5 rounded-none bg-transparent text-tur-dark hover:bg-tur-dark hover:text-white transition-colors cursor-pointer"
                  title="Salvar Ponto"
                >
                  <BookmarkIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2.5 rounded-none bg-transparent text-tur-dark hover:bg-tur-dark hover:text-white transition-colors cursor-pointer"
                  title="Compartilhar"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
                <Dialog.Close asChild>
                  <button
                    className="p-2.5 rounded-none border border-tur-dark bg-tur-dark text-white hover:bg-tur-accent transition-colors cursor-pointer ml-1"
                    title="Fechar Modal"
                    aria-label="Fechar"
                  >
                    <CloseIcon className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </Dialog.Close>
              </div>
            </header>

            {/* Floating Score Badge */}
            <div className="absolute left-6 md:left-12 top-[88px] border border-tur-dark p-2 w-16 sm:w-20 text-center flex flex-col items-center justify-center rounded-none bg-tur-bg z-10 pointer-events-none">
              <span className="font-inter text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-tur-accent">
                NOTA
              </span>
              <span className="font-dm-sans text-xl sm:text-2xl font-extrabold text-tur-dark leading-none my-0.5">
                {spot.rating || '4.8'}
              </span>
              <span className="font-inter text-[8px] sm:text-[9px] text-tur-dark/60 font-semibold">
                / 5.0
              </span>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 w-full px-6 md:px-12 pt-8 pb-16 space-y-12">
              <section className="relative pt-4 pb-2">
                <div className="text-center mb-6">
                  <span className="font-inter text-xs font-extrabold uppercase tracking-[2px] text-tur-dark/60">
                    PUBLICADO -{' '}
                    {spot.publishedAt
                      ? spot.publishedAt
                          .replace(/\bDE\b/gi, ',')
                          .replace(/\s+/g, ' ')
                          .toUpperCase()
                      : 'OUTUBRO, 2023'}
                  </span>
                </div>
                <div className="text-center my-6 md:my-10">
                  <h1 className="font-dm-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-tur-dark leading-[0.95]">
                    {spot.name}
                  </h1>
                  <p className="font-inter text-sm sm:text-base md:text-lg font-medium text-tur-gray-700 mt-4 max-w-2xl mx-auto">
                    {spot.location}
                  </p>
                </div>
              </section>

              <section className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 w-full">
                  <div className="md:col-span-7 h-[350px] md:h-[480px] lg:h-[560px] bg-tur-dark/5 rounded-none overflow-hidden">
                    <img
                      src={images[0]}
                      alt={`${spot.name} 1`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-5 flex flex-col justify-between gap-3 md:gap-4 h-auto md:h-[480px] lg:h-[560px]">
                    <div className="h-[220px] md:h-[48%] bg-tur-dark/5 rounded-none overflow-hidden">
                      <img
                        src={images[1] || images[0]}
                        alt={`${spot.name} 2`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 h-[200px] md:h-[48%]">
                      <div className="h-full bg-tur-dark/5 rounded-none overflow-hidden">
                        <img
                          src={images[2] || images[0]}
                          alt={`${spot.name} 3`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="h-full bg-tur-dark/5 rounded-none overflow-hidden">
                        <img
                          src={images[3] || images[1] || images[0]}
                          alt={`${spot.name} 4`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch pt-6">
                <div className="lg:col-span-7 xl:col-span-8 space-y-6 lg:border-r lg:border-tur-dark/15 lg:pr-10 xl:pr-12 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="font-dm-sans text-2xl sm:text-3xl font-bold uppercase text-tur-dark">
                      Sobre
                    </h3>
                    <div className="space-y-4 font-inter text-base sm:text-lg text-tur-dark/90 leading-relaxed font-normal">
                      {spot.description ? (
                        spot.description
                          .split('\n\n')
                          .map((paragraph, idx) => <p key={idx}>{paragraph}</p>)
                      ) : (
                        <p>
                          O local oferece uma experiência visual memorável e
                          contato direto com a história e cultura da região.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-tur-dark/15 grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch flex-1">
                    <div className="space-y-4 sm:border-r sm:border-tur-dark/15 sm:pr-8 h-full">
                      <h4 className="font-dm-sans text-lg font-bold uppercase text-tur-dark">
                        Acessibilidade
                      </h4>
                      {spot.accessibility && spot.accessibility.length > 0 ? (
                        <ul className="space-y-2.5">
                          {spot.accessibility.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2.5 font-inter text-sm sm:text-base font-medium text-tur-dark"
                            >
                              <span className="text-tur-accent font-black text-base sm:text-lg">
                                +
                              </span>{' '}
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-inter text-sm text-tur-gray-600 italic">
                          Sem informações específicas registradas.
                        </p>
                      )}
                    </div>

                    <div className="space-y-4 sm:pl-2 h-full">
                      <h4 className="font-dm-sans text-lg font-bold uppercase text-tur-dark">
                        Categorias
                      </h4>
                      <ul className="space-y-2.5">
                        {(
                          spot.tags || [
                            spot.category ? spot.category : 'Turismo',
                            'Ponto Turístico',
                            'Vistas',
                          ]
                        ).map((tag, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2.5 font-inter text-sm sm:text-base font-medium text-tur-dark"
                          >
                            <span className="text-tur-accent font-black text-base sm:text-lg">
                              •
                            </span>{' '}
                            {tag.replace(/^#/, '')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 xl:col-span-4 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <MapPinIcon className="w-5 h-5 text-tur-accent shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-dm-sans font-bold text-base text-tur-dark uppercase">
                          Localização
                        </h4>
                        <p className="font-inter text-sm text-tur-gray-700 mt-1 leading-relaxed">
                          {spot.address || spot.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative aspect-[4/3] w-full bg-tur-dark/10 group cursor-pointer overflow-hidden border border-tur-dark rounded-none">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"></div>

                    <div className="absolute inset-0 bg-tur-dark/40 group-hover:bg-tur-dark/20 transition-colors flex items-center justify-center">
                      <div className="bg-tur-dark text-white border border-white px-4 py-2 font-inter text-xs font-bold uppercase tracking-widest rounded-none">
                        Ver Mapa Interativo
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-tur-dark text-white font-inter font-bold text-xs uppercase tracking-widest border border-tur-dark rounded-none hover:bg-tur-accent transition-colors cursor-pointer">
                    Abrir no Google Maps →
                  </button>
                </div>
              </section>

              {spot.reviews && spot.reviews.length > 0 && (
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
                    <button className="self-start sm:self-auto px-6 py-2.5 bg-tur-dark text-white font-inter font-bold text-xs uppercase tracking-widest border border-tur-dark rounded-none hover:bg-tur-accent transition-colors cursor-pointer">
                      Avaliar
                    </button>
                  </div>

                  <div className="mt-8 sm:mt-10 border-y border-dashed border-tur-dark divide-y divide-dashed divide-tur-dark">
                    {spot.reviews
                      .slice(0, visibleReviewsCount)
                      .map((review) => (
                        <div
                          key={review.id}
                          className="py-6 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-8 items-center"
                        >
                          <div className="sm:col-span-4 lg:col-span-3 space-y-1">
                            <span className="font-dm-sans font-bold text-sm uppercase tracking-wider text-tur-dark block">
                              {review.user}
                            </span>
                            <span className="font-inter text-xs font-semibold text-tur-dark block">
                              Nota:{' '}
                              {review.rating ? review.rating.toFixed(1) : '5.0'}{' '}
                              / 5.0
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

                  {visibleReviewsCount < spot.reviews.length && (
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() =>
                          setVisibleReviewsCount((prev) => prev + 5)
                        }
                        className="px-6 py-2 bg-transparent text-tur-dark border border-tur-dark font-inter font-black text-lg tracking-widest hover:bg-tur-dark hover:text-white transition-colors cursor-pointer rounded-none"
                        title="Carregar mais comentários"
                      >
                        ...
                      </button>
                    </div>
                  )}
                </section>
              )}
            </main>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
