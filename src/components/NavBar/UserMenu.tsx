import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { UserIcon, MapPinIcon, HeartIcon, CloseIcon } from '#/components/UI/Icons'
import { useAuth } from '#/contexts/AuthContext'

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { logout } = useAuth()

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar ao mudar de rota
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  return (
    <div className="relative" ref={menuRef}>
      {/* Botão Hambúrguer Animado */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-6 h-[18px] focus:outline-none flex flex-col justify-center cursor-pointer ml-4"
        aria-label="Abrir menu do usuário"
      >
        <span 
          className={`absolute left-0 w-full h-[1.5px] bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'top-[8px] rotate-45' : 'top-0'
          }`} 
        />
        <span 
          className={`absolute left-0 top-[8px] w-full h-[1.5px] bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-0' : 'opacity-100'
          }`} 
        />
        <span 
          className={`absolute left-0 w-full h-[1.5px] bg-current transition-all duration-300 ease-in-out ${
            isOpen ? 'top-[8px] -rotate-45' : 'top-[16px]'
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[40px] right-0 w-72 bg-surface rounded-sm shadow-md border border-black/5 overflow-hidden animate-fade-in font-sans text-primary">
          <div className="px-5 py-4 border-b border-black/10 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-secondary" />
            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest mt-0.5">
              Conta
            </span>
          </div>
          
          <div className="py-3 flex flex-col">
            <Link 
              to="/meus-pontos" 
              className="px-5 py-2.5 flex items-center gap-2 text-sm font-normal hover:bg-black/5 transition-colors duration-200"
            >
              <MapPinIcon className="w-4 h-4" />
              Meus Pontos
            </Link>
            <Link 
              to="/meus-favoritos" 
              className="px-5 py-2.5 flex items-center gap-2 text-sm font-normal hover:bg-black/5 transition-colors duration-200"
            >
              <HeartIcon className="w-4 h-4" />
              Meus Favoritos
            </Link>
          </div>
          
          <div className="border-t border-black/10 py-3">
            <button 
              onClick={() => logout()}
              className="w-full text-left px-5 py-2.5 flex items-center gap-2 text-sm font-normal hover:bg-black/5 transition-colors duration-200 text-error cursor-pointer"
            >
              <CloseIcon className="w-4 h-4 text-error" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
