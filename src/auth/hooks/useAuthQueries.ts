import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { authAPI } from '@/api/auth'
import { storage } from '@/lib/storage'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

// Query: Obtener usuario actual
export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authAPI.getMe(),
    enabled: !!storage.getToken(), // Solo si hay token
    staleTime: 1000 * 60 * 30, // 30 minutos
    retry: false, // No reintentar si el token es inválido
  })
}

// Mutation: Login
export function useLoginMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<LoginResponse> => {
      return authAPI.login(credentials)
    },
    onSuccess: (data) => {
      // Guardar tokens y usuario
      storage.setToken(data.token)
      if (data.refreshToken) {
        storage.setRefreshToken(data.refreshToken)
      }
      storage.setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        token: data.token,
        refreshToken: data.refreshToken,
      })

      // Invalidar queries para refetch automático
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

// Mutation: Logout
export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authAPI.logout().catch(() => {
      // No falla aunque el endpoint tenga error
    }),
    onSuccess: () => {
      storage.clear()
      // Limpiar cache de queries
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
    onError: () => {
      // Aunque falle el logout en el backend, limpiamos localmente
      storage.clear()
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
    onSettled: () => {
      // Siempre limpiar al terminar
      storage.clear()
      queryClient.removeQueries({ queryKey: authKeys.all })
    },
  })
}

// Mutation: Refresh Token
export function useRefreshTokenMutation() {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      return authAPI.refresh(refreshToken)
    },
    onSuccess: (data) => {
      storage.setToken(data.token)
      if (data.refreshToken) {
        storage.setRefreshToken(data.refreshToken)
      }
    },
  })
}
