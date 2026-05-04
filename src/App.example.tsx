import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/auth/context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LoginForm } from '@/components/auth/LoginForm'
import { MeshGradient } from '@paper-design/shaders-react'
import { CardDemo } from './display/card'

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

// Página protegida (Dashboard)
function DashboardPage() {
  const { user, logout } = require('@/auth/hooks/useAuth').useAuth()

  return (
    <div className="h-screen w-screen overflow-hidden">
      <MeshGradient
        className="h-full w-full"
        colors={['#000000', '#dc2626', '#ffffff', '#7f1d1d', '#ef4444']}
        speed={0.4}
        scale={1}
      >
        <div className="flex h-full w-full max-w-full min-w-0 flex-col gap-4 p-6 text-sm leading-loose">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 drop-shadow-sm">
                Project ready!
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed opacity-90">
                Bienvenido, {user?.name || user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <CardDemo />
        </div>
      </MeshGradient>
    </div>
  )
}

export function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  )
}

export default App
