import { useMemo } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSpot } from '#/hooks/api/useSpot'
import { toSpot } from '#/types/spot'
import type { HeroLocation } from '#/components/HeroCarousel/HeroCarousel'
import { HeroCarousel } from '#/components/HeroCarousel/HeroCarousel'
import { EditIcon } from '#/components/UI/Icons'

import { useComments } from '#/hooks/api/useComments'
import { useSpotFavoriteStatus } from '#/hooks/api/useFavorites'
import { useAuth } from '#/contexts/AuthContext'
import { useSpotDetailModals } from '#/hooks/useSpotDetailModals'

import { SpotHeroSection } from '#/components/Spots/SpotHeroSection'
import { SpotInfoBar } from '#/components/Spots/SpotInfoBar'
import { SpotCommentsSection } from '#/components/Spots/SpotCommentsSection'
import { EditSpotModal } from '#/components/Spots/EditSpotModal'
import { EditAddressModal } from '#/components/Spots/EditAddressModal'
import { UploadPhotosModal } from '#/components/Spots/UploadPhotosModal'
import { DeleteSpotModal } from '#/components/Spots/DeleteSpotModal'
import { ReviewModal } from '#/components/Spots/ReviewModal'

export const Route = createFileRoute('/pontos/$spotId')({
  component: SpotDetailPage,
})

function SpotDetailPage() {
  const { spotId } = Route.useParams()
  const { data: rawSpot, isLoading } = useSpot(spotId)
  const spot = useMemo(() => rawSpot ? toSpot(rawSpot) : null, [rawSpot])
  const { data: comments = [], isLoading: isLoadingComments } = useComments(spotId)

  const { user, openLogin } = useAuth()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite, isToggling } = useSpotFavoriteStatus(spotId, user?.id)

  const {
    isEditSpotOpen, setIsEditSpotOpen,
    isEditAddressOpen, setIsEditAddressOpen,
    isUploadPhotosOpen, setIsUploadPhotosOpen,
    isDeleteModalOpen, setIsDeleteModalOpen,
    isReviewModalOpen, setIsReviewModalOpen,
  } = useSpotDetailModals()

  const descriptionParagraphs = useMemo(() => {
    if (!spot) return []
    const text = spot.description ?? 'O local oferece uma experiência visual memorável e contato direto com a história e cultura da região.'
    return text.split('\n\n').map((p, idx) => <p key={idx}>{p}</p>)
  }, [spot?.description])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Carregando...</p>
      </div>
    )
  }

  if (!spot || !rawSpot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary pt-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Ponto não encontrado</h1>
          <p>O ponto turístico que você tentou acessar não existe.</p>
        </div>
      </div>
    )
  }

  const isOwner = Boolean(user?.id && spot.userId === user.id)

  const gallery: HeroLocation[] = spot.gallery && spot.gallery.length > 0
    ? spot.gallery.map((img, idx) => ({ id: idx, image: img }))
    : [{ id: 'default', image: spot.imageUrl || '' }]

  const handleFavoriteClick = () => {
    if (!user) { openLogin(); return }
    toggleFavorite()
  }

  return (
    <main className="min-h-screen bg-background text-primary">

      <SpotHeroSection
        spot={spot}
        isFavorite={isFavorite}
        isToggling={isToggling}
        isOwner={isOwner}
        onFavoriteClick={handleFavoriteClick}
        onEditClick={() => setIsEditSpotOpen(true)}
        onDeleteClick={() => setIsDeleteModalOpen(true)}
      />

      <div className="relative">
        <HeroCarousel locations={gallery} autoplay={false} />
        {isOwner && (
          <button
            onClick={() => setIsUploadPhotosOpen(true)}
            className="absolute top-4 right-4 md:top-8 md:right-8 z-[60] bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md hover:bg-white transition-colors cursor-pointer group"
            aria-label="Editar imagens"
          >
            <EditIcon className="w-5 h-5 text-primary group-hover:text-secondary transition-colors" />
          </button>
        )}
      </div>

      <SpotInfoBar spot={spot} />

      {/* About Section */}
      <section className="bg-background text-primary pt-24 md:pt-32 pb-12 px-8 md:px-16 lg:px-24 font-sans border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 relative">
          <div>
            <h2 className="text-base md:text-lg font-medium text-secondary m-0 leading-tight">
              Descrição
            </h2>
          </div>
          <div className="max-w-2xl flex flex-col gap-6 text-lg md:text-xl font-normal leading-relaxed text-balance text-black/90">
            {descriptionParagraphs}
          </div>
        </div>
      </section>

      <SpotCommentsSection
        spot={spot}
        comments={comments}
        isLoadingComments={isLoadingComments}
        onReviewClick={() => setIsReviewModalOpen(true)}
      />

      {/* Modals */}
      <UploadPhotosModal isOpen={isUploadPhotosOpen} onClose={() => setIsUploadPhotosOpen(false)} spot={spot} />
      <EditSpotModal isOpen={isEditSpotOpen} onClose={() => setIsEditSpotOpen(false)} spot={spot} />
      <EditAddressModal isOpen={isEditAddressOpen} onClose={() => setIsEditAddressOpen(false)} spot={spot} />
      <DeleteSpotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        spot={spot}
        onDeleted={() => { setIsDeleteModalOpen(false); navigate({ to: '/' }) }}
      />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} spotId={spot.id} spotName={spot.name} />
    </main>
  )
}
