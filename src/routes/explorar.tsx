import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import { FEATURED_SPOTS, type Spot } from '../data/spots';
import { SpotCard } from '../components/Spots/SpotCard';
import { SpotDetailModal } from '../components/Spots/SpotDetailModal';
import { Header } from '../components/Header/Header';

export const Route = createFileRoute('/explorar')({
  component: ExplorarPage,
});

const INITIAL_CATEGORIES = ['Praias', 'Ecoturismo', 'Histórico', 'Gastronomia', 'Natureza', 'Aventura', 'Cultura'];
const ACCESSIBILITY_OPTIONS = ['Todas', 'Acessível para PCD', 'Rampa de acesso', 'Audiodescrição'];

function ExplorarPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedAccessibility, setSelectedAccessibility] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categoriesList = INITIAL_CATEGORIES;
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState<boolean>(false);
  const [isActiveFiltersMenuOpen, setIsActiveFiltersMenuOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [accessSearchQuery, setAccessSearchQuery] = useState<string>('');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const filteredCategoriesInMenu = useMemo(() => {
    if (!categorySearchQuery.trim()) return categoriesList;
    return categoriesList.filter((cat) =>
      cat.toLowerCase().includes(categorySearchQuery.toLowerCase())
    );
  }, [categoriesList, categorySearchQuery]);

  const filteredAccessOptionsInMenu = useMemo(() => {
    const options = ACCESSIBILITY_OPTIONS.filter((opt) => opt !== 'Todas');
    if (!accessSearchQuery.trim()) return options;
    return options.filter((opt) =>
      opt.toLowerCase().includes(accessSearchQuery.toLowerCase())
    );
  }, [accessSearchQuery]);

  const filteredSpots = useMemo(() => {
    return FEATURED_SPOTS.filter((spot) => {
      const matchCategory = selectedCategory === 'Todas' || spot.category === selectedCategory;
      const matchAccessibility =
        selectedAccessibility === 'Todas' ||
        (spot.accessibility && spot.accessibility.includes(selectedAccessibility));
      const matchSearch = searchQuery.trim() === '' || 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        spot.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchCategory && matchAccessibility && matchSearch;
    });
  }, [selectedCategory, selectedAccessibility, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('Todas');
    setSelectedAccessibility('Todas');
    setSearchQuery('');
  };

  const activeFilterNames = useMemo(() => {
    const names: string[] = [];
    if (selectedCategory !== 'Todas') names.push(selectedCategory);
    if (selectedAccessibility !== 'Todas') names.push(selectedAccessibility);
    if (searchQuery.trim() !== '') names.push(`"${searchQuery.trim()}"`);
    return names;
  }, [selectedCategory, selectedAccessibility, searchQuery]);

  const isFilterActive = selectedCategory !== 'Todas' || selectedAccessibility !== 'Todas' || searchQuery !== '';

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
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCategoryMenuOpen((prev) => !prev);
                  setIsAccessMenuOpen(false);
                }}
                className="font-inter text-sm px-3.5 py-2 rounded-none border border-black bg-transparent text-tur-dark hover:bg-black/5 font-medium cursor-pointer transition-all flex items-center gap-2"
              >
                <span>Categoria</span>
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
                  className={`transition-transform duration-200 shrink-0 ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Backdrop */}
              {isCategoryMenuOpen && (
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsCategoryMenuOpen(false)}
                />
              )}

              {/* Category Dropdown Menu Box (Slide down & Fade effect) */}
              <div className={`absolute left-0 top-full mt-2 w-72 bg-white border border-black shadow-2xl z-30 p-3 flex flex-col gap-3 rounded-none transition-all duration-200 ease-out transform origin-top-left ${
                isCategoryMenuOpen 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                {/* Search inside Category Menu */}
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Buscar categoria..." 
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    className="w-full font-inter text-xs border border-black/30 p-2 pr-7 rounded-none outline-none focus:border-black"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tur-gray-500 pointer-events-none">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>

                {/* Category Options List (Without "Todas as Categorias") */}
                <div className="max-h-44 overflow-y-auto flex flex-col gap-1 pr-1">
                  {filteredCategoriesInMenu.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(isSelected ? 'Todas' : cat);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="text-left font-inter text-xs px-2.5 py-2 transition-colors flex items-center gap-2.5 rounded-none hover:bg-black/5 text-tur-dark cursor-pointer"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full transition-all shrink-0 ${
                          isSelected
                            ? 'bg-tur-accent'
                            : 'border border-black/30 bg-transparent'
                        }`} />
                        <span className={isSelected ? 'font-semibold text-tur-accent' : 'font-normal text-tur-dark'}>{cat}</span>
                      </button>
                    );
                  })}

                  {filteredCategoriesInMenu.length === 0 && (
                    <div className="font-inter text-xs text-tur-gray-500 py-2 text-center">
                      Nenhuma categoria encontrada
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Accessibility Filter Custom Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAccessMenuOpen((prev) => !prev);
                  setIsCategoryMenuOpen(false);
                }}
                className="font-inter text-sm px-3.5 py-2 rounded-none border border-black bg-transparent text-tur-dark hover:bg-black/5 font-medium cursor-pointer transition-all flex items-center gap-2"
              >
                <span>Acessibilidade</span>
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
                  className={`transition-transform duration-200 shrink-0 ${isAccessMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Backdrop */}
              {isAccessMenuOpen && (
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsAccessMenuOpen(false)}
                />
              )}

              {/* Accessibility Dropdown Menu Box (Slide down & Fade effect) */}
              <div className={`absolute left-0 top-full mt-2 w-72 bg-white border border-black shadow-2xl z-30 p-3 flex flex-col gap-3 rounded-none transition-all duration-200 ease-out transform origin-top-left ${
                isAccessMenuOpen 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                {/* Search inside Accessibility Menu */}
                <div className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Buscar acessibilidade..." 
                    value={accessSearchQuery}
                    onChange={(e) => setAccessSearchQuery(e.target.value)}
                    className="w-full font-inter text-xs border border-black/30 p-2 pr-7 rounded-none outline-none focus:border-black"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-tur-gray-500 pointer-events-none">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                </div>

                {/* Accessibility Options List */}
                <div className="max-h-44 overflow-y-auto flex flex-col gap-1 pr-1">
                  {filteredAccessOptionsInMenu.map((opt) => {
                    const isSelected = selectedAccessibility === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelectedAccessibility(isSelected ? 'Todas' : opt);
                          setIsAccessMenuOpen(false);
                        }}
                        className="text-left font-inter text-xs px-2.5 py-2 transition-colors flex items-center gap-2.5 rounded-none hover:bg-black/5 text-tur-dark cursor-pointer"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full transition-all shrink-0 ${
                          isSelected
                            ? 'bg-tur-accent'
                            : 'border border-black/30 bg-transparent'
                        }`} />
                        <span className={isSelected ? 'font-semibold text-tur-accent' : 'font-normal text-tur-dark'}>{opt}</span>
                      </button>
                    );
                  })}

                  {filteredAccessOptionsInMenu.length === 0 && (
                    <div className="font-inter text-xs text-tur-gray-500 py-2 text-center">
                      Nenhuma opção encontrada
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end">
            {/* Active Filters Custom Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsActiveFiltersMenuOpen((prev) => !prev);
                  setIsCategoryMenuOpen(false);
                  setIsAccessMenuOpen(false);
                }}
                className={`font-inter text-sm font-semibold px-4 py-2.5 rounded-none border border-black transition-all flex items-center gap-2 outline-none cursor-pointer ${
                  isFilterActive
                    ? 'bg-tur-accent text-white'
                    : 'bg-transparent text-tur-dark/60 hover:bg-black/5'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
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
                  className={`transition-transform duration-200 shrink-0 ${isActiveFiltersMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {/* Backdrop */}
              {isActiveFiltersMenuOpen && (
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsActiveFiltersMenuOpen(false)}
                />
              )}

              {/* Active Filters Dropdown Menu Box */}
              <div className={`absolute right-0 top-full mt-2 w-72 bg-white border border-black shadow-2xl z-30 p-3 flex flex-col gap-2 rounded-none transition-all duration-200 ease-out transform origin-top-right ${
                isActiveFiltersMenuOpen 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}>
                <div className="font-inter text-xs font-bold text-tur-gray-700 uppercase tracking-widest pb-1.5 border-b border-black/10 flex items-center justify-between">
                  <span>Filtros Aplicados</span>
                  <span className="text-[10px] font-semibold text-tur-gray-500">{activeFilterNames.length} ativo(s)</span>
                </div>

                {isFilterActive ? (
                  <div className="flex flex-col gap-2 py-1">
                    {selectedCategory !== 'Todas' && (
                      <div className="flex items-center justify-between font-inter text-xs bg-transparent text-tur-dark p-2 border border-black/15 rounded-none hover:bg-black/5 transition-colors">
                        <div className="flex items-center gap-2 truncate pr-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-tur-accent shrink-0" />
                          <span className="font-semibold text-tur-dark">{selectedCategory}</span>
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
                          <span className="font-semibold text-tur-dark">{selectedAccessibility}</span>
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
                          <span className="font-semibold text-tur-dark">"{searchQuery}"</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
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
        
        {filteredSpots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 md:gap-x-3 lg:gap-x-4 gap-y-10 md:gap-y-12">
            {filteredSpots.map((spot) => (
              <SpotCard 
                key={spot.id} 
                spot={spot} 
                onClick={() => setSelectedSpot(spot)}
              />
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-tur-gray-400 mb-4">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <h3 className="font-dm-sans text-2xl font-bold text-tur-dark mb-2">
              Nenhum destino encontrado
            </h3>
            <p className="font-inter text-tur-gray-600 max-w-md mx-auto">
              Não encontramos destinos que correspondam aos filtros selecionados. Tente ajustar suas preferências.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 font-inter font-semibold px-6 py-3 bg-tur-dark text-white rounded-none hover:bg-tur-dark-hover transition-colors cursor-pointer border-none"
            >
              Limpar Filtros
            </button>
          </div>
        )}

      </div>

      <SpotDetailModal 
        spot={selectedSpot} 
        isOpen={!!selectedSpot} 
        onClose={() => setSelectedSpot(null)} 
      />
    </div>
  );
}
