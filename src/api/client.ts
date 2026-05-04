import axios from 'axios'
import { storage } from '@/lib/storage'

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token a cada request
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor para manejar 401 (token expirado)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = storage.getRefreshToken()
        if (!refreshToken) {
          storage.clear()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // Intenta refrescar el token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/auth/refresh`,
          { refreshToken }
        )

        const { token } = response.data
        storage.setToken(token)

        // Reintenta la solicitud original
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        storage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)
