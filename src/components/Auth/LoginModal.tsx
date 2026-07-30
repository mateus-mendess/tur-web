import { useEffect, useState, type FormEvent } from 'react';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
  onLoginSuccess?: (data: { email: string }) => void;
  leftImageSrc?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
  onLoginSuccess,
  leftImageSrc,
}: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mantenhaConectado, setMantenhaConectado] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }
    if (!senha) {
      setErrorMessage('Por favor, digite sua senha.');
      return;
    }

    if (onLoginSuccess) {
      onLoginSuccess({ email });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[1000] flex items-center justify-center p-5 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      <div
        className="relative w-full max-w-[920px] bg-white rounded-2xl overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[520px] max-md:max-h-[90vh] max-md:overflow-y-auto animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon (X) */}
        <button
          type="button"
          className="absolute top-5 right-5 z-20 bg-transparent border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-tur-gray-600 transition-all duration-200 hover:bg-tur-gray-100 hover:text-tur-dark"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* COLUNA DA ESQUERDA (PAINEL DE BOAS-VINDAS / DECORATIVO) */}
        <div className="relative bg-tur-bg p-[44px_36px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-between border-r border-black/5 overflow-hidden">
          {/* Full background image occupying entire left column */}
          <img
            src={leftImageSrc || "/assets/images/img-stamps.png"}
            alt="tur. plataforma"
            className="absolute inset-0 w-full h-full object-contain object-center p-[18px_8px] z-[1] transition-transform duration-300"
          />
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(180deg,rgba(243,241,235,0.6)_0%,rgba(243,241,235,0)_35%,rgba(243,241,235,0)_65%,rgba(243,241,235,0.7)_100%)] z-[2] pointer-events-none" />

          <div className="z-[3] relative">
            <h3 className="font-dm-sans text-[21px] font-normal text-tur-dark tracking-[-0.3px] m-0 leading-[1.2]">Bem-vindo!</h3>
          </div>

          <div className="z-[3] relative font-inter text-sm text-tur-gray-700 leading-normal font-normal">
            Ainda não tem conta?{' '}
            <button
              type="button"
              className="bg-transparent border-none p-0 font-inherit cursor-pointer text-tur-dark font-semibold underline underline-offset-[3px] transition-colors duration-200 inline hover:text-tur-accent"
              onClick={onSwitchToSignUp || onClose}
            >
              Cadastre-se agora
            </button>
          </div>
        </div>

        {/* COLUNA DA DIREITA (FORMULÁRIO DE LOGIN) */}
        <div className="bg-white p-[44px_44px_36px_44px] max-md:p-[32px_24px] flex flex-col justify-between">
          <div className="mb-6">
            <h2 id="login-title" className="font-dm-sans text-[28px] font-semibold text-tur-dark tracking-[-0.5px] m-0 mb-2">
              Entrar na sua conta
            </h2>
            <p className="font-inter text-sm text-tur-gray-600 m-0">
              Informe seus dados de acesso para continuar.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 gap-5">
            {errorMessage && (
              <div className="font-inter text-xs text-tur-red mt-0.5">{errorMessage}</div>
            )}

            <div className="flex flex-col gap-4">
              {/* E-MAIL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                  E-mail <span className="text-tur-accent ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="login-email"
                    type="email"
                    className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* SENHA */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-senha" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                  Senha <span className="text-tur-accent ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="login-senha"
                    type="password"
                    className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                    placeholder="Sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>

              {/* OPÇÕES ADICIONAIS: LEMBRAR-ME & ESQUECEU A SENHA */}
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <input
                    id="login-remember"
                    type="checkbox"
                    className="appearance-none w-[18px] h-[18px] border-[1.5px] border-tur-gray-400 rounded outline-none cursor-pointer flex items-center justify-center shrink-0 transition-all duration-200 bg-white checked:bg-tur-dark checked:border-tur-dark checked:after:content-[''] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-solid checked:after:border-white checked:after:border-b-2 checked:after:border-r-2 checked:after:rotate-45 checked:after:mb-[2px] focus-visible:ring-[3px] focus-visible:ring-tur-dark/20"
                    checked={mantenhaConectado}
                    onChange={(e) => setMantenhaConectado(e.target.checked)}
                  />
                  <label htmlFor="login-remember" className="font-inter text-[13px] text-tur-gray-700 cursor-pointer select-none">
                    Mantenha-me conectado
                  </label>
                </div>

                <a
                  href="#esqueci-senha"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Funcionalidade de recuperação de senha em breve.');
                  }}
                  className="font-inter text-xs text-tur-gray-600 hover:text-tur-accent transition-colors underline underline-offset-2"
                >
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            {/* BOTÃO DE AÇÃO PRINCIPAL (CTA) */}
            <button
              type="submit"
              className="w-full h-12 bg-tur-dark text-white font-dm-sans text-[15px] font-semibold border-none rounded-lg cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200 mt-4 hover:bg-tur-dark-hover active:bg-tur-dark-active disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
