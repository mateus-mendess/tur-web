import { useState, useMemo, useEffect } from 'react'
import type { TouristPointResponse } from '#/types/api'

export function useSpotFilters(
  spots: TouristPointResponse[],
  initialBusca: string,
  initialCategoria: string,
) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategoria)
  const [selectedRegion, setSelectedRegion] =
    useState<string>('Todas')
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>(initialBusca)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setSearchQuery(initialBusca)
    setSelectedCategory(initialCategoria)
  }, [initialBusca, initialCategoria])

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchCategory =
        selectedCategory === 'Todas' ||
        spot.categories.some((c) => c.name === selectedCategory)
      const matchRegion =
        selectedRegion === 'Todas' ||
        (selectedRegion === 'América do Sul') // Todos os nossos mocks são do Brasil
      const matchAccessibility =
        selectedAccessibility === 'Todas' ||
        spot.accessibilityTypes.some((a) => a.name === selectedAccessibility)
      const matchSearch =
        searchQuery.trim() === '' ||
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.city.toLowerCase().includes(searchQuery.toLowerCase())

      return matchCategory && matchRegion && matchAccessibility && matchSearch
    })
  }, [spots, selectedCategory, selectedRegion, selectedAccessibility, searchQuery])

  const handleResetFilters = () => {
    setSelectedCategory('Todas')
    setSelectedRegion('Todas')
    setSelectedAccessibility('Todas')
    setSearchQuery('')
  }

  const activeFilterNames = useMemo(() => {
    const names: string[] = []
    if (selectedCategory !== 'Todas') names.push(selectedCategory)
    if (selectedRegion !== 'Todas') names.push(selectedRegion)
    if (selectedAccessibility !== 'Todas') names.push(selectedAccessibility)
    if (searchQuery.trim() !== '') names.push(`"${searchQuery.trim()}"`)
    return names
  }, [selectedCategory, selectedRegion, selectedAccessibility, searchQuery])

  const isFilterActive =
    selectedCategory !== 'Todas' ||
    selectedRegion !== 'Todas' ||
    selectedAccessibility !== 'Todas' ||
    searchQuery !== ''

  return {
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
    activeFilterNames,
    isFilterActive,
  }
}
