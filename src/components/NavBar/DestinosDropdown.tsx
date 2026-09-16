import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDownIcon, MapPinIcon } from '#/components/UI/Icons'

const REGIONS = [
  'África',
  'América Central',
  'América do Norte',
  'América do Sul',
  'Ásia',
  'Europa',
  'Oceania'
]

export function DestinosDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar ao mudar de rota ou parâmetros de busca
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname, location.search])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:opacity-80 transition-opacity font-normal text-lg focus:outline-none cursor-pointer"
        aria-label="Abrir menu de destinos"
        aria-expanded={isOpen}
      >
        Destinos
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[40px] left-1/2 -translate-x-1/2 w-64 bg-surface rounded-xl rounded-tr-none shadow-md border border-black/5 overflow-hidden animate-fade-in font-sans text-primary">
          <div className="px-5 py-4 border-b border-black/10 flex items-center gap-2">
            <span className="text-[11px] font-bold text-black/50 uppercase tracking-widest mt-0.5">
              Explorar Regiões
            </span>
          </div>
          
          <div className="py-2 flex flex-col max-h-[300px] overflow-y-auto">
            {REGIONS.map((region) => (
              <Link 
                key={region}
                to="/search" 
                search={{ regiao: region }}
                className="px-5 py-2.5 flex items-center gap-2 text-sm font-normal hover:bg-black/5 transition-colors duration-200"
              >
                <MapPinIcon className="w-4 h-4 text-black/40" />
                {region}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
