import { SearchableDropdown } from '#/components/UI/SearchableDropdown'
import { useDropdown } from '#/hooks/useDropdown'

interface SpotFilterBarProps {
  categoriesList: string[]
  regionsList: string[]
  accessibilityList: string[]
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
  selectedRegion: string
  setSelectedRegion: (opt: string) => void
  selectedAccessibility: string
  setSelectedAccessibility: (opt: string) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
  isFilterActive: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  handleResetFilters: () => void
}

export function SpotFilterBar({
  categoriesList,
  regionsList,
  accessibilityList,
  selectedCategory,
  setSelectedCategory,
  selectedRegion,
  setSelectedRegion,
  selectedAccessibility,
  setSelectedAccessibility,
  viewMode,
  setViewMode,
  isFilterActive,
  searchQuery,
  setSearchQuery,
  handleResetFilters,
}: SpotFilterBarProps) {
  const categoryMenu = useDropdown()
  const regionMenu = useDropdown()
  const accessMenu = useDropdown()

  const handleCategoryToggle = () => {
    categoryMenu.toggle()
    regionMenu.close()
    accessMenu.close()
  }

  const handleRegionToggle = () => {
    regionMenu.toggle()
    categoryMenu.close()
    accessMenu.close()
  }

  const handleAccessToggle = () => {
    accessMenu.toggle()
    categoryMenu.close()
    regionMenu.close()
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full font-sans">
      
      {/* Search Input */}
      <div className="relative flex-1 w-full min-w-[200px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <input
          type="text"
          placeholder="Buscar por nome ou local"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface border border-primary/20 text-sm text-primary placeholder:text-primary/40 rounded-sm pl-10 pr-4 h-[42px] outline-none focus:border-primary transition-colors font-normal"
        />
      </div>

      {/* Category Filter */}
      <div className="h-[42px]">
        <SearchableDropdown
          options={categoriesList}
          selectedValues={selectedCategory !== 'Todas' ? [selectedCategory] : []}
          onSelect={(cat) => {
            setSelectedCategory(selectedCategory === cat ? 'Todas' : cat)
            categoryMenu.close()
          }}
          isOpen={categoryMenu.isOpen}
          onToggle={handleCategoryToggle}
          onClose={categoryMenu.close}
          placeholder="Buscar categoria..."
          triggerContent={<span className="font-normal text-primary/80">{selectedCategory === 'Todas' ? 'Todas as Categorias' : selectedCategory}</span>}
          triggerClassName="font-sans text-sm px-4 h-[42px] rounded-sm border border-primary/20 bg-surface text-primary hover:bg-black/5 cursor-pointer transition-all flex items-center gap-2"
          emptyMessage="Nenhuma categoria encontrada"
          variant="default"
          popoverWidthClass="w-56"
        />
      </div>

      {/* Region Filter */}
      <div className="h-[42px]">
        <SearchableDropdown
          options={regionsList}
          selectedValues={selectedRegion !== 'Todas' ? [selectedRegion] : []}
          onSelect={(opt) => {
            setSelectedRegion(selectedRegion === opt ? 'Todas' : opt)
            regionMenu.close()
          }}
          isOpen={regionMenu.isOpen}
          onToggle={handleRegionToggle}
          onClose={regionMenu.close}
          placeholder="Buscar região..."
          triggerContent={<span className="font-normal text-primary/80">{selectedRegion === 'Todas' ? 'Todas as Regiões' : selectedRegion}</span>}
          triggerClassName="font-sans text-sm px-4 h-[42px] rounded-sm border border-primary/20 bg-surface text-primary hover:bg-black/5 cursor-pointer transition-all flex items-center gap-2"
          emptyMessage="Nenhuma região encontrada"
          variant="default"
          popoverWidthClass="w-56"
        />
      </div>

      {/* Accessibility Filter */}
      <div className="h-[42px]">
        <SearchableDropdown
          options={accessibilityList}
          selectedValues={selectedAccessibility !== 'Todas' ? [selectedAccessibility] : []}
          onSelect={(opt) => {
            setSelectedAccessibility(selectedAccessibility === opt ? 'Todas' : opt)
            accessMenu.close()
          }}
          isOpen={accessMenu.isOpen}
          onToggle={handleAccessToggle}
          onClose={accessMenu.close}
          placeholder="Buscar acessibilidade..."
          triggerContent={<span className="font-normal text-primary/80">{selectedAccessibility === 'Todas' ? 'Toda Acessibilidade' : selectedAccessibility}</span>}
          triggerClassName="font-sans text-sm px-4 h-[42px] rounded-sm border border-primary/20 bg-surface text-primary hover:bg-black/5 cursor-pointer transition-all flex items-center gap-2"
          emptyMessage="Nenhuma acessibilidade encontrada"
          variant="default"
          popoverWidthClass="w-56"
        />
      </div>

      {/* Reset Filters */}
      <button
        type="button"
        onClick={handleResetFilters}
        disabled={!isFilterActive}
        className={`font-sans text-sm font-normal px-4 h-[42px] rounded-sm border border-transparent flex items-center gap-2 transition-all ${
          isFilterActive 
            ? 'hover:bg-primary/5 text-primary/60 hover:text-primary cursor-pointer' 
            : 'text-primary/20 cursor-not-allowed'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        Limpar filtros
      </button>

      {/* View Toggle */}
      <div className="flex items-center ml-auto border border-primary/20 rounded-sm p-[3px] bg-surface h-[42px]">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={`w-[34px] h-[34px] flex items-center justify-center rounded-sm transition-colors cursor-pointer border-none ${viewMode === 'list' ? 'bg-primary text-surface' : 'bg-transparent text-primary/40 hover:text-primary'}`}
          aria-label="List view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={`w-[34px] h-[34px] flex items-center justify-center rounded-sm transition-colors cursor-pointer border-none ${viewMode === 'grid' ? 'bg-primary text-surface' : 'bg-transparent text-primary/40 hover:text-primary'}`}
          aria-label="Grid view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        </button>
      </div>

    </div>
  )
}
