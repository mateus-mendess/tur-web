
import * as Dialog from '@radix-ui/react-dialog'
import type { Spot } from '#/types/spot'
import {
  BookmarkIcon,
  ShareIcon,
  CloseIcon,
} from '#/components/UI/Icons'
import { useAuth } from '#/contexts/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import type { TouristPointResponse } from '#/types/api'
import { toSpot } from '#/types/spot'
import { EditSpotModal } from './EditSpotModal'
import { EditAddressModal } from './EditAddressModal'
import { UploadPhotosModal } from './UploadPhotosModal'
import { DeleteSpotModal } from './DeleteSpotModal'
import { useSpotDetailModals } from './useSpotDetailModals'
import { SpotReviewsList } from './SpotReviewsList'
import { SpotEditMenu } from './SpotEditMenu'
import { SpotImageGallery } from './SpotImageGallery'
import { SpotInfoSection } from './SpotInfoSection'

const PLACEHOLDER_IMAGE =
  'https://placehold.co/600x400/eeeeee/999999?text=Sem+Foto'

interface SpotDetailModalProps {
  spot: Spot | null
  isOpen: boolean
  onClose: () => void
}

export function SpotDetailModal({
  spot,
  isOpen,
  onClose,
}: SpotDetailModalProps) {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    isEditSpotOpen,
    setIsEditSpotOpen,
    isEditAddressOpen,
    setIsEditAddressOpen,
    isUploadPhotosOpen,
    setIsUploadPhotosOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  } = useSpotDetailModals()

  if (!spot) return null

  // Reflete a mudança otimista usando o cache atualizado
  const spots = queryClient.getQueryData<TouristPointResponse[]>(['spots'])
  const rawSpot = spots?.find((s) => s.id === spot.id)
  const currentSpot = rawSpot ? toSpot(rawSpot) : spot

  const isOwner = user?.id && currentSpot.userId === user.id

  const images =
    currentSpot.gallery && currentSpot.gallery.length > 0
      ? currentSpot.gallery
      : [currentSpot.imageUrl || PLACEHOLDER_IMAGE]

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay container */}
        <div className="fixed inset-0 z-[1000] flex flex-col justify-end pointer-events-none">
          {/* Darkened Blur Backdrop */}
          <Dialog.Overlay className="absolute inset-0 bg-black/65 backdrop-blur-sm data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out transition-opacity pointer-events-auto" />

          {/* Sheet Container */}
          <Dialog.Content
            aria-describedby={undefined}
            className="pointer-events-auto relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] mt-14 md:mt-16 bg-tur-bg text-tur-dark overflow-y-auto flex flex-col font-inter border-t border-tur-dark data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom duration-300 rounded-none z-10 outline-none"
            onCloseAutoFocus={(e) => {
              e.preventDefault()
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur()
              }
            }}
          >
            <Dialog.Title className="sr-only">{currentSpot.name}</Dialog.Title>

            {/* 1. TOP BAR */}
            <header className="sticky top-0 z-40 w-full bg-tur-bg/95 backdrop-blur-md border-b border-tur-dark/15 px-6 md:px-12 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-dm-sans font-bold text-base text-tur-dark uppercase tracking-wider">
                    {currentSpot.name}
                  </span>
                  <span className="font-inter text-xs text-tur-gray-700">
                    por{' '}
                    <strong className="text-tur-dark font-semibold">
                      {currentSpot.author.name}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2.5 rounded-none bg-transparent text-tur-dark hover:bg-tur-dark hover:text-white transition-colors cursor-pointer"
                  title="Salvar Ponto"
                >
                  <BookmarkIcon className="w-5 h-5" />
                </button>
                <button
                  className="p-2.5 rounded-none bg-transparent text-tur-dark hover:bg-tur-dark hover:text-white transition-colors cursor-pointer"
                  title="Compartilhar"
                >
                  <ShareIcon className="w-5 h-5" />
                </button>
                <Dialog.Close asChild>
                  <button
                    className="p-2.5 rounded-none border border-tur-dark bg-tur-dark text-white hover:bg-tur-accent transition-colors cursor-pointer ml-1"
                    title="Fechar Modal"
                    aria-label="Fechar"
                  >
                    <CloseIcon className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </Dialog.Close>
              </div>
            </header>

            {/* Floating Score Badge */}
            <div className="absolute left-6 md:left-12 top-[88px] border border-tur-dark p-2 w-16 sm:w-20 text-center flex flex-col items-center justify-center rounded-none bg-tur-bg z-10 pointer-events-none">
              <span className="font-inter text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider text-tur-accent">
                NOTA
              </span>
              <span className="font-dm-sans text-xl sm:text-2xl font-extrabold text-tur-dark leading-none my-0.5">
                {currentSpot.rating || '4.8'}
              </span>
              <span className="font-inter text-[8px] sm:text-[9px] text-tur-dark/60 font-semibold">
                / 5.0
              </span>
            </div>

            {/* 2. MAIN CONTENT AREA */}
            <main className="flex-1 w-full px-6 md:px-12 pt-8 pb-16 space-y-12">
              <section className="relative pt-4 pb-2">
                <div className="text-center mb-6">
                  <span className="font-inter text-xs font-extrabold uppercase tracking-[2px] text-tur-dark/60">
                    PUBLICADO -{' '}
                    {currentSpot.publishedAt
                      ? currentSpot.publishedAt
                          .replace(/\bDE\b/gi, ',')
                          .replace(/\s+/g, ' ')
                          .toUpperCase()
                      : 'OUTUBRO, 2023'}
                  </span>
                </div>
                <div className="text-center my-6 md:my-10 relative">
                  <div className="flex items-center justify-center gap-4">
                    <h1 className="font-dm-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-tur-dark leading-[0.95]">
                      {currentSpot.name}
                    </h1>
                    {isOwner && (
                      <SpotEditMenu
                        onEditPhotos={() => setIsUploadPhotosOpen(true)}
                        onEditInfo={() => setIsEditSpotOpen(true)}
                        onEditAddress={() => setIsEditAddressOpen(true)}
                        onDelete={() => setIsDeleteModalOpen(true)}
                      />
                    )}
                  </div>
                  <p className="font-inter text-sm sm:text-base md:text-lg font-medium text-tur-gray-700 mt-4 max-w-2xl mx-auto">
                    {currentSpot.location}
                  </p>
                </div>
              </section>

              <SpotImageGallery images={images} name={currentSpot.name} />

              <SpotInfoSection spot={currentSpot} />

              <SpotReviewsList currentSpot={currentSpot} isOpen={isOpen} />
            </main>
          </Dialog.Content>
        </div>
      </Dialog.Portal>

      {/* Sub-modals for editing */}
      <UploadPhotosModal
        isOpen={isUploadPhotosOpen}
        onClose={() => setIsUploadPhotosOpen(false)}
        spot={currentSpot}
      />
      <EditSpotModal
        isOpen={isEditSpotOpen}
        onClose={() => setIsEditSpotOpen(false)}
        spot={currentSpot}
      />
      {rawSpot && (
        <EditAddressModal
          isOpen={isEditAddressOpen}
          onClose={() => setIsEditAddressOpen(false)}
          rawSpot={rawSpot}
        />
      )}
      <DeleteSpotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        spot={currentSpot}
        onDeleted={() => {
          setIsDeleteModalOpen(false)
          onClose()
        }}
      />
    </Dialog.Root>
  )
}
