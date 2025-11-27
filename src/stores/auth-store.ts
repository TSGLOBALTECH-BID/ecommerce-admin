import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, Session, authService, handleApiResponse } from '@/lib/api'


type AuthState = {
  user: User | null
  session: Session | null
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
      session: null,
      isAuthenticated: false,
      isLoading: false,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const { user, session } = await handleApiResponse(
            authService.login({ email, password })
          );

          set({ user, session, isAuthenticated: true });
        } catch (error) {
          console.error('Login error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true });
          await handleApiResponse(authService.logout());
          set({ user: null, session: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          throw error;
        } finally {
          set({ isLoading: false });
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