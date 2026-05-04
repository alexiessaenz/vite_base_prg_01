import { apiClient } from './client'
import { endpoints } from './endpoints'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(endpoints.auth.login, credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post(endpoints.auth.logout)
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post(endpoints.auth.refresh, { refreshToken })
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get(endpoints.auth.me)
    return response.data
  },
}
