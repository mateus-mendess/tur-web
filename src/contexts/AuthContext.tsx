import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { toast } from 'sonner'
import { authService } from '#/services/authService'
import type { AuthUser } from '#/services/authService'
import type { LoginFormData, SignUpFormData } from '#/schemas/authSchema'
import { storage } from '#/lib/storage'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoginOpen: boolean
  isSignUpOpen: boolean
  openLogin: () => void
  openSignUp: () => void
  closeModals: () => void
  handleLogin: (data: LoginFormData) => Promise<void>
  handleSignUp: (data: SignUpFormData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignUpOpen, setSignUpOpen] = useState(false)

  // Carrega o token inicial de forma segura no client (evita mismatch de hidratação)
  useEffect(() => {
    const storedToken = storage.getItem('tur_token')
    if (storedToken) {
      setToken(storedToken)
    }
    setIsInitializing(false)
  }, [])

  // Fecha ambos os modais ao pressionar Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLoginOpen(false)
        setSignUpOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openLogin = useCallback(() => {
    setLoginOpen(true)
    setSignUpOpen(false)
  }, [])

  const openSignUp = useCallback(() => {
    setSignUpOpen(true)
    setLoginOpen(false)
  }, [])

  const closeModals = useCallback(() => {
    setLoginOpen(false)
    setSignUpOpen(false)
  }, [])

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      const response = await authService.login(data)
      setUser(response.user)
      setToken(response.token)
      storage.setItem('tur_token', response.token)
      toast.success(`Bem-vindo de volta, ${response.user.nome}!`)
      closeModals()
    },
    [closeModals],
  )

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      const response = await authService.register(data)
      setUser(response.user)
      setToken(response.token)
      storage.setItem('tur_token', response.token)
      toast.success(`Conta criada! Bem-vindo, ${response.user.nome}!`)
      closeModals()
    },
    [closeModals],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    void authService.logout()
    toast.info('Sessão encerrada com sucesso.')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isInitializing,
        isLoginOpen,
        isSignUpOpen,
        openLogin,
        openSignUp,
        closeModals,
        handleLogin,
        handleSignUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
