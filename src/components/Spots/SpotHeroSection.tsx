import type { Spot } from '#/types/spot'
import { PageContainer } from '#/components/UI/PageContainer'
import { HeartOutlineIcon, HeartFilledIcon, EditIcon, TrashIcon } from '#/components/UI/Icons'

interface SpotHeroSectionProps {
  spot: Spot
  isFavorite: boolean
  isToggling: boolean
  isOwner: boolean
  onFavoriteClick: () => void
  onEditClick: () => void
  onDeleteClick: () => void
}

export function SpotHeroSection({
  spot,
  isFavorite,
  isToggling,
  isOwner,
  onFavoriteClick,
  onEditClick,
  onDeleteClick,
}: SpotHeroSectionProps) {
  return (
    <section className="bg-background py-16 md:py-24">
      <PageContainer className="flex flex-col items-center justify-center text-center">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-black/60 mb-6 md:mb-8">
          {spot.location}
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-[90px] font-light tracking-tight text-primary font-sans max-w-full leading-[1.1] line-clamp-2">
          {spot.name}
        </h1>
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={onFavoriteClick}
            disabled={isToggling}
            className="group flex items-center gap-3 text-lg font-normal text-black/80 hover:text-secondary transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isFavorite ? (
              <HeartFilledIcon className="w-6 h-6 text-secondary" />
            ) : (
              <HeartOutlineIcon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
            )}
            <span className="text-black group-hover:text-secondary transition-colors">Favoritar</span>
          </button>
          {isOwner && (
            <>
              <button
                onClick={onEditClick}
                className="group flex items-center gap-3 text-lg font-normal text-black/80 hover:text-secondary transition-colors cursor-pointer"
              >
                <EditIcon className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                <span className="text-black group-hover:text-secondary transition-colors">Editar</span>
              </button>
              <button
                onClick={onDeleteClick}
                className="group flex items-center gap-3 text-lg font-normal text-black/80 hover:text-secondary transition-colors cursor-pointer"
              >
                <TrashIcon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
                <span className="text-black group-hover:text-secondary transition-colors">Excluir</span>
              </button>
            </>
          )}
        </div>
      </PageContainer>
    </section>
  )
}
