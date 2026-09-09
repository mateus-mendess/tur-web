import { Link } from '@tanstack/react-router'
import { useAuth } from '#/contexts/AuthContext'
import { useState, useEffect } from 'react'

export function NavBar() {
  const { openLogin, openSignUp } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-white text-black shadow-md' : 'bg-transparent text-surface'
      }`}
    >
      <Link to="/" className="text-3xl font-normal tracking-tight hover:opacity-80 transition-opacity">
        tur<span className="text-secondary">.</span>
      </Link>

      <nav className="flex items-center gap-8 font-normal text-lg">
        <Link to="/destinos" className="hover:opacity-80 transition-opacity">Destinos</Link>
        <Link to="/explorar" className="hover:opacity-80 transition-opacity">Buscar</Link>
        <button onClick={() => openLogin()} className="hover:opacity-80 transition-opacity cursor-pointer">Login</button>
        <button onClick={() => openSignUp()} className="hover:opacity-80 transition-opacity cursor-pointer">Cadastrar-se</button>
      </nav>
    </header>
  )
}
