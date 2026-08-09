import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { SearchOverlay } from '#/components/Search/SearchOverlay'
import { useAuth } from '#/contexts/AuthContext'

interface HeaderProps {
  theme?: 'dark' | 'light'
}

export function Header({ theme = 'dark' }: HeaderProps) {
  const { openLogin, openSignUp, isAuthenticated, logout } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
          {isAuthenticated ? (
            <>
              <Link
                to="/cadastrar-ponto"
                className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80`}
              >
                Cadastrar ponto
              </Link>
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit flex items-center gap-1.5`}
                >
                  Perfil
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
                    className={`transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] py-1.5 z-50 border border-black/5 flex flex-col font-inter">
                    <Link
                      to="/perfil/salvos"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left no-underline font-medium"
                    >
                      Salvos
                    </Link>
                    <Link
                      to="/perfil/meus-pontos"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-tur-gray-700 hover:bg-black/5 hover:text-tur-accent transition-colors text-left no-underline font-medium"
                    >
                      Meus Pontos
                    </Link>
                    <div className="border-t border-black/5 my-1.5"></div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false)
                        logout()
                      }}
                      className="block w-full px-4 py-2 text-sm text-tur-red hover:bg-tur-red/5 transition-colors text-left font-medium cursor-pointer bg-transparent border-none"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
