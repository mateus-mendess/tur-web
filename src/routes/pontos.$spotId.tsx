import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useSpot } from '#/hooks/api/useSpot'
import { toSpot } from '#/types/spot'
import type { HeroLocation } from '#/components/HeroCarousel/HeroCarousel'
import { HeroCarousel } from '#/components/HeroCarousel/HeroCarousel'
import { ShareIcon } from '#/components/UI/Icons'
import { PageContainer } from '#/components/UI/PageContainer'

import { useComments } from '#/hooks/api/useComments'

import { useAuth } from '#/contexts/AuthContext'
import { useSpotDetailModals } from '#/components/Spots/useSpotDetailModals'
import { SpotEditMenu } from '#/components/Spots/SpotEditMenu'
import { EditSpotModal } from '#/components/Spots/EditSpotModal'
import { EditAddressModal } from '#/components/Spots/EditAddressModal'
import { UploadPhotosModal } from '#/components/Spots/UploadPhotosModal'
import { DeleteSpotModal } from '#/components/Spots/DeleteSpotModal'

export const Route = createFileRoute('/pontos/$spotId')({
  component: SpotDetailPage,
})

function SpotDetailPage() {
  const { spotId } = Route.useParams()
  const { data: rawSpot, isLoading } = useSpot(spotId)
  const spot = rawSpot ? toSpot(rawSpot) : null
  const { data: comments = [], isLoading: isLoadingComments } = useComments(spotId)
  
  const { user } = useAuth()
  const navigate = useNavigate()

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

  const isOwner = user?.id && spot.userId === user.id
  
  const gallery: HeroLocation[] = (spot.gallery && spot.gallery.length > 0)
    ? spot.gallery.map((img, idx) => ({
        id: idx,
        image: img,
      }))
    : [{
        id: 'default',
        image: spot.imageUrl || 'https://placehold.co/1200x800/eeeeee/999999?text=Sem+Foto',
      }]

  const renderDescription = () => {
    const paragraphs = spot.description 
      ? spot.description.split('\n\n')
      : ['O local oferece uma experiência visual memorável e contato direto com a história e cultura da região.']

    return paragraphs.map((p, idx) => <p key={idx}>{p}</p>)
  }

  return (
    <main className="min-h-screen bg-background text-primary">
      
      {/* Bloco de Título */}
      <section className="bg-background py-16 md:py-24 flex flex-col items-center justify-center text-center px-6">
        <span className="text-[10px] md:text-xs font-semibold uppercase tracking-widest text-black/60 mb-6 md:mb-8">
          {spot.location}
        </span>
        <h1 className="text-[80px] md:text-[130px] font-light tracking-tight text-primary font-sans max-w-6xl leading-[1.1]">
          {spot.name}
        </h1>
        <button className="mt-10 flex items-center gap-2 text-sm font-normal text-black/80 hover:text-black transition-colors">
          <ShareIcon className="w-4 h-4" />
          Compartilhar
        </button>
      </section>

      <HeroCarousel locations={gallery} autoplay={false} />

      {/* Info Block (5 Columns) */}
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
              <span className="text-secondary">★</span> {spot.rating ? spot.rating.toFixed(1) : '4.8'}
            </p>
          </div>

          {/* Categoria */}
          <div className="px-4 flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-black/60">Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {(spot.tags?.length ? spot.tags : [spot.category || 'Turismo']).map((cat, idx) => (
                <span key={idx} className="text-sm font-normal text-black/90">
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
                {spot.accessibility.map((acc, idx) => (
                  <span key={idx} className="text-sm font-normal text-black/90 flex items-center gap-1">
                    <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
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

      {/* About Section Layout */}
      <section className="bg-background text-primary pt-24 md:pt-32 pb-12 px-8 md:px-16 lg:px-24 font-sans border-b border-black/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 md:gap-24 relative">
          <div>
            <h2 className="text-base md:text-lg font-medium text-secondary m-0 leading-tight">
              Descrição
            </h2>
            {isOwner && (
              <div className="mt-4">
                <SpotEditMenu
                  onEditPhotos={() => setIsUploadPhotosOpen(true)}
                  onEditInfo={() => setIsEditSpotOpen(true)}
                  onEditAddress={() => setIsEditAddressOpen(true)}
                  onDelete={() => setIsDeleteModalOpen(true)}
                />
              </div>
            )}
          </div>
          <div className="max-w-2xl flex flex-col gap-6 text-lg md:text-xl font-normal leading-relaxed text-balance text-black/90">
            {renderDescription()}
          </div>
        </div>
      </section>

      {/* Comments List & Location Block */}
      <section className="bg-background text-primary py-16 font-sans border-t border-black/10">
        <PageContainer className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:h-[700px]">
          
          {/* Left Column: Comments List */}
          <div className="lg:w-1/2 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6 shrink-0 pr-4">
              <h2 className="text-3xl font-normal">Comentários</h2>
              <button
                type="button"
                className="border border-primary text-primary px-6 py-2 rounded-sm font-normal text-sm hover:bg-primary hover:text-surface transition-colors duration-200 cursor-pointer"
              >
                Avaliar
              </button>
            </div>
            
            <div className="flex flex-col border-t border-black/10 overflow-y-auto pr-4 flex-1 scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
              {comments.map((review, idx) => (
                <div key={idx} className="py-8 border-b border-black/10 flex gap-4">
                  <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/40 shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-base">{review.authorName}</p>
                      <div className="text-secondary text-sm tracking-widest">
                        {'★'.repeat(Math.round(review.note))}{'☆'.repeat(5 - Math.round(review.note))}
                      </div>
                    </div>
                    <p className="text-black/80 text-sm leading-relaxed line-clamp-3 relative group">
                      {review.content}
                      {review.content.length > 150 && (
                        <button className="text-primary font-bold mt-1 text-xs hover:underline block">Ver mais</button>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && !isLoadingComments && (
                <div className="py-12 text-center text-black/60">
                  Ainda não há avaliações para este ponto turístico.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Map Placeholder */}
          <div className="lg:w-1/2 min-h-[400px] lg:min-h-0 lg:h-full bg-black/5 relative overflow-hidden group shrink-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]" />
          </div>
        </PageContainer>
      </section>

      {/* Sub-modals for editing */}
      <UploadPhotosModal
        isOpen={isUploadPhotosOpen}
        onClose={() => setIsUploadPhotosOpen(false)}
        spot={spot}
      />
      <EditSpotModal
        isOpen={isEditSpotOpen}
        onClose={() => setIsEditSpotOpen(false)}
        spot={spot}
      />
      <EditAddressModal
        isOpen={isEditAddressOpen}
        onClose={() => setIsEditAddressOpen(false)}
        rawSpot={rawSpot}
      />
      <DeleteSpotModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        spot={spot}
        onDeleted={() => {
          setIsDeleteModalOpen(false)
          navigate({ to: '/' })
        }}
      />
    </main>
  )
}
