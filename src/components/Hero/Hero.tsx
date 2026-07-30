import { useState } from 'react';
import { SignUpModal } from '../Auth/SignUpModal';

interface HeroProps {
  videoSrc?: string;
}

export function Hero({
  videoSrc = "/assets/videos/hero-video.mp4"
}: HeroProps) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className="bg-tur-bg min-h-screen p-2 flex box-border">
      <div className="flex-1 rounded-xl relative overflow-hidden flex flex-col justify-between p-[28px_40px] max-md:p-5 bg-tur-dark">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Navigation Header */}
        <header className="flex max-md:flex-col justify-between items-center z-10 font-inter w-full max-md:gap-4">
          <nav className="flex gap-8 flex-1 max-md:justify-center">
            <a href="#" className="text-white no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80">Explorar</a>
            <a href="#" className="text-white no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80">Mapa</a>
            <a href="#" className="text-white no-underline text-[15px] font-medium tracking-[0.5px] transition-opacity duration-200 hover:opacity-80">Categoria</a>
          </nav>

          <div className="font-dm-sans text-[28px] font-bold text-white tracking-[2px] flex-1 text-center">
            Tur<span className="text-tur-accent">.</span>
          </div>

          <div className="flex items-center justify-end max-md:justify-center gap-6 flex-1">
            <button
              type="button"
              className="text-white no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit"
              onClick={() => setIsSignUpOpen(true)}
            >
              Entrar
            </button>
            <button
              type="button"
              className="text-white no-underline text-[15px] font-medium transition-opacity duration-200 hover:opacity-80 bg-transparent border-none cursor-pointer font-inherit"
              onClick={() => setIsSignUpOpen(true)}
            >
              Cadastrar-se
            </button>
          </div>
        </header>

        {/* Hero Title Split (Left / Right) */}
        <div className="flex max-md:flex-col justify-between max-md:justify-center items-center flex-1 z-10 w-full max-md:gap-3">
          <h1 className="font-dm-sans text-[5.5vw] max-md:text-[42px] font-bold text-white m-0 leading-[1.05] tracking-[-2px] text-left max-md:text-center">Explore</h1>
          <h1 className="font-dm-sans text-[5.5vw] max-md:text-[42px] font-bold text-white m-0 leading-[1.05] tracking-[-2px] text-right max-md:text-center">o mundo.</h1>
        </div>

        {/* Footer Section */}
        <footer className="flex flex-col gap-4 z-10 w-full">
          <div className="h-[1px] w-full bg-white/30" />
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center justify-center w-8 h-8 border border-white/40 rounded-full text-base text-white animate-bounce">↓</div>
            <span className="text-white font-inter text-sm font-medium">Scroll to explore</span>
          </div>
        </footer>
      </div>

      {/* Sign-Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToLogin={() => {
          // Placeholder action when switching to login
          alert('Redirecionando para o login...');
        }}
        onSignUpSuccess={(data) => {
          alert(`Conta criada com sucesso para ${data.nome} (${data.email})!`);
        }}
      />
    </div>
  );
}
