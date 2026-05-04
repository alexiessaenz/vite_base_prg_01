export interface User {
  id: string
  email: string
  name?: string
  token: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: Omit<User, 'token'>
  token: string
  refreshToken?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}
