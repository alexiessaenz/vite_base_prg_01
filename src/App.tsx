import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/auth/context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuth } from '@/auth/hooks/useAuth'
import { MeshGradient } from '@paper-design/shaders-react'
import { CardDemo } from './display/card'
import { Button } from './components/ui/button'

// Página de Login
function LoginPage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <MeshGradient
        className="h-full w-full"
        colors={['#000000', '#dc2626', '#ffffff', '#7f1d1d', '#ef4444']}
        speed={0.4}
        scale={1}
      >
        <div className="flex h-full w-full items-center justify-center">
          <LoginForm variant="glass" />
        </div>
      </MeshGradient>
    </div>
  )
}

// Dashboard protegido
function DashboardPage() {
  const { user, logout, loading } = useAuth()

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MeshGradient
        className="h-full w-full"
        colors={['#000000', '#dc2626', '#ffffff', '#7f1d1d', '#ef4444']}
        speed={0.4}
        scale={1}
      >
        <div className="flex h-full w-full max-w-full min-w-0 flex-col gap-4 p-6 text-sm leading-loose">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight drop-shadow-sm">
                Project ready!
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mb-4 leading-relaxed opacity-90">
                Bienvenido, {user?.name || user?.email}
              </p>
            </div>
            <Button
              onClick={logout}
              disabled={loading}
              className="rounded-md px-4 py-2  hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Cerrando...' : 'Logout'}
            </Button>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
          {/* <CardDemo /> */}
        </div>
      </MeshGradient>
    </div>
  )
}

// App con rutas
function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App