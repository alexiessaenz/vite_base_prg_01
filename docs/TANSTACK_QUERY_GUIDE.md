# TanStack Query Integration - Guía de Uso

## 📋 Configuración Base

TanStack Query está configurado en:
- **QueryClient**: [src/lib/queryClient.ts](src/lib/queryClient.ts)
- **Provider**: [src/main.tsx](src/main.tsx) (envuelve la app)

## 🔐 Hooks de Autenticación con TanStack Query

### Disponibles en [src/auth/hooks/useAuthQueries.ts](src/auth/hooks/useAuthQueries.ts):

```typescript
// Para login
const loginMutation = useLoginMutation()
await loginMutation.mutateAsync({ email, password })

// Para logout
const logoutMutation = useLogoutMutation()
logoutMutation.mutate()

// Para obtener usuario actual
const { data: user, isLoading } = useGetMe()

// Para refrescar token
const refreshMutation = useRefreshTokenMutation()
```

## 📝 Ejemplo: Crear una Query Personalizada

```typescript
// src/api/users.ts
import { apiClient } from './client'

export const usersAPI = {
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data
  },
  
  updateProfile: async (userId: string, data: any) => {
    const response = await apiClient.put(`/users/${userId}`, data)
    return response.data
  },
}

// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '@/api/users'

// Query Keys
const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
}

// Query
export function useGetProfile(userId: string) {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => usersAPI.getProfile(userId),
  })
}

// Mutation
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      usersAPI.updateProfile(userId, data),
    onSuccess: (data, { userId }) => {
      // Invalida la query para refetch automático
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
    },
  })
}

// Uso en componente
export function ProfileComponent({ userId }: { userId: string }) {
  const { data: profile, isLoading } = useGetProfile(userId)
  const updateMutation = useUpdateProfileMutation()

  const handleSave = async (newData: any) => {
    await updateMutation.mutateAsync({ userId, data: newData })
  }

  if (isLoading) return <div>Cargando...</div>

  return (
    <div>
      <h1>{profile.name}</h1>
      <button onClick={() => handleSave({ name: 'New Name' })}>
        {updateMutation.isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  )
}
```

## 🎯 Patrones Comunes

### Invalidar múltiples queries
```typescript
queryClient.invalidateQueries({ 
  queryKey: ['users'] // Invalida todas las queries que empiezan con 'users'
})
```

### Query con parámetros opcionales
```typescript
export function useGetUsers(filters?: any) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersAPI.getUsers(filters),
    enabled: !!filters, // Solo ejecuta si hay filtros
  })
}
```

### Mutation con callbacks
```typescript
const mutation = useMutation({
  mutationFn: (data) => api.create(data),
  onPending: () => console.log('Enviando...'),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['items'] })
    toast.success('Creado exitosamente')
  },
  onError: (error) => {
    toast.error(error.message)
  },
})
```

### Reset de mutation state
```typescript
mutation.reset() // Limpia error y datos previos
```

## 🔄 Ciclo de Vida

1. **pending** - Esperando respuesta
2. **success** - Datos recibidos
3. **error** - Error en la petición

```typescript
const { 
  data,           // Datos retornados
  isLoading,      // true mientras carga
  isPending,      // true mientras la mutación está en vuelo
  error,          // Error si falla
  isError,        // true si hay error
} = useQuery(...)
```

## 📊 DevTools (Opcional)

Para debug en desarrollo, instala:
```bash
npm install @tanstack/react-query-devtools
```

Y úsalos en App.tsx:
```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function App() {
  return (
    <>
      {/* tu app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

## ⚙️ Configuración Actual

- **staleTime**: 5 minutos (data se considera "fresca")
- **gcTime** (antes cacheTime): 10 minutos (data se descarta)
- **retry**: 1 reinintento en errores
- **refetchOnWindowFocus**: false (no refetch al volver a la tab)

Personaliza en [src/lib/queryClient.ts](src/lib/queryClient.ts)

## 🔗 Links Útiles

- [Documentación oficial](https://tanstack.com/query/latest)
- [API Reference](https://tanstack.com/query/latest/docs/react/reference)
