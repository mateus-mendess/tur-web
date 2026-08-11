import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { z } from 'zod'
import type { TouristPointResponse } from '#/types/api'
import { toSpot } from '#/types/spot'
import { useSpots } from '#/hooks/api/useSpots'
import { useCategories } from '#/hooks/api/useCategories'
import { useAccessibilityTypes } from '#/hooks/api/useAccessibilityTypes'
import { SpotCard } from '#/components/Spots/SpotCard'
import { SpotDetailModal } from '#/components/Spots/SpotDetailModal'
import { Header } from '#/components/Header/Header'
import { SpotFilterBar } from '#/components/Spots/SpotFilterBar'
import { useSpotFilters } from '#/hooks/useSpotFilters'
import { SpotCardSkeleton } from '#/components/UI/Skeleton'

// Parâmetros de busca aceitos pela URL — permite compartilhar filtros via link
const explorarSearchSchema = z.object({
  busca: z.string().optional().default(''),
  categoria: z.string().optional().default('Todas'),
})

export const Route = createFileRoute('/explorar')({
  validateSearch: explorarSearchSchema,
  component: ExplorarPage,
  head: () => ({
    meta: [{ title: 'Explorar Destinos | Tur.' }],
  }),
})

function ExplorarPage() {
  const { busca: initialBusca, categoria: initialCategoria } = Route.useSearch()

  const { data: spots = [], isLoading, isError, refetch } = useSpots()
  const { data: categoriesData = [] } = useCategories()
  const { data: accessibilityTypes = [] } = useAccessibilityTypes()
  const categoriesList = categoriesData.map((c) => c.name)
  const accessibilityList = accessibilityTypes.map((a) => a.name)
  const [selectedSpot, setSelectedSpot] = useState<TouristPointResponse | null>(
    null,
  )

  const {
    selectedCategory,
    setSelectedCategory,
    selectedAccessibility,
    setSelectedAccessibility,
    searchQuery,
    setSearchQuery,
    filteredSpots,
    handleResetFilters,
    activeFilterNames,
    isFilterActive,
  } = useSpotFilters(spots, initialBusca, initialCategoria)

  return (
    <div className="min-h-screen bg-tur-bg pb-20 px-6 md:px-12 py-6">
      <Header theme="light" />

      <div className="pt-12 md:pt-16">
        {/* Search Bar */}
        <div className="mb-8 md:mb-12">
          <div className="w-full">
            <input
              type="text"
              placeholder="Procurar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-black text-3xl md:text-5xl lg:text-6xl font-dm-sans font-bold text-tur-dark placeholder:text-tur-dark/30 outline-none pb-3 md:pb-5 pl-0 rounded-none focus:border-black transition-colors"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <SpotFilterBar
          categoriesList={categoriesList}
          accessibilityList={accessibilityList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedAccessibility={selectedAccessibility}
          setSelectedAccessibility={setSelectedAccessibility}
          isFilterActive={isFilterActive}
          activeFilterNames={activeFilterNames}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleResetFilters={handleResetFilters}
        />

        {/* Gallery Grid */}
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-dm-sans text-3xl md:text-4xl font-bold text-tur-dark m-0">
            Destinos
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-3 lg:gap-x-4 gap-y-10 md:gap-y-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <SpotCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <h3 className="font-dm-sans text-2xl font-bold text-tur-dark mb-2">
              Não conseguimos carregar os destinos
            </h3>
            <p className="font-inter text-tur-gray-600 max-w-md mx-auto mb-6">
              Verifique sua conexão e tente novamente.
            </p>
            <button
              onClick={() => void refetch()}
              className="font-inter font-semibold px-6 py-3 bg-tur-dark text-white rounded-none hover:bg-tur-dark-hover transition-colors cursor-pointer border-none"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !isError && (
          <>
            {filteredSpots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-3 lg:gap-x-4 gap-y-10 md:gap-y-12">
                {filteredSpots.map((spot) => (
                  <SpotCard
                    key={spot.id}
                    spot={toSpot(spot)}
                    onClick={() => setSelectedSpot(spot)}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full py-20 flex flex-col items-center justify-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-tur-gray-400 mb-4"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <h3 className="font-dm-sans text-2xl font-bold text-tur-dark mb-2">
                  Nenhum destino encontrado
                </h3>
                <p className="font-inter text-tur-gray-600 max-w-md mx-auto">
                  Não encontramos destinos que correspondam aos filtros
                  selecionados. Tente ajustar suas preferências.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 font-inter font-semibold px-6 py-3 bg-tur-dark text-white rounded-none hover:bg-tur-dark-hover transition-colors cursor-pointer border-none"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <SpotDetailModal
        spot={selectedSpot ? toSpot(selectedSpot) : null}
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
      />
    </div>
  )
}
