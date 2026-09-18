import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useEffect } from 'react'
import { z } from 'zod'
import { useUserSpots } from '#/hooks/api/useUserSpots'
import { useCategories } from '#/hooks/api/useCategories'
import { useAccessibilityTypes } from '#/hooks/api/useAccessibilityTypes'

import { SpotCard } from '#/components/Spots/SpotCard'
import { SpotFilterBar } from '#/components/Spots/SpotFilterBar'
import { useSpotFilters } from '#/hooks/useSpotFilters'
import { SpotCardSkeleton } from '#/components/UI/Skeleton'
import { PageContainer } from '#/components/UI/PageContainer'
import { toSpot } from '#/types/spot'
import { useAuth } from '#/contexts/AuthContext'

const searchSchema = z.object({
  busca: z.string().optional().default(''),
  categoria: z.string().optional().default('Todas'),
  regiao: z.string().optional().default('Todas'),
  acessibilidade: z.string().optional().default('Todas'),
})

export const Route = createFileRoute('/meus-pontos')({
  validateSearch: searchSchema,
  component: MeusPontosPage,
  head: () => ({
    meta: [{ title: 'Meus Pontos | Tur.' }],
  }),
})

function MeusPontosPage() {
  const { busca: initialBusca, categoria: initialCategoria, regiao: initialRegiao } = Route.useSearch()

  const { user, openLogin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      openLogin()
      navigate({ to: '/' })
    }
  }, [user, openLogin, navigate])

  const { data: spots = [], isLoading, isError } = useUserSpots(user?.id)
  const { data: categoriesData = [] } = useCategories()
  const { data: accessibilityTypes = [] } = useAccessibilityTypes()

  const categoriesList = useMemo(() => categoriesData.map((c) => c.name), [categoriesData])
  const accessibilityList = useMemo(() => accessibilityTypes.map((a) => a.name), [accessibilityTypes])
  const regionsList = ['África', 'América Central', 'América do Norte', 'América do Sul', 'Ásia', 'Europa', 'Oceania']

  const {
    selectedCategory, setSelectedCategory,
    selectedRegion, setSelectedRegion,
    selectedAccessibility, setSelectedAccessibility,
    searchQuery, setSearchQuery,
    viewMode, setViewMode,
    filteredSpots,
    handleResetFilters,
    isFilterActive,
  } = useSpotFilters(spots, initialBusca, initialCategoria, initialRegiao)

  const mappedSpots = useMemo(() => filteredSpots.map(toSpot), [filteredSpots])

  if (!user) return null

  return (
    <main className="min-h-screen bg-tur-bg pb-20 pt-6 md:pt-10">
      <PageContainer className="pt-12 md:pt-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight text-primary m-0">Pontos Cadastrados</h1>
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

        <div className="mb-6 mt-8 flex items-end justify-between">
          <h2 className="font-sans text-sm md:text-base font-normal text-primary m-0">
            Exibindo {filteredSpots.length} resultados
          </h2>
        </div>

        {isLoading && (
          <div className="grid grid-cols-3 gap-x-[2rem] gap-y-[9.5rem] max-md:grid-cols-1 max-md:gap-y-[4rem]">
            {Array.from({ length: 6 }).map((_, i) => (
              <SpotCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-medium text-primary mb-2">Ops! Algo deu errado.</p>
            <p className="text-sm text-black/60">Não foi possível carregar os seus pontos.</p>
          </div>
        )}

        {!isLoading && !isError && filteredSpots.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <p className="text-xl font-medium text-primary mb-2">Nenhum ponto encontrado.</p>
            <p className="text-sm text-black/60">
              {isFilterActive ? 'Tente ajustar os filtros de busca.' : 'Você ainda não cadastrou nenhum ponto turístico.'}
            </p>
            {isFilterActive && (
              <button
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-black/80 transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && mappedSpots.length > 0 && (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-3 gap-x-[2rem] gap-y-[9.5rem] max-md:grid-cols-1 max-md:gap-y-[4rem]'
            : 'flex flex-col gap-6 max-w-4xl mx-auto'
          }>
            {mappedSpots.map((spot) => (
              <SpotCard
                key={spot.id} 
                spot={spot} 
                onClick={() => navigate({ to: '/pontos/$spotId', params: { spotId: spot.id } })}
              />
            ))}
          </div>
        )}
      </PageContainer>
    </main>
  )
}
