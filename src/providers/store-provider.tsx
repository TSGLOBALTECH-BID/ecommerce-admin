'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { initializeAuth, useAuthStore } from '@/stores/auth-store'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    // Initialize auth state
    initializeAuth()
  }, [])

  useEffect(() => {
    // Redirect unauthenticated users away from protected routes
    if (!isLoading && !isAuthenticated && !pathname.startsWith('/login')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, pathname, router])

  return <>{children}</>
}