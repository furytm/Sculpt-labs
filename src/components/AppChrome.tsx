'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import MemberShell from './MemberShell'
import { AdminGuard, AdminShell } from '@/src/admin/components'

const memberPrefixes = ['/dashboard', '/book', '/memberships']

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return pathname === '/admin/login' ? children : <AdminGuard><AdminShell>{children}</AdminShell></AdminGuard>
  if (memberPrefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))) return <MemberShell>{children}</MemberShell>
  return <><Header /><main>{children}</main><Footer /></>
}
