import type { Spot } from '#/types/spot'
import { MapPinIcon } from '#/components/UI/Icons'

interface SpotInfoSectionProps {
  spot: Spot
}

export function SpotInfoSection({ spot }: SpotInfoSectionProps) {
  return (
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
            {spot.accessibility &&
            spot.accessibility.length > 0 ? (
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
                  spot.category
                    ? spot.category
                    : 'Turismo',
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
          <div className="flex items-start gap-3 justify-between">
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
  )
}
