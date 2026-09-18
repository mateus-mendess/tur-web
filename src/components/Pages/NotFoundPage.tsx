import { Link } from '@tanstack/react-router'
import { ArrowRightIcon } from '#/components/UI/Icons'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full bg-surface px-4 py-8 -mt-12 text-center h-[calc(100vh-100px)]">
      {/* Video representing 404 */}
      <div className="w-full max-w-lg md:max-w-3xl mx-auto relative z-0">
        <video
          src="/assets/videos/video-page-not-found.mp4"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
          className="w-full h-auto object-cover pointer-events-none"
        />
      </div>

      {/* Typography */}
      <div className="relative z-10 flex flex-col items-center -mt-16 md:-mt-24">
        <h1 className="font-sans text-4xl md:text-5xl font-semibold text-primary mb-4 tracking-tight">
          Ops! Página não encontrada
        </h1>
        
        <p className="font-inter text-base md:text-lg text-tur-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Parece que a página que você procura não está mais aqui. Assim como bons destinos escondidos, às vezes as páginas também saem do mapa.
        </p>

        {/* Action Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-surface px-8 py-3.5 rounded-md font-sans font-medium text-sm transition-transform hover:-translate-y-0.5 shadow-sm"
        >
          <span>Voltar para o início</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
