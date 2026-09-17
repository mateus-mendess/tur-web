import type { Spot } from '#/types/spot'

interface SpotInfoBarProps {
  spot: Spot
}

export function SpotInfoBar({ spot }: SpotInfoBarProps) {
  const categories = spot.tags?.length ? spot.tags : [spot.category || 'Turismo']
  const ratingDisplay = spot.rating ? spot.rating.toFixed(1) : '–'

  return (
    <section className="bg-background text-primary border-b border-black/10 px-8 md:px-16 lg:px-24 py-8 md:py-12 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-black/10 gap-y-8">

        {/* Localização */}
        <div className="px-4 first:pl-0 flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Localização</h3>
          <p className="text-sm font-normal text-black/90 leading-relaxed">
            {spot.address || spot.location}
          </p>
        </div>

        {/* Nota média */}
        <div className="px-4 flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Nota Média</h3>
          <p className="text-xl font-medium text-black/90">
            <span className="text-secondary">★</span> {ratingDisplay}
          </p>
        </div>

        {/* Categoria */}
        <div className="px-4 flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Categoria</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="font-sans text-sm bg-surface border border-black/10 text-primary px-3 py-1 rounded-sm shadow-sm flex items-center gap-2 w-fit"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                {cat.replace(/^#/, '')}
              </span>
            ))}
          </div>
        </div>

        {/* Acessibilidade */}
        <div className="px-4 flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Acessibilidade</h3>
          {spot.accessibility && spot.accessibility.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {spot.accessibility.map((acc) => (
                <span key={acc} className="text-sm font-normal text-black/90 flex items-center gap-1">
                  <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  {acc}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm font-normal text-black/60">Não informada</p>
          )}
        </div>

        {/* Autor */}
        <div className="px-4 last:pr-0 flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Cadastrado por</h3>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold text-xs">
              {spot.author.name.charAt(0) || 'A'}
            </div>
            <p className="text-sm font-normal text-black/90">{spot.author.name || 'Anônimo'}</p>
          </div>
        </div>

      </div>
    </section>
  )
}
