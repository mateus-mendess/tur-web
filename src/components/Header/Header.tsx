import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SearchOverlay } from '#/components/Search/SearchOverlay'
import { useAuth } from '#/contexts/AuthContext'

interface HeaderProps {
  theme?: 'dark' | 'light'
}

export function Header({ theme = 'dark' }: HeaderProps) {
  const { openLogin, openSignUp } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const textColor = theme === 'dark' ? 'text-white' : 'text-tur-dark'

  return (
    <>
      <header className="flex max-md:flex-col justify-between items-center z-10 font-inter w-full max-md:gap-4 relative">
        <nav className="flex gap-8 flex-1 max-md:justify-center">
          <Link
            to="/explorar"
            className={`${textColor} no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80`}
          >
            Explorar
          </Link>
          <a
            href="#"
            className={`${textColor} no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80`}
          >
            Mapa
          </a>
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className={`${textColor} no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit p-0 flex items-center gap-1.5`}
          >
            <span>Buscar</span>
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
              className={`transition-transform duration-200 ${isSearchOpen ? 'rotate-180' : ''}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        </nav>

        <div
          className={`font-dm-sans text-[28px] font-bold ${textColor} tracking-[2px] flex-1 text-center`}
        >
          <Link to="/" className={`${textColor} no-underline`}>
            Tur<span className="text-tur-accent">.</span>
          </Link>
        </div>

        <div className="flex items-center justify-end max-md:justify-center gap-6 flex-1">
          <button
            type="button"
            className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit`}
            onClick={openLogin}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit`}
            onClick={openSignUp}
          >
            Cadastrar-se
          </button>
        </div>
      </header>

      {/* Search Overlay — permanece local pois não é estado global */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}
