'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useState } from 'react'
import { Activity, CalendarDays, CreditCard, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X } from 'lucide-react'
import { useAuth } from '@/src/components/AuthProvider'
import { adminDisplayName, initials, isAdminRole, type AdminView, adminLabels, adminRoutes } from './types'

const icons = { dashboard: LayoutDashboard, members: Users, bookings: CalendarDays, schedule: CalendarDays, memberships: ShieldCheck, payments: CreditCard, 'health-safety': Activity } satisfies Record<AdminView, typeof LayoutDashboard>

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Checking admin access…</div>
  if (!user) { if (typeof window !== 'undefined') router.replace('/admin/login'); return null }
  if (!isAdminRole(user.role)) { if (typeof window !== 'undefined') router.replace('/dashboard'); return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><p className="text-xs uppercase tracking-[0.2em] text-accent">Access restricted</p><h1 className="mt-3 font-serif text-3xl text-primary">Admin access is required.</h1><p className="mt-2 text-sm text-muted-foreground">This account does not have permission to view the studio workspace.</p></div></div> }
  return <>{children}</>
}

type AdminSidebarContextValue = { closeSidebar: () => void }
const AdminSidebarContext = createContext<AdminSidebarContextValue>({ closeSidebar: () => {} })
export function useAdminSidebar() { return useContext(AdminSidebarContext) }

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  async function signOut() { await logout(); router.replace('/admin/login') }
  const views = ['dashboard', 'members', 'bookings', 'schedule', 'memberships', 'payments', 'health-safety'] as AdminView[]
  const closeSidebar = () => setOpen(false)

  return <AdminSidebarContext.Provider value={{ closeSidebar }}><div className="min-h-screen bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-1rem))] flex-col border-r border-border bg-white p-5 text-foreground shadow-xl transition-all duration-200 sm:p-6 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'} ${collapsed ? 'lg:w-20 lg:px-3' : ''}`}>
      <div className={`flex shrink-0 items-start gap-3 ${collapsed ? 'lg:justify-center' : 'justify-between'}`}><div className={collapsed ? 'lg:hidden' : ''}><p className="font-serif text-2xl tracking-[0.16em] text-primary">SCULPT LAB</p><p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-accent">Admin workspace</p></div><button aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'} onClick={() => setCollapsed(value => !value)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="size-5" /></button></div>
      <nav className={`mt-10 flex-1 space-y-2 overflow-y-auto pr-1 ${collapsed ? 'lg:mt-8' : ''}`} aria-label="Admin navigation">{views.map(view => { const Icon = icons[view]; const active = pathname === adminRoutes[view]; return <Link key={view} href={adminRoutes[view]} onClick={closeSidebar} title={collapsed ? adminLabels[view] : undefined} className={`flex min-h-12 items-center gap-3 rounded-xl px-3 py-3.5 text-sm transition-colors ${collapsed ? 'lg:justify-center lg:px-2' : ''} ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-5 shrink-0" /><span className={collapsed ? 'lg:hidden' : ''}>{adminLabels[view]}</span></Link> })}</nav>
      <div className={`mt-5 shrink-0 border-t border-border pt-5 ${collapsed ? 'lg:flex lg:justify-center' : ''}`}><div className={`mb-4 flex items-center gap-3 ${collapsed ? 'lg:mb-0' : ''}`}><div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-primary">{initials(user)}</div><div className={collapsed ? 'lg:hidden' : ''}><p className="truncate text-sm font-medium">{adminDisplayName(user)}</p><p className="text-xs text-muted-foreground">Administrator</p></div></div><button onClick={signOut} title={collapsed ? 'Sign out' : undefined} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 py-3 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground ${collapsed ? 'lg:hidden' : 'w-full'}`}><LogOut className="size-5" /> Sign out</button></div>
      <button aria-label="Close navigation" onClick={closeSidebar} className="mt-3 rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"><X className="size-5" /></button>
    </aside>
    {open && <button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={closeSidebar} />}
    <div className={`min-w-0 transition-[padding] duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-80'}`}><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8"><button aria-label="Open navigation" onClick={() => setOpen(true)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary lg:hidden"><Menu className="size-6" /></button><div className="text-xs uppercase tracking-[0.2em] text-muted-foreground lg:ml-0">Admin workspace</div><div className="text-xs text-muted-foreground">{adminDisplayName(user)}</div></header><main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">{children}</main></div>
  </div></AdminSidebarContext.Provider>
}

export function StateNotice({ state, message }: { state: 'loading' | 'empty' | 'unavailable' | 'error'; message?: string }) { const copy = state === 'loading' ? 'Loading verified data…' : state === 'empty' ? 'No records were returned by the existing API.' : message || (state === 'unavailable' ? 'This admin endpoint is not available yet. No data or action has been inferred.' : 'Unable to load this resource.'); return <div className="rounded-2xl border border-dashed border-border bg-card/60 p-8 text-center sm:p-10"><p className="text-sm font-medium text-foreground">{state === 'unavailable' ? 'Backend integration unavailable' : state === 'empty' ? 'No records yet' : state === 'error' ? 'Could not load data' : 'Loading'}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy}</p></div> }

export function StatusBadge({ value }: { value: unknown }) { const status = String(value || 'Not available'); const positive = ['PAID', 'CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(status.toUpperCase()); const negative = ['FAILED', 'CANCELLED', 'REJECTED'].includes(status.toUpperCase()); return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${positive ? 'bg-emerald-500/10 text-emerald-700' : negative ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'}`}>{status.replace(/_/g, ' ')}</span> }

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-8"><p className="text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p><h1 className="mt-2 text-balance font-serif text-4xl text-primary sm:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div> }
export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) { return <div className="rounded-xl border border-border bg-card p-5 sm:p-6"><p className="text-base text-muted-foreground">{label}</p><p className="mt-3 font-serif text-4xl text-primary">{value}</p>{note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}</div> }
export function Table({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) { return <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr>{columns.map(column => <th key={column} className="px-5 py-4 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map((row, index) => <tr key={index} className="hover:bg-secondary/30">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 align-top">{cell}</td>)}</tr>)}</tbody></table></div></div> }
export function QuickLink({ href, label }: { href: string; label: string }) { return <Link href={href} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary transition hover:border-accent hover:bg-secondary">{label}</Link> }
export function DisabledAction({ label = 'Unavailable' }: { label?: string }) { return <button disabled title="Unavailable until the backend endpoint exists." className="cursor-not-allowed rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground opacity-60">{label}</button> }
export function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-4 sm:p-5 md:p-6"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="font-serif text-2xl text-primary">{title}</h2>{action}</div>{children}</section> }
export const adminIcon = Activity

export { ChevronDown }
