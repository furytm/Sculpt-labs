'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { CalendarDays, CreditCard, HeartPulse, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useAuth } from './AuthProvider'

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard?view=membership', label: 'My Membership', icon: CreditCard },
  { href: '/dashboard?view=bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/dashboard?view=profile', label: 'Profile', icon: UserRound },
  { href: '/studio-guidelines', label: 'Health & Safety', icon: HeartPulse },
]

export default function MemberShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const { logout } = useAuth(); const [open, setOpen] = useState(false)
  const isActive = (href: string) => { const [path, query] = href.split('?'); if (pathname !== path) return false; if (!query) return true; return new URLSearchParams(window.location.search).get('view') === new URLSearchParams(query).get('view') }
  async function signOut() { await logout(); router.replace('/login') }
  return <div className="min-h-screen bg-background text-foreground"><aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card p-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-center justify-between"><Link href="/" aria-label="Sculpt LAB home"><Image src="/logo.png" alt="Sculpt LAB Logo" width={76} height={76} className="object-contain" priority /></Link><button aria-label="Close navigation" onClick={() => setOpen(false)} className="p-2 text-muted-foreground lg:hidden"><X className="size-5" /></button></div><p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-accent">Member space</p><nav className="mt-10 space-y-2">{links.map(({ href, label, icon: Icon }) => <Link key={label} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive(href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-4" />{label}</Link>)}</nav><button onClick={signOut} className="absolute inset-x-6 bottom-6 flex items-center gap-3 border-t border-border px-3 pt-5 text-sm text-muted-foreground hover:text-primary"><LogOut className="size-4" />Sign out</button></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-20 items-center border-b border-border bg-background/95 px-4 backdrop-blur"><button aria-label="Open navigation" onClick={() => setOpen(true)} className="p-2 text-primary lg:hidden"><Menu className="size-5" /></button><div className="mx-auto flex h-20 items-center justify-center"><Link href="/" aria-label="Sculpt LAB home" className="flex items-center"><Image src="/logo.png" alt="Sculpt LAB Logo" width={80} height={80} className="object-contain" priority /></Link></div><span className="w-9 lg:hidden" /></header><main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">{children}</main></div>{open && <button aria-label="Close navigation overlay" onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-primary/20 lg:hidden" />}</div>
}
