import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

//   if (!isAuthenticated) { TODO: Cambiar a isAuthenticated para proteger rutas
//     return <Navigate to="/login" replace />
//   }

  return <>{children}</>
}
