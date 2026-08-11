import { useState, useMemo, useEffect } from 'react'
import type { TouristPointResponse } from '#/types/api'

export function useSpotFilters(
  spots: TouristPointResponse[],
  initialBusca: string,
  initialCategoria: string,
) {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategoria)
  const [selectedAccessibility, setSelectedAccessibility] =
    useState<string>('Todas')
  const [searchQuery, setSearchQuery] = useState<string>(initialBusca)

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

  return {
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
  }
}
