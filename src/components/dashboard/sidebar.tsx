'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth-store'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { name: 'Products', href: '/dashboard/products', icon: 'package' },
  { name: 'Orders', href: '/dashboard/orders', icon: 'shopping-cart' },
  { name: 'Customers', href: '/dashboard/customers', icon: 'users' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuthStore()

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-md',
                  pathname === item.href
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start"
          >
            <span className="mr-3">logout</span>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}