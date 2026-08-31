'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, CreditCard, LayoutDashboard, LogOut, Menu, UserRound } from 'lucide-react'
import { authApi, clearAuthSession, getAccessToken } from '@/lib/api/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) { router.replace('/login'); return }
    authApi.me(token).then((result) => setUser(result.user || result.data?.user || result.data)).catch(() => { clearAuthSession(); router.replace('/login') }).finally(() => setLoading(false))
  }, [router])

  if (loading) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your member space…</main>
  return <main className="min-h-[75vh] bg-muted/20 px-4 py-8 sm:px-6 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-accent">Member dashboard</p><h1 className="mt-2 font-serif text-4xl text-primary">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1><p className="mt-2 text-muted-foreground">Your Sculpt LAB practice, all in one place.</p></div><button onClick={() => { clearAuthSession(); router.replace('/login') }} className="hidden items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground/70 hover:text-primary sm:flex"><LogOut className="h-4 w-4" /> Log out</button></div>
      <div className="grid gap-5 md:grid-cols-3"><article className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-accent/15 p-3 text-accent"><CreditCard className="h-5 w-5" /></span><span className="text-xs uppercase tracking-wider text-muted-foreground">Membership</span></div><h2 className="font-serif text-2xl text-primary">Your membership</h2><p className="mt-2 text-sm text-muted-foreground">No active membership linked yet.</p><button onClick={() => router.push('/memberships')} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">Explore memberships</button></article><article className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-accent/15 p-3 text-accent"><CalendarDays className="h-5 w-5" /></span><span className="text-xs uppercase tracking-wider text-muted-foreground">Next session</span></div><h2 className="font-serif text-2xl text-primary">Nothing scheduled</h2><p className="mt-2 text-sm text-muted-foreground">Your upcoming sessions will appear here.</p><button onClick={() => router.push('/book?type=GROUP')} className="mt-6 rounded-lg border border-primary px-4 py-2 text-sm text-primary">Book a session</button></article><article className="rounded-2xl border border-border bg-card p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><span className="rounded-full bg-accent/15 p-3 text-accent"><UserRound className="h-5 w-5" /></span><span className="text-xs uppercase tracking-wider text-muted-foreground">Profile</span></div><h2 className="font-serif text-2xl text-primary">{user?.email || 'Your details'}</h2><p className="mt-2 text-sm text-muted-foreground">Keep your contact information current with the studio.</p></article></div>
      <nav aria-label="Member navigation" className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-border bg-background/95 p-3 backdrop-blur sm:hidden"><button className="flex flex-col items-center gap-1 text-xs text-primary"><LayoutDashboard className="h-5 w-5" />Home</button><button onClick={() => router.push('/book?type=GROUP')} className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="h-5 w-5" />Book</button><button onClick={() => { clearAuthSession(); router.replace('/login') }} className="flex flex-col items-center gap-1 text-xs text-muted-foreground"><Menu className="h-5 w-5" />Menu</button></nav>
    </div>
  </main>
}
