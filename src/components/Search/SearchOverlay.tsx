import { useState, useEffect } from 'react';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'Destinos',
  'Praias',
  'Ecoturismo',
  'Histórico',
  'Gastronomia',
  'Pousadas'
];

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out p-4 md:p-8 pointer-events-none ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}
    >
      {/* Overlay Panel Container */}
      <div className="max-w-5xl mx-auto w-full bg-white/85 backdrop-blur-2xl border border-white/40 rounded-none shadow-2xl p-6 md:p-10 relative overflow-hidden pointer-events-auto">
        
        {/* Close Button - Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/5 hover:bg-black/10 text-tur-dark p-2 rounded-none transition-colors cursor-pointer border border-black/5 flex items-center justify-center backdrop-blur-md shadow-sm"
          aria-label="Fechar busca"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Inner Content */}
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {/* Title */}
          <h2 className="font-dm-sans text-4xl md:text-5xl font-bold text-tur-dark tracking-tight m-0">
            Buscar
          </h2>

          {/* Search Input Area */}
          <div className="relative w-full">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-tur-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite um destino, estado ou categoria..."
              className="w-full bg-white/60 backdrop-blur-md border border-tur-gray-300 rounded-none py-4 pl-12 pr-4 font-inter text-lg text-tur-dark placeholder:text-tur-gray-500 focus:outline-none focus:ring-2 focus:ring-tur-accent transition-shadow"
              autoFocus={isOpen}
            />
          </div>

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
                  onClick={() => setSearchTerm(tag)}
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
  );
}
