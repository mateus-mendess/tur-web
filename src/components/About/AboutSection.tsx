export function AboutSection() {
  return (
    <section className="bg-background text-primary py-24 md:py-40 px-8 md:px-16 lg:px-24 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
        {/* Left Column: Label */}
        <div>
          <h2 className="text-base md:text-lg font-medium opacity-60 m-0 leading-tight">
            Sobre
          </h2>
        </div>

        {/* Right Column: Text */}
        <div className="max-w-2xl flex flex-col gap-6 text-lg md:text-xl font-normal leading-relaxed text-balance">
          <p>
            Muitas cidades possuem uma vasta riqueza cultural e histórica que, infelizmente, acaba
            passando despercebida em meio aos roteiros turísticos tradicionais. O tur. nasceu para
            transformar essa realidade, atuando como uma ponte entre você e o patrimônio cultural
            do Brasil, começando pela vibrante cidade de Maceió.
          </p>
          <p>
            Nossa plataforma interativa foi criada para ir além do óbvio. Queremos dar visibilidade
            a museus, teatros, igrejas e centros culturais que guardam a identidade local, permitindo
            que moradores e visitantes explorem novos horizontes. Com mapas integrados, geolocalização,
            galerias de fotos e detalhes precisos sobre rotas e horários de funcionamento, o tur. oferece
            tudo o que você precisa para vivenciar uma experiência turística mais rica, descentralizada
            e imersiva.
          </p>
        </div>
      </div>
    </section>
  )
}
