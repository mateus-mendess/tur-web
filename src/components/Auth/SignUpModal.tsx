import { useEffect, useState, type FormEvent } from 'react';
import styles from './SignUpModal.module.css';

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
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-title"
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon (X) */}
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* COLUNA DA ESQUERDA (PAINEL DE BOAS-VINDAS / DECORATIVO) */}
        <div className={styles.leftColumn}>
          {/* Full background image occupying entire left column */}
          <img
            src={leftImageSrc || "/assets/images/img-stamps.png"}
            alt="tur. plataforma"
            className={styles.leftColumnBgImage}
          />
          <div className={styles.leftOverlayGradient} />

          <div className={styles.leftHeader}>
            <h3 className={styles.welcomeBadge}>Bem-vindo!</h3>
          </div>

          <div className={styles.leftFooter}>
            Já é um membro?{' '}
            <button
              type="button"
              className={styles.loginLink}
              onClick={onSwitchToLogin || onClose}
            >
              Faça login agora
            </button>
          </div>
        </div>

        {/* COLUNA DA DIREITA (FORMULÁRIO DE CADASTRO) */}
        <div className={styles.rightColumn}>
          <div className={styles.formHeader}>
            <h2 id="signup-title" className={styles.formTitle}>
              Cadastre-se para explorar
            </h2>
            <p className={styles.formSubtitle}>
              Preencha os dados abaixo para criar sua conta no tur.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.formBody}>
            {errorMessage && (
              <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            {/* NOME COMPLETO */}
            <div className={styles.inputGroup}>
              <label htmlFor="signup-nome" className={styles.inputLabel}>
                Nome Completo <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="signup-nome"
                  type="text"
                  className={styles.textInput}
                  placeholder="Digite seu nome completo"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
            </div>

            {/* E-MAIL */}
            <div className={styles.inputGroup}>
              <label htmlFor="signup-email" className={styles.inputLabel}>
                E-mail <span className={styles.requiredStar}>*</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="signup-email"
                  type="email"
                  className={styles.textInput}
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* SENHA & CONFIRMAR SENHA */}
            <div className={styles.passwordGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="signup-senha" className={styles.inputLabel}>
                  Senha <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="signup-senha"
                    type="password"
                    className={styles.textInput}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="signup-confirmar" className={styles.inputLabel}>
                  Confirmar Senha <span className={styles.requiredStar}>*</span>
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    id="signup-confirmar"
                    type="password"
                    className={styles.textInput}
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* TERMOS DE USO (CHECKBOX ÚNICO) */}
            <div className={styles.termsWrapper}>
              <input
                id="signup-terms"
                type="checkbox"
                className={styles.customCheckbox}
                checked={aceitoTermos}
                onChange={(e) => setAceitoTermos(e.target.checked)}
              />
              <label htmlFor="signup-terms" className={styles.termsLabel}>
                Li e aceito os{' '}
                <a href="#termos" className={styles.termsLink} onClick={(e) => e.preventDefault()}>
                  Termos de Uso
                </a>{' '}
                e{' '}
                <a href="#privacidade" className={styles.termsLink} onClick={(e) => e.preventDefault()}>
                  Política de Privacidade
                </a>
                .
              </label>
            </div>

            {/* BOTÃO DE AÇÃO PRINCIPAL (CTA) */}
            <button type="submit" className={styles.submitButton}>
              Criar minha conta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
