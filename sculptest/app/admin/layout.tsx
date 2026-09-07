'use client'

import { usePathname } from 'next/navigation'
import { AdminGuard, AdminShell } from '@/src/admin/components'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') return children
  return <AdminGuard><AdminShell>{children}</AdminShell></AdminGuard>
}
