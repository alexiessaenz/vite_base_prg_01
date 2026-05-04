# Estructura de Autenticación - Guía

## 📁 Estructura Creada

```
src/
├── api/
│   ├── auth.ts           # Llamadas al backend
│   ├── client.ts         # Cliente axios con interceptores
│   └── endpoints.ts      # URLs configurables
├── auth/
│   ├── hooks/
│   │   └── useAuth.ts    # Hook para acceder al contexto
│   ├── context.tsx       # AuthContext + Provider
│   └── (tipos en src/types/auth.ts)
├── components/auth/
│   ├── LoginForm.tsx     # Formulario login reutilizable
│   └── ProtectedRoute.tsx # Guard para rutas privadas
├── types/
│   └── auth.ts           # TypeScript interfaces
└── lib/
    └── storage.ts        # Manejo de tokens en localStorage
```

## 🔑 Cómo Usar

### 1. Configurar Backend URL
Crea `.env.local` en la raíz del proyecto:
```
VITE_API_URL=http://localhost:3001/api
```

### 2. Envolver App con AuthProvider
En tu `main.tsx`:
```tsx
import { AuthProvider } from '@/auth/context'

ReactDOM.render(
  <AuthProvider>
    <App />
  </AuthProvider>,
  document.getElementById('root')
)
```

### 3. Usar el Hook en Componentes
```tsx
import { useAuth } from '@/auth/hooks/useAuth'

export function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Hola {user?.name}</p>}
    </div>
  )
}
```

### 4. Proteger Rutas
```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

### 5. Usar LoginForm
```tsx
import { LoginForm } from '@/components/auth/LoginForm'

<LoginForm variant="glass" /> {/* o "normal" */}
```

## 🚀 Flujo Automático

1. **Login**: El usuario se autentica → token se guarda en localStorage
2. **Persistencia**: Al recargar, el token se restaura automáticamente
3. **Refresh automático**: Si el token expira (401), se intenta refrescar con el refreshToken
4. **Logout**: Se limpia localStorage y se redirige a /login

## 📝 Backend Esperado

Tu backend debe responder así a `POST /auth/login`:
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..." // Opcional
}
```

Y tener estos endpoints:
- `POST /auth/login` - Autentica usuario
- `POST /auth/refresh` - Refresca token
- `POST /auth/logout` - Cierra sesión (opcional)
- `GET /auth/me` - Obtiene datos del usuario actual

## ✅ Qué está listo

- ✅ Cliente HTTP con axios
- ✅ Interceptores para token automático
- ✅ Manejo de sesión con localStorage
- ✅ Context API para estado global
- ✅ Hook reutilizable
- ✅ Guard para rutas privadas
- ✅ Componente LoginForm funcional
- ✅ Tipos TypeScript completos

## 📦 Card.tsx Reacomodado

Los componentes `card.tsx` y `cardNormal.tsx` han sido reemplazados por `LoginForm.tsx`, que ahora:
- Maneja estado local del formulario
- Se conecta con AuthContext
- Muestra errores dinámicamente
- Desactiva inputs mientras carga
- Soporta dos variantes visuales (glass/normal)
