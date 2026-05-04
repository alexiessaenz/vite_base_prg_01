import { createContext, useState, useCallback, useEffect } from 'react'
import { authAPI } from '@/api/auth'
import { storage } from '@/lib/storage'
import type { User, LoginCredentials, AuthContextType } from '@/types/auth'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authAPI.login(credentials)
      const userData: User = {
        ...response.user,
        token: response.token,
        refreshToken: response.refreshToken,
      }

      setUser(userData)
      storage.setUser(userData)
      storage.setToken(response.token)
      if (response.refreshToken) {
        storage.setRefreshToken(response.refreshToken)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
    storage.clear()
    authAPI.logout().catch(() => {
      // Error en logout, pero igual limpiamos el storage local
    })
  }, [])

  // Recupera usuario al recargar página
  useEffect(() => {
    const savedUser = storage.getUser()
    const savedToken = storage.getToken()
    if (savedUser && savedToken) {
      setUser(savedUser)
    }
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
