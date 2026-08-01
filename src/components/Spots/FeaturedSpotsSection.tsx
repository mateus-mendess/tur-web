import { useEffect, useRef, useState } from 'react';

export interface Spot {
  id: string;
  number: string;
  name: string;
  location: string;
  category: string;
  imageUrl: string;
  author: {
    name: string;
    handle: string;
    avatarUrl: string;
  };
}

const FEATURED_SPOTS: Spot[] = [
  {
    id: '1',
    number: '01',
    name: 'Cristo Redentor',
    location: 'Rio de Janeiro, RJ',
    category: 'Cultura & História',
    imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Mateus Mendes',
      handle: '@mateus.mendes',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: '2',
    number: '02',
    name: 'Lençóis Maranhenses',
    location: 'Barreirinhas, MA',
    category: 'Natureza',
    imageUrl: 'https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Lucas Silva',
      handle: '@lucas.viajante',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: '3',
    number: '03',
    name: 'Pelourinho Histórico',
    location: 'Salvador, BA',
    category: 'Cultura',
    imageUrl: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Ana Souza',
      handle: '@ana.souza',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: '4',
    number: '04',
    name: 'Chapada Diamantina',
    location: 'Lençóis, BA',
    category: 'Aventura',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Carlos Oliveira',
      handle: '@carlos.trilhas',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: '5',
    number: '05',
    name: 'Cataratas do Iguaçu',
    location: 'Foz do Iguaçu, PR',
    category: 'Natureza',
    imageUrl: 'https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Tur. Comunidade',
      handle: '@tur.oficial',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
    },
  },
  {
    id: '6',
    number: '06',
    name: 'Fernando de Noronha',
    location: 'Noronha, PE',
    category: 'Praias',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?q=80&w=1200&auto=format&fit=crop',
    author: {
      name: 'Marina Santos',
      handle: '@marina.praias',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    },
  },
];

export function FeaturedSpotsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const trackContentRef = useRef<HTMLDivElement>(null);

  const [translateX, setTranslateX] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleQueryChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleQueryChange);

    let rafId: number;

    const updateTranslateX = () => {
      if (
        !sectionRef.current ||
        !trackContainerRef.current ||
        !trackContentRef.current
      )
        return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalVerticalScrollable = sectionRect.height - windowHeight;

      if (totalVerticalScrollable <= 0) return;

      // Calculate vertical scroll progress through this section (0.0 to 1.0)
      const currentScroll = -sectionRect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalVerticalScrollable));

      // Calculate max horizontal scroll width
      const maxTranslate = Math.max(
        0,
        trackContentRef.current.scrollWidth - trackContainerRef.current.clientWidth
      );

      setTranslateX(progress * maxTranslate);
    };

    const onScroll = () => {
      rafId = requestAnimationFrame(updateTranslateX);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateTranslateX);

    updateTranslateX();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateTranslateX);
      mediaQuery.removeEventListener('change', handleQueryChange);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative bg-tur-bg ${isReducedMotion ? 'h-auto py-20' : 'h-[320vh]'
        }`}
    >
      {/* Sticky Viewport Container */}
      <div
        ref={trackContainerRef}
        className={`${isReducedMotion
          ? 'relative h-auto px-6 md:px-12'
          : 'sticky top-0 h-screen overflow-hidden'
          } flex items-center`}
      >
        {/* Full Horizontal Sliding Track (Header Panel + All 6 Cards) */}
        <div
          ref={trackContentRef}
          style={{
            transform: isReducedMotion
              ? 'none'
              : `translateX(-${translateX}px)`,
          }}
          className={`flex items-center gap-2 md:gap-3 py-8 pl-6 md:pl-12 lg:pl-20 pr-12 md:pr-24 will-change-transform transition-transform ease-out ${isReducedMotion ? 'overflow-x-auto py-4 w-full' : ''
            }`}
        >
          {/* Header Title Panel (Slides horizontally together with all cards) */}
          <div className="w-[300px] sm:w-[360px] md:w-[420px] lg:w-[460px] shrink-0 flex flex-col justify-center py-6 pr-4">
            <span className="font-inter text-xs font-bold uppercase tracking-[1.5px] text-tur-accent mb-3 block">
              [ GALERIA DE DESTAQUES ]
            </span>
            <h2 className="font-dm-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-tur-dark leading-[1.05] mb-5">
              Destinos em Destaque.
            </h2>
            <p className="font-inter text-sm md:text-base text-tur-gray-700 leading-relaxed m-0">
              Deslize para explorar a nossa coleção curada de pontos turísticos, culturais e gastronômicos por todo o Brasil.
            </p>

            {/* Interactive Scroll Prompt Indicator */}
            <div className="mt-8 flex items-center gap-3 font-inter text-xs font-bold uppercase tracking-[1.5px] text-tur-dark/70">
              <span>ROLANDO PARA EXPLORAR</span>
              <div className="w-8 h-8 rounded-none border border-tur-dark/30 flex items-center justify-center text-sm animate-pulse">
                →
              </div>
            </div>
          </div>

          {/* 6 Destination Cards */}
          {FEATURED_SPOTS.map((spot) => {
            return (
              <article
                key={spot.id}
                className="group shrink-0 w-[280px] sm:w-[320px] md:w-[360px] flex flex-col cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:z-10"
                onClick={() => {
                  alert(`Explorando o ponto: ${spot.name}`);
                }}
              >
                {/* Card Container with Image and Overlay Content */}
                <div className="relative aspect-[3/4] w-full rounded-none overflow-hidden shadow-xs group-hover:shadow-xl transition-shadow bg-tur-dark/5">
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Gradient Overlay with Name at Top & Location at Bottom (Always Visible) */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/15 to-black/75 p-5 md:p-6 flex flex-col justify-between text-white pointer-events-none">
                    {/* Top: Tourist Spot Name */}
                    <div>
                      <h3 className="font-dm-sans text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug drop-shadow-md">
                        {spot.name}
                      </h3>
                    </div>

                    {/* Bottom: Location */}
                    <div className="font-inter text-xs sm:text-sm font-medium text-white/90 drop-shadow-md">
                      <span>{spot.location}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
