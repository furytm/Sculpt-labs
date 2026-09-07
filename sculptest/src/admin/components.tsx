'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Activity, CalendarDays, ChevronDown, CreditCard, LayoutDashboard, LogOut, Menu, ShieldCheck, Users, X } from 'lucide-react'
import { useAuth } from '@/src/components/AuthProvider'
import { adminNavigation, adminDisplayName, initials, isAdminRole, type AdminView, adminLabels, adminRoutes } from './types'

const icons = { dashboard: LayoutDashboard, members: Users, bookings: CalendarDays, schedule: CalendarDays, memberships: ShieldCheck, payments: CreditCard, 'health-safety': Activity } satisfies Record<AdminView, typeof LayoutDashboard>

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const { user, loading } = useAuth()
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">Checking admin access…</div>
  if (!user) { if (typeof window !== 'undefined') router.replace('/admin/login'); return null }
  if (!isAdminRole(user.role)) { if (typeof window !== 'undefined') router.replace('/dashboard'); return <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><p className="text-xs uppercase tracking-[0.2em] text-accent">Access restricted</p><h1 className="mt-3 font-serif text-3xl text-primary">Admin access is required.</h1><p className="mt-2 text-sm text-muted-foreground">This account does not have permission to view the studio workspace.</p></div></div> }
  return <>{children}</>
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); const router = useRouter(); const { user, logout } = useAuth(); const [open, setOpen] = useState(false)
  async function signOut() { await logout(); router.replace('/admin/login') }
  return <div className="min-h-screen bg-background text-foreground"><aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-card p-6 transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}><div className="flex items-start justify-between"><div><p className="font-serif text-2xl tracking-[0.16em] text-primary">SCULPT LAB</p><p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-accent">Admin workspace</p></div><button aria-label="Close navigation" onClick={() => setOpen(false)} className="rounded-md p-2 text-muted-foreground lg:hidden"><X className="size-5" /></button></div><nav className="mt-12 space-y-7">{(['dashboard','members','bookings','schedule','memberships','payments','health-safety'] as AdminView[]).map((view) => { const Icon = icons[view]; const active = pathname === adminRoutes[view]; return <Link key={view} href={adminRoutes[view]} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}><Icon className="size-4" /><span>{adminLabels[view]}</span></Link> })}</nav><div className="absolute inset-x-6 bottom-6 border-t border-border pt-5"><div className="mb-4 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-medium text-primary">{initials(user)}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{adminDisplayName(user)}</p><p className="text-xs text-muted-foreground">Administrator</p></div></div><button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><LogOut className="size-4" /> Sign out</button></div></aside><div className="lg:pl-72"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur md:px-8"><button aria-label="Open navigation" onClick={() => setOpen(true)} className="rounded-md p-2 text-muted-foreground lg:hidden"><Menu className="size-5" /></button><div className="hidden text-sm text-muted-foreground lg:block">{adminNavigation().find((item) => item.href === pathname)?.label || 'Dashboard'}</div><div className="flex items-center gap-3 text-sm"><span className="hidden text-muted-foreground sm:block">{adminDisplayName(user)}</span><ChevronDown className="size-4 text-muted-foreground" /></div></header><main className="mx-auto max-w-7xl p-5 md:p-8">{children}</main></div></div>
}

export function StateNotice({ state, message }: { state: 'loading' | 'empty' | 'unavailable' | 'error'; message?: string }) { const copy = state === 'loading' ? 'Loading verified data…' : state === 'empty' ? 'No records were returned by the existing API.' : message || (state === 'unavailable' ? 'This admin endpoint is not available yet. No data or action has been inferred.' : 'Unable to load this resource.'); return <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center"><p className="text-sm font-medium text-foreground">{state === 'unavailable' ? 'Backend integration unavailable' : state === 'empty' ? 'No records yet' : state === 'error' ? 'Could not load data' : 'Loading'}</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{copy}</p></div> }

export function StatusBadge({ value }: { value: unknown }) { const status = String(value || 'Not available'); const positive = ['PAID','CONFIRMED','ACTIVE','COMPLETED'].includes(status.toUpperCase()); const negative = ['FAILED','CANCELLED','REJECTED'].includes(status.toUpperCase()); return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${positive ? 'bg-emerald-500/10 text-emerald-700' : negative ? 'bg-red-500/10 text-red-700' : 'bg-amber-500/10 text-amber-700'}`}>{status.replace(/_/g, ' ')}</span> }

export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-8"><p className="text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p><h1 className="mt-2 text-balance font-serif text-4xl text-primary md:text-5xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div> }

export function StatCard({ label, value, note }: { label: string; value: string; note?: string }) { return <div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-3 font-serif text-3xl text-primary">{value}</p>{note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}</div> }

export function Table({ columns, rows }: { columns: string[]; rows: React.ReactNode[][] }) { return <div className="overflow-hidden rounded-2xl border border-border bg-card"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-secondary/40 text-xs uppercase tracking-[0.12em] text-muted-foreground"><tr>{columns.map((column) => <th key={column} className="px-5 py-4 font-medium">{column}</th>)}</tr></thead><tbody className="divide-y divide-border">{rows.map((row, index) => <tr key={index} className="hover:bg-secondary/30">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 align-top">{cell}</td>)}</tr>)}</tbody></table></div></div> }

export function QuickLink({ href, label }: { href: string; label: string }) { return <Link href={href} className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-primary transition hover:border-accent hover:bg-secondary">{label}</Link> }

export function DisabledAction({ label = 'Unavailable' }: { label?: string }) { return <button disabled title="Unavailable until the backend endpoint exists." className="cursor-not-allowed rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground opacity-60">{label}</button> }

export function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) { return <section className="rounded-2xl border border-border bg-card p-5 md:p-6"><div className="mb-5 flex items-center justify-between gap-4"><h2 className="font-serif text-2xl text-primary">{title}</h2>{action}</div>{children}</section> }

export const adminIcon = Activity
