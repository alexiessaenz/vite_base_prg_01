import { useContext } from 'react'
import { AuthContext } from '@/auth/context'
import type { AuthContextType } from '@/types/auth'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}
