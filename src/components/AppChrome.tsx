'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import MemberShell from './MemberShell'
import { AdminGuard, AdminShell } from '@/src/admin/components'
import { useAuth } from './AuthProvider'

const memberPrefixes = ['/dashboard']

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  if (pathname.startsWith('/admin')) return pathname === '/admin/login' ? children : <AdminGuard><AdminShell>{children}</AdminShell></AdminGuard>

  const isMemberRoute = memberPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
  if (!loading && user && isMemberRoute) return <MemberShell>{children}</MemberShell>

  return <><Header /><main>{children}</main><Footer /></>
}
