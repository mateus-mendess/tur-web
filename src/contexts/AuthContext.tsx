import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { authService } from '#/services/authService'
import type { AuthUser } from '#/services/authService'
import type { LoginFormData, SignUpFormData } from '#/schemas/authSchema'
import { storage, TOKEN_STORAGE_KEY } from '#/lib/storage'
import { decodeJwt, isTokenExpired } from '#/lib/jwt'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isInitializing: boolean
  isLoginOpen: boolean
  isSignUpOpen: boolean
  isCreateSpotOpen: boolean
  openLogin: (defaultEmail?: string) => void
  openSignUp: () => void
  openCreateSpot: () => void
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
  const [isCreateSpotOpen, setCreateSpotOpen] = useState(false)
  const [defaultLoginEmail, setDefaultLoginEmail] = useState('')

  // Carrega o token inicial de forma segura no client (evita mismatch de hidratação)
  useEffect(() => {
    const storedToken = storage.getItem(TOKEN_STORAGE_KEY)
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        storage.removeItem(TOKEN_STORAGE_KEY)
      } else {
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
    }
    setIsInitializing(false)
  }, [])


  const openLogin = useCallback((email?: string) => {
    if (typeof email === 'string') setDefaultLoginEmail(email)
    setLoginOpen(true)
    setSignUpOpen(false)
  }, [])

  const openSignUp = useCallback(() => {
    setSignUpOpen(true)
    setLoginOpen(false)
    setCreateSpotOpen(false)
  }, [])

  const openCreateSpot = useCallback(() => {
    setCreateSpotOpen(true)
    setLoginOpen(false)
    setSignUpOpen(false)
  }, [])

  const closeModals = useCallback(() => {
    setLoginOpen(false)
    setSignUpOpen(false)
    setCreateSpotOpen(false)
  }, [])

  const handleLogin = useCallback(
    async (data: LoginFormData) => {
      const response = await authService.login(data)
      setUser(response.user)
      setToken(response.token)
      storage.setItem(TOKEN_STORAGE_KEY, response.token)
      closeModals()
    },
    [closeModals],
  )

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      const response = await authService.register(data)
      setUser(response.user)
      setToken(response.token)
      storage.setItem(TOKEN_STORAGE_KEY, response.token)
      closeModals()
    },
    [closeModals],
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    storage.removeItem(TOKEN_STORAGE_KEY)
    void authService.logout()
    window.location.href = '/'
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
        isCreateSpotOpen,
        openLogin,
        openSignUp,
        openCreateSpot,
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
