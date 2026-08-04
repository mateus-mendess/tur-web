import { useEffect, useState, type FormEvent } from 'react';

export interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onSignUpSuccess?: (data: { nome: string; email: string }) => void;
  leftImageSrc?: string;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSignUpSuccess,
  leftImageSrc,
}: SignUpModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [aceitoTermos, setAceitoTermos] = useState(false);

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

    if (!nome.trim()) {
      setErrorMessage('Por favor, digite seu nome completo.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }
    if (!senha) {
      setErrorMessage('Por favor, digite uma senha.');
      return;
    }
    if (senha !== confirmarSenha) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }
    if (!aceitoTermos) {
      setErrorMessage('Você deve aceitar os Termos de Uso e Política de Privacidade.');
      return;
    }

    if (onSignUpSuccess) {
      onSignUpSuccess({ nome, email });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/65 z-[1000] flex items-center justify-center p-5 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
    >
      <div
        className="relative w-full max-w-[920px] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon (X) - Sem fundo branco */}
        <button
          type="button"
          className="absolute -right-12 top-0 max-md:right-4 max-md:top-4 bg-transparent border-none p-0 flex items-center justify-center cursor-pointer text-white hover:text-tur-accent max-md:text-tur-dark transition-colors duration-200 z-10"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="w-full bg-white rounded-none overflow-hidden shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.05)] grid grid-cols-[1fr_1.15fr] max-md:grid-cols-1 min-h-[560px] max-md:max-h-[80vh] max-md:overflow-y-auto">

          {/* COLUNA DA ESQUERDA (TÍTULO E BOAS-VINDAS) */}
          <div className="relative bg-white p-[50px_40px] max-md:p-[32px_24px] max-md:min-h-[200px] flex flex-col justify-start after:content-[''] after:absolute after:right-0 after:top-[15%] after:bottom-[15%] after:w-px after:bg-black/30 max-md:after:hidden">
            <div className="z-[3] relative mb-6">
              <h3 className="font-dm-sans text-[26px] font-normal text-tur-gray-600 tracking-[3px] uppercase m-0 leading-[1.2]">Bem-vindo</h3>
            </div>

            <div className="z-[3] relative font-inter text-[15px] text-tur-gray-700 leading-[1.6] font-normal">
              Preencha os dados ao lado para criar sua conta no tur.
            </div>

            <div className="mt-auto pt-8 z-[3] relative font-inter text-sm text-tur-gray-700 leading-normal font-normal">
              Já é um membro?{' '}
              <button
                type="button"
                className="bg-transparent border-none p-0 font-inherit cursor-pointer text-tur-dark font-semibold underline underline-offset-[3px] transition-colors duration-200 inline hover:text-tur-accent"
                onClick={onSwitchToLogin || onClose}
              >
                Faça login agora
              </button>
            </div>
          </div>

          {/* COLUNA DA DIREITA (FORMULÁRIO DE CADASTRO) */}
          <div className="relative bg-white p-[50px_44px_36px_44px] max-md:p-[32px_24px] flex flex-col justify-between">
            <div className="absolute top-6 right-8 max-md:hidden">
              <img src="/assets/images/selo-img.png" alt="Selo postal" className="w-[95px] h-auto object-contain drop-shadow-sm opacity-90 grayscale-[0.2]" />
            </div>

            <div className="mb-2 max-md:block hidden">
              <h2 id="signup-title" className="font-dm-sans text-[28px] font-semibold text-tur-dark tracking-[-0.5px] m-0 mb-2">
                Cadastre-se para explorar
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-1 mt-[90px] max-md:mt-6 gap-5 z-10 relative">
              {errorMessage && (
                <div className="font-inter text-xs text-tur-red mt-0.5">{errorMessage}</div>
              )}

              {/* NOME COMPLETO */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-nome" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                  Nome Completo <span className="text-tur-accent ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-nome"
                    type="text"
                    className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
              </div>

              {/* E-MAIL */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="signup-email" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                  E-mail <span className="text-tur-accent ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <input
                    id="signup-email"
                    type="email"
                    className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* SENHA & CONFIRMAR SENHA */}
              <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-senha" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                    Senha <span className="text-tur-accent ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="signup-senha"
                      type="password"
                      className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                      placeholder="Senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-confirmar" className="font-inter text-[11px] font-bold text-tur-gray-600 tracking-[0.8px] uppercase">
                    Confirmar Senha <span className="text-tur-accent ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="signup-confirmar"
                      type="password"
                      className="w-full h-10 px-0.5 font-inter text-sm text-tur-dark bg-transparent border-b border-tur-gray-300 rounded-none outline-none transition-colors duration-200 focus:border-tur-dark placeholder-tur-gray-500"
                      placeholder="Repita a senha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* TERMOS DE USO (CHECKBOX ÚNICO) */}
              <div className="flex items-start gap-2.5 mt-2">
                <input
                  id="signup-terms"
                  type="checkbox"
                  className="appearance-none w-[18px] h-[18px] border-[1.5px] border-tur-gray-400 rounded-none outline-none cursor-pointer flex items-center justify-center mt-0.5 shrink-0 transition-all duration-200 bg-white checked:bg-tur-dark checked:border-tur-dark checked:after:content-[''] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-solid checked:after:border-white checked:after:border-b-2 checked:after:border-r-2 checked:after:rotate-45 checked:after:mb-[2px] focus-visible:ring-[3px] focus-visible:ring-tur-dark/20"
                  checked={aceitoTermos}
                  onChange={(e) => setAceitoTermos(e.target.checked)}
                />
                <label htmlFor="signup-terms" className="font-inter text-[13px] text-tur-gray-700 leading-[1.4] cursor-pointer select-none">
                  Li e aceito os{' '}
                  <a href="#termos" className="text-tur-dark font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-tur-accent" onClick={(e) => e.preventDefault()}>
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#privacidade" className="text-tur-dark font-semibold underline underline-offset-2 transition-colors duration-200 hover:text-tur-accent" onClick={(e) => e.preventDefault()}>
                    Política de Privacidade
                  </a>
                  .
                </label>
              </div>

              {/* BOTÃO DE AÇÃO PRINCIPAL (CTA) */}
              <div className="flex justify-center mt-3">
                <button type="submit" className="w-[180px] h-12 bg-tur-dark text-white font-dm-sans text-[15px] font-semibold border-none rounded-none cursor-pointer tracking-[0.2px] flex items-center justify-center gap-2 transition-colors duration-200 hover:bg-tur-dark-hover active:bg-tur-dark-active disabled:opacity-60 disabled:cursor-not-allowed">
                  Criar conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
