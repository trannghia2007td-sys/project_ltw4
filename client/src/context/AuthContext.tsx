import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export type AuthUser = {
  id: string
  username: string
  role: 'customer' | 'admin'
}

type AuthContextType = {
  user: AuthUser | null
  loginSuccess: (user: AuthUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getSavedUser(): AuthUser | null {
  try {
    const savedUser = localStorage.getItem('bookhaven-user')
    return savedUser ? JSON.parse(savedUser) as AuthUser : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(getSavedUser)

  function loginSuccess(userData: AuthUser, token: string) {
    localStorage.setItem('bookhaven-token', token)
    localStorage.setItem('bookhaven-user', JSON.stringify(userData))
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('bookhaven-token')
    localStorage.removeItem('bookhaven-user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider')
  }

  return context
}