import { createFileRoute } from '@tanstack/react-router'
import { useState, useMemo, useEffect } from 'react'
import { z } from 'zod'
import type { TouristPointResponse } from '#/types/api'
import { toSpot } from '#/types/spot'
import { useSpots } from '#/hooks/api/useSpots'
import { useCategories } from '#/hooks/api/useCategories'
import { useAccessibilityTypes } from '#/hooks/api/useAccessibilityTypes'
import { SpotCard } from '#/components/Spots/SpotCard'
import { SpotDetailModal } from '#/components/Spots/SpotDetailModal'
import { Header } from '#/components/Header/Header'
import { SearchableDropdown } from '#/components/UI/SearchableDropdown'
import { SpotCardSkeleton } from '#/components/UI/Skeleton'
import { useDropdown } from '#/hooks/useDropdown'

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

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategoria)
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>(initialBusca)

  const categoriesList = categoriesData.map((c) => c.name)
  const accessibilityList = accessibilityTypes.map((a) => a.name)
  const categoryMenu = useDropdown()
  const accessMenu = useDropdown()
  const activeFiltersMenu = useDropdown()
  const [selectedSpot, setSelectedSpot] = useState<TouristPointResponse | null>(null)

  const handleCategoryToggle = () => {
    categoryMenu.toggle()
    accessMenu.close()
    activeFiltersMenu.close()
  }

  const handleAccessToggle = () => {
    accessMenu.toggle()
    categoryMenu.close()
    activeFiltersMenu.close()
  }

  const handleActiveFiltersToggle = () => {
    activeFiltersMenu.toggle()
    categoryMenu.close()
    accessMenu.close()
  }

  // Sincroniza estado local com os search params da URL
  // (ex: ao navegar a partir do SearchOverlay)
  useEffect(() => {
    setSearchQuery(initialBusca)
    setSelectedCategory(initialCategoria)
  }, [initialBusca, initialCategoria])

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchCategory =
        selectedCategory === 'Todas' ||
        spot.categories.some((c) => c.name === selectedCategory)
      const matchAccessibility =
        selectedAccessibility === 'Todas' ||
        spot.accessibilityTypes.some((a) => a.name === selectedAccessibility)
      const matchSearch =
        searchQuery.trim() === '' ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.city.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchAccessibility && matchSearch
    })
  }, [spots, selectedCategory, selectedAccessibility, searchQuery])

  const handleResetFilters = () => {
    setSelectedCategory('Todas')
    setSelectedAccessibility('Todas')
    setSearchQuery('')
  }

  const activeFilterNames = useMemo(() => {
    const names: string[] = []
    if (selectedCategory !== 'Todas') names.push(selectedCategory)
    if (selectedAccessibility !== 'Todas') names.push(selectedAccessibility)
    if (searchQuery.trim() !== '') names.push(`"${searchQuery.trim()}"`)
    return names
  }, [selectedCategory, selectedAccessibility, searchQuery])

  const isFilterActive =
    selectedCategory !== 'Todas' ||
    selectedAccessibility !== 'Todas' ||
    searchQuery !== ''

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
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-12 w-full">
          {/* Left Side: Category and Accessibility Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter Custom Popover */}
            <SearchableDropdown
              options={categoriesList}
              selectedValues={
                selectedCategory !== 'Todas' ? [selectedCategory] : []
              }
              onSelect={(cat) => {
                setSelectedCategory(selectedCategory === cat ? 'Todas' : cat)
                categoryMenu.close()
              }}
              isOpen={categoryMenu.isOpen}
              onToggle={handleCategoryToggle}
              onClose={categoryMenu.close}
              placeholder="Buscar categoria..."
              triggerContent={<span>Categoria</span>}
              triggerClassName="font-inter text-sm px-3.5 py-2 rounded-none border border-black bg-transparent text-tur-dark hover:bg-black/5 font-medium cursor-pointer transition-all flex items-center gap-2"
              emptyMessage="Nenhuma categoria encontrada"
              variant="default"
              popoverWidthClass="w-72"
            />

            {/* Accessibility Filter Custom Popover */}
            <SearchableDropdown
              options={accessibilityList}
              selectedValues={
                selectedAccessibility !== 'Todas' ? [selectedAccessibility] : []
              }
              onSelect={(opt) => {
                setSelectedAccessibility(
                  selectedAccessibility === opt ? 'Todas' : opt,
                )
                accessMenu.close()
              }}
              isOpen={accessMenu.isOpen}
              onToggle={handleAccessToggle}
              onClose={accessMenu.close}
              placeholder="Buscar acessibilidade..."
              triggerContent={<span>Acessibilidade</span>}
              triggerClassName="font-inter text-sm px-3.5 py-2 rounded-none border border-black bg-transparent text-tur-dark hover:bg-black/5 font-medium cursor-pointer transition-all flex items-center gap-2"
              emptyMessage="Nenhuma opção encontrada"
              variant="default"
              popoverWidthClass="w-72"
            />
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            {/* Active Filters Custom Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={handleActiveFiltersToggle}
                className={`font-inter text-sm font-semibold px-4 py-2.5 rounded-none border border-black transition-all flex items-center gap-2 outline-none cursor-pointer ${
                  isFilterActive
                    ? 'bg-tur-accent text-white'
                    : 'bg-transparent text-tur-dark/60 hover:bg-black/5'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <span>Filtros ativos ({activeFilterNames.length})</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 shrink-0 ${activeFiltersMenu.isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Backdrop */}
              {activeFiltersMenu.isOpen && (
                <div
                  className="fixed inset-0 z-20"
                  onClick={activeFiltersMenu.close}
                />
              )}

              {/* Active Filters Dropdown Menu Box */}
              <div
                className={`absolute right-0 top-full mt-2 w-72 bg-white border border-black shadow-2xl z-30 p-3 flex flex-col gap-2 rounded-none transition-all duration-200 ease-out transform origin-top-right ${
                  activeFiltersMenu.isOpen
                    ? 'opacity-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="font-inter text-xs font-bold text-tur-gray-700 uppercase tracking-widest pb-1.5 border-b border-black/10 flex items-center justify-between">
                  <span>Filtros Aplicados</span>
                  <span className="text-[10px] font-semibold text-tur-gray-500">
                    {activeFilterNames.length} ativo(s)
                  </span>
                </div>

                {isFilterActive ? (
                  <div className="flex flex-col gap-2 py-1">
                    {selectedCategory !== 'Todas' && (
                      <div className="flex items-center justify-between font-inter text-xs bg-transparent text-tur-dark p-2 border border-black/15 rounded-none hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-tur-accent shrink-0" />
                          <span className="font-semibold text-tur-dark">
                            {selectedCategory}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory('Todas')}
                          className="text-tur-dark font-bold hover:text-tur-accent text-base px-1 leading-none cursor-pointer border-none bg-transparent transition-colors"
                          title="Remover filtro de categoria"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {selectedAccessibility !== 'Todas' && (
                      <div className="flex items-center justify-between font-inter text-xs bg-transparent text-tur-dark p-2 border border-black/15 rounded-none hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-tur-accent shrink-0" />
                          <span className="font-semibold text-tur-dark">
                            {selectedAccessibility}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedAccessibility('Todas')}
                          className="text-tur-dark font-bold hover:text-tur-accent text-base px-1 leading-none cursor-pointer border-none bg-transparent transition-colors"
                          title="Remover filtro de acessibilidade"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {searchQuery.trim() !== '' && (
                      <div className="flex items-center justify-between font-inter text-xs bg-transparent text-tur-dark p-2 border border-black/15 rounded-none hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-tur-accent shrink-0" />
                          <span className="font-semibold text-tur-dark">
                            "{searchQuery}"
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="text-tur-dark font-bold hover:text-tur-accent text-base px-1 leading-none cursor-pointer border-none bg-transparent transition-colors"
                          title="Remover termo de busca"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="font-inter text-xs text-tur-gray-500 py-3 text-center">
                    Nenhum filtro ativo no momento.
                  </div>
                )}
              </div>
            </div>

            {/* Reset Filters Button */}
            <button
              type="button"
              onClick={handleResetFilters}
              disabled={!isFilterActive}
              className={`font-inter text-sm font-semibold px-4 py-2.5 rounded-none border transition-all flex items-center gap-2 ${
                isFilterActive
                  ? 'border-black bg-transparent text-tur-dark hover:bg-black hover:text-white cursor-pointer'
                  : 'border-black/20 bg-transparent text-tur-dark/40 cursor-not-allowed opacity-50'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <span>Resetar filtros</span>
            </button>
          </div>
        </div>

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
