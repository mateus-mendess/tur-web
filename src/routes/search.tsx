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
import { SpotFilterBar } from '#/components/Spots/SpotFilterBar'
import { useSpotFilters } from '#/hooks/useSpotFilters'
import { SpotCardSkeleton } from '#/components/UI/Skeleton'
import { PageContainer } from '#/components/UI/PageContainer'

const searchSchema = z.object({
  busca: z.string().optional().default(''),
  categoria: z.string().optional().default('Todas'),
  regiao: z.string().optional().default('Todas'),
  acessibilidade: z.string().optional().default('Todas'),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
  head: () => ({
    meta: [{ title: 'Buscar Destinos | Tur.' }],
  }),
})

function SearchPage() {
  const { busca: initialBusca, categoria: initialCategoria } = Route.useSearch()

  const { data: spots = [], isLoading, isError, refetch } = useSpots()
  const { data: categoriesData = [] } = useCategories()
  const { data: accessibilityTypes = [] } = useAccessibilityTypes()
  const categoriesList = categoriesData.map((c) => c.name)
  const accessibilityList = accessibilityTypes.map((a) => a.name)
  const regionsList = ['África', 'América Central', 'América do Norte', 'América do Sul', 'Ásia', 'Europa', 'Oceania']
  const [selectedSpot, setSelectedSpot] = useState<TouristPointResponse | null>(
    null,
  )

  const {
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    setSelectedRegion,
    selectedAccessibility,
    setSelectedAccessibility,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filteredSpots,
    handleResetFilters,
    isFilterActive,
  } = useSpotFilters(spots, initialBusca, initialCategoria)

  return (
    <main className="min-h-screen bg-tur-bg pb-20 pt-6 md:pt-10">
      <PageContainer className="pt-12 md:pt-16">
        {/* Header Line */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-primary m-0">Buscar</h1>
        </div>

        <SpotFilterBar
          categoriesList={categoriesList}
          regionsList={regionsList}
          accessibilityList={accessibilityList}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedAccessibility={selectedAccessibility}
          setSelectedAccessibility={setSelectedAccessibility}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isFilterActive={isFilterActive}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleResetFilters={handleResetFilters}
        />

        {/* Gallery Grid */}
        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="font-sans text-sm md:text-base font-normal text-primary m-0">
            Exibindo {filteredSpots.length} resultados
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
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-3 lg:gap-x-4 gap-y-10 md:gap-y-12" : "flex flex-col gap-6"}>
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
      </PageContainer>

      <SpotDetailModal
        spot={selectedSpot ? toSpot(selectedSpot) : null}
        isOpen={!!selectedSpot}
        onClose={() => setSelectedSpot(null)}
      />
    </main>
  )
}
