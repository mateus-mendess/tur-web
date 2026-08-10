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
import { decodeJwt } from '#/lib/jwt'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoginOpen: boolean
  isSignUpOpen: boolean
  openLogin: (defaultEmail?: string) => void
  openSignUp: () => void
  closeModals: () => void
  handleLogin: (data: LoginFormData) => Promise<void>
  handleSignUp: (data: SignUpFormData) => Promise<void>
  logout: () => void
  defaultLoginEmail: string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignUpOpen, setSignUpOpen] = useState(false)
  const [defaultLoginEmail, setDefaultLoginEmail] = useState('')

  // Carrega o token inicial de forma segura no client (evita mismatch de hidratação)
  useEffect(() => {
    const storedToken = storage.getItem('tur_token')
    if (storedToken) {
      setToken(storedToken)
      
      const decoded = decodeJwt(storedToken)
      if (decoded && decoded.sub) {
        setUser({
          id: decoded.sub,
          nome: decoded.nome || 'Usuário',
          email: decoded.email || '',
        })
      }
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

  const openLogin = useCallback((email?: string) => {
    if (typeof email === 'string') setDefaultLoginEmail(email)
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
      closeModals()
    },
    [closeModals],
  )

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      await authService.register(data)
    },
    [],
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
        defaultLoginEmail,
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
