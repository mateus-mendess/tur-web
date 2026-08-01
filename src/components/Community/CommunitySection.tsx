export function CommunitySection() {
  const stats = [
    {
      label: 'PONTOS CADASTRADOS',
      code: 'TUR · BR 001',
      value: '1.248',
    },
    {
      label: 'FOTOS COMPARTILHADAS',
      code: 'IMG · GLOBAL FR 217',
      value: '8.742',
    },
    {
      label: 'COLABORADORES',
      code: 'COMM · CM 042',
      value: '642',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start lg:items-stretch gap-10 lg:gap-16">
        
        {/* Left Column */}
        <div className="flex-1 lg:w-4/12 flex flex-col justify-between items-start gap-8">
          <div>
            <h2 className="font-dm-sans text-5xl sm:text-6xl lg:text-7xl font-bold text-tur-dark tracking-tight">
              Comunidade
            </h2>
          </div>

          {/* "Faça parte" Button (Inspired by Image 1's REACH US button style) */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="border border-tur-dark px-5 py-2.5 font-inter text-xs font-bold uppercase tracking-widest text-tur-dark hover:bg-tur-dark hover:text-tur-bg transition-colors duration-200 cursor-pointer"
            >
              FAÇA PARTE
            </button>
            <button
              type="button"
              aria-label="Faça parte da comunidade"
              className="w-10 h-10 rounded-none border border-tur-dark flex items-center justify-center text-tur-dark hover:bg-tur-dark hover:text-tur-bg transition-colors duration-200 cursor-pointer"
            >
              <span className="text-base font-medium">→</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 lg:w-8/12 w-full flex flex-col lg:border-l border-tur-dark lg:pl-10">
          
          {/* Linha Superior (Destaque Principal) */}
          <div className="border-t border-b border-tur-dark py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="font-inter text-xs font-bold uppercase tracking-wider text-tur-dark">
              MÉTRICAS DA PLATAFORMA · 2026
            </div>
            <div className="font-dm-sans text-xl sm:text-2xl font-bold text-tur-dark tracking-tight">
              TUR.COMMUNITY // ATIVA
            </div>
          </div>

          {/* Linhas de Métricas (Compactas com linhas divisórias) */}
          <div className="flex flex-col w-full">
            {stats.map((stat, idx) => (
              <div 
                key={idx} 
                className="py-3.5 border-b border-tur-dark flex items-center justify-between gap-4 w-full"
              >
                {/* Lado Esquerdo (Rótulo + Sub-código sutil) */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-inter text-xs sm:text-sm font-bold tracking-wider uppercase text-tur-dark">
                    {stat.label}
                  </span>
                  <span className="font-inter text-[11px] font-semibold text-tur-gray-600 uppercase tracking-widest">
                    ({stat.code})
                  </span>
                </div>

                {/* Lado Direito (Dado em tom #DF4927 / #111111) */}
                <span className="font-dm-sans text-3xl sm:text-4xl font-bold text-tur-accent tracking-tight">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
