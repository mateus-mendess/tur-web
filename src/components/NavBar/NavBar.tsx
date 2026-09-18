import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '#/contexts/AuthContext'
import { UserMenu } from './UserMenu'
import { DestinosDropdown } from './DestinosDropdown'
import { PageContainer } from '#/components/UI/PageContainer'
import { useScrolled } from '#/hooks/useScrolled'

export function NavBar() {
  const { isAuthenticated, openLogin, openSignUp, openCreateSpot } = useAuth()
  const location = useLocation()

  const isHeroPage = location.pathname === '/'
  const isSpotDetailPage = location.pathname.startsWith('/pontos/')

  const isScrolled = useScrolled(20, !isHeroPage)

  const positionClass = isHeroPage ? 'fixed top-0 left-0 right-0' : 'sticky top-0'

  return (
    <header 
      className={`${positionClass} w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? (isSpotDetailPage ? 'bg-background text-primary border-b border-black/10' : 'bg-white text-black shadow-md')
          : 'bg-transparent text-surface'
      }`}
    >
      <PageContainer className="flex items-center justify-between py-4">
        <Link to="/" className="text-3xl font-normal tracking-tight hover:opacity-80 transition-opacity flex items-baseline">
          tur<span className="text-secondary">.</span>
        </Link>

        <nav className="flex items-center gap-8 font-normal text-lg">
          <Link to="/search" className="hover:opacity-80 transition-opacity">Buscar</Link>
          <DestinosDropdown />
          
          {isAuthenticated ? (
            <>
              <button onClick={() => openCreateSpot()} className="hover:opacity-80 transition-opacity cursor-pointer">Cadastrar Ponto</button>
              <UserMenu />
            </>
          ) : (
            <>
              <button onClick={() => openLogin()} className="hover:opacity-80 transition-opacity cursor-pointer">Login</button>
              <button onClick={() => openSignUp()} className="hover:opacity-80 transition-opacity cursor-pointer">Cadastrar-se</button>
            </>
          )}
        </nav>
      </PageContainer>
    </header>
  )
}
