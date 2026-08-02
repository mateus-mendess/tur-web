import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { SignUpModal } from '../Auth/SignUpModal';
import { LoginModal } from '../Auth/LoginModal';
import { SearchOverlay } from '../Search/SearchOverlay';

interface HeaderProps {
  theme?: 'dark' | 'light';
}

export function Header({ theme = 'dark' }: HeaderProps) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsSignUpOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenSignUp = () => {
    setIsLoginOpen(false);
    setIsSignUpOpen(true);
  };

  const textColor = theme === 'dark' ? 'text-white' : 'text-tur-dark';

  return (
    <>
      <header className="flex max-md:flex-col justify-between items-center z-10 font-inter w-full max-md:gap-4 relative">
        <nav className="flex gap-8 flex-1 max-md:justify-center">
          <Link to="/explorar" className={`${textColor} no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80`}>Explorar</Link>
          <a href="#" className={`${textColor} no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80`}>Mapa</a>
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
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </nav>

        <div className={`font-dm-sans text-[28px] font-bold ${textColor} tracking-[2px] flex-1 text-center`}>
          <Link to="/" className={`${textColor} no-underline`}>Tur<span className="text-tur-accent">.</span></Link>
        </div>

        <div className="flex items-center justify-end max-md:justify-center gap-6 flex-1">
          <button
            type="button"
            className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit`}
            onClick={handleOpenLogin}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`${textColor} no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit`}
            onClick={handleOpenSignUp}
          >
            Cadastrar-se
          </button>
        </div>
      </header>

      {/* Sign-Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={handleOpenLogin}
        onSignUpSuccess={(data) => {
          alert(`Conta criada com sucesso para ${data.nome} (${data.email})!`);
        }}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignUp={handleOpenSignUp}
        onLoginSuccess={(data) => {
          alert(`Login efetuado com sucesso para ${data.email}!`);
        }}
      />

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
