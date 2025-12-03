// src/components/layout/client-layout.tsx
'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/dashboard/sidebar'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  return (
    <div className="flex h-screen bg-gray-50">
      {!isAuthPage && <Sidebar />}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}