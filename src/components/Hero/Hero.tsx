import { useState } from 'react';
import styles from './Hero.module.css';
import { SignUpModal } from '../Auth/SignUpModal';

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function Hero({
  videoSrc = "/assets/videos/hero-video.mp4",
  posterSrc = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
}: HeroProps) {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <div className={styles.heroPage}>
      <div className={styles.heroContainer}>
        {/* Background Video */}
        <video
          className={styles.bgVideo}
          autoPlay
          loop
          muted
          playsInline
          poster={posterSrc}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Navigation Header */}
        <header className={styles.heroHeader}>
          <nav className={styles.heroNavLeft}>
            <a href="#">Explorar</a>
            <a href="#">Mapa</a>
            <a href="#">Categoria</a>
          </nav>
          
          <div className={styles.heroLogo}>
            Tur<span>.</span>
          </div>
          
          <div className={styles.heroNavRight}>
            <button 
              type="button" 
              className={styles.navLogin}
              onClick={() => setIsSignUpOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              Entrar
            </button>
            <button 
              type="button" 
              className={styles.navSignup}
              onClick={() => setIsSignUpOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              Cadastrar-se
            </button>
          </div>
        </header>

        {/* Hero Title Split (Left / Right) */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitleLeft}>Explore</h1>
          <h1 className={styles.heroTitleRight}>o mundo.</h1>
        </div>

        {/* Footer Section */}
        <footer className={styles.heroFooter}>
          <div className={styles.fullWidthLine} />
          <div className={styles.footerBottom}>
            <div className={styles.scrollIcon}>↓</div>
            <span className={styles.scrollText}>Scroll to explore</span>
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


