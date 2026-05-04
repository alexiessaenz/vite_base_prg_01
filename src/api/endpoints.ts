const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const endpoints = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    refresh: `${API_BASE_URL}/auth/refresh`,
    me: `${API_BASE_URL}/auth/me`,
  },
}
