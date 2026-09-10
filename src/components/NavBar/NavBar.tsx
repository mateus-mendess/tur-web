import { Link, useLocation } from '@tanstack/react-router'
import { useAuth } from '#/contexts/AuthContext'
import { useState, useEffect } from 'react'
import { PageContainer } from '#/components/UI/PageContainer'

export function NavBar() {
  const { openLogin, openSignUp } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const isHome = location.pathname === '/'

  useEffect(() => {
    if (!isHome) {
      setIsScrolled(true)
      return
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    setIsScrolled(window.scrollY > 20)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome])

  const positionClass = isHome ? 'fixed top-0 left-0 right-0' : 'sticky top-0'

  return (
    <header 
      className={`${positionClass} w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-surface'
      }`}
    >
      <PageContainer className="flex items-center justify-between py-4">
        <Link to="/" className="text-3xl font-normal tracking-tight hover:opacity-80 transition-opacity flex items-baseline">
          tur<span className="text-secondary">.</span>
        </Link>

        <nav className="flex items-center gap-8 font-normal text-lg">
          <Link to="/search" className="hover:opacity-80 transition-opacity">Buscar</Link>
          <Link to="/destinos" className="hover:opacity-80 transition-opacity">Destinos</Link>
          <button onClick={() => openLogin()} className="hover:opacity-80 transition-opacity cursor-pointer">Login</button>
          <button onClick={() => openSignUp()} className="hover:opacity-80 transition-opacity cursor-pointer">Cadastrar-se</button>
        </nav>
      </PageContainer>
    </header>
  )
}
