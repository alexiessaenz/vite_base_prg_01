const AUTH_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export const storage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },
  
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  
  setRefreshToken: (token: string) => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },
  
  getUser: () => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
  },
  
  setUser: (user: unknown) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  
  clear: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}
