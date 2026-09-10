import { useIntersectionAnimation } from '#/hooks/useIntersectionAnimation'

export function CommunitySection() {
  const { ref, isVisible } = useIntersectionAnimation(0.2)
  const stats = [
    {
      label: 'Pontos cadastrados',
      value: '1.248',
    },
    {
      label: 'Fotos compartilhadas',
      value: '8.742',
    },
    {
      label: 'Colaboradores',
      value: '642',
    },
  ]

  return (
    <section ref={ref} className="bg-background text-primary py-24 md:py-32 px-6 md:px-12 lg:px-24 font-sans overflow-hidden">
      <div 
        className={`max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        
        {/* Left Column (Content) */}
        <div className="flex flex-col xl:flex-row items-start xl:justify-between gap-12 xl:gap-24 w-full">
          {/* Header */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-primary whitespace-nowrap">
            Comunidade
          </h2>

          {/* Metrics List (Bracket style) */}
          <div className="flex flex-col gap-3 w-full xl:w-auto font-sans text-base md:text-lg xl:mt-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <span className="font-mono tracking-widest text-primary/60 w-24 shrink-0">
                  [{stat.value}]
                </span>
                <span className="text-primary whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}

            <button
              type="button"
              className="mt-16 self-start border border-primary text-primary px-8 py-2.5 rounded-sm font-normal text-sm md:text-base hover:bg-primary hover:text-surface transition-colors duration-200 cursor-pointer"
            >
              Faça parte
            </button>
          </div>
        </div>

        {/* Right Column (Postal Seal) */}
        <div className="hidden lg:flex items-center justify-end">
          <img 
            src="/assets/images/selo-img.png" 
            alt="Selo Postal Tur" 
            className="w-56 h-auto object-contain opacity-90 mix-blend-multiply"
          />
        </div>

      </div>
    </section>
  )
}
