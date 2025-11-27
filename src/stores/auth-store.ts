import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  setLoading: (isLoading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true })
          // TODO: Replace with your actual login API
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const user = await response.json()
          set({ user, isAuthenticated: true })
        } catch (error) {
          console.error('Login error:', error)
          throw error
        } finally {
          set({ isLoading: false })
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true })
          await fetch('/api/auth/logout', { method: 'POST' })
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Initialize the store
export const initializeAuth = async () => {
  const { setLoading } = useAuthStore.getState()
  try {
    setLoading(true)
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      const user = await response.json()
      useAuthStore.setState({ user, isAuthenticated: true })
    }
  } catch (error) {
    console.error('Auth initialization error:', error)
  } finally {
    setLoading(false)
  }
}