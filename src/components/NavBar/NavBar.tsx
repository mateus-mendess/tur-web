import { Link } from '@tanstack/react-router'
import { useAuth } from '#/contexts/AuthContext'

export function NavBar() {
  const { openLogin, openSignUp } = useAuth()

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8 text-surface">
      <Link to="/" className="text-3xl font-bold tracking-tight hover:opacity-80 transition-opacity">
        tur.
      </Link>

      <nav className="flex items-center gap-8 font-semibold text-lg">
        <Link to="/destinos" className="hover:opacity-80 transition-opacity">Destinos</Link>
        <Link to="/explorar" className="hover:opacity-80 transition-opacity">Buscar</Link>
        <button onClick={openLogin} className="hover:opacity-80 transition-opacity cursor-pointer">Login</button>
        <button onClick={openSignUp} className="hover:opacity-80 transition-opacity cursor-pointer">Cadastrar-se</button>
      </nav>
    </header>
  )
}
