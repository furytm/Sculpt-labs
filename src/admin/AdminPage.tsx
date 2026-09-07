'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeading, SectionCard, StateNotice, StatCard, StatusBadge, Table, DisabledAction } from './components'
import { createResource, formatDateValue, formatValue, loadAdmin, loadDashboard, loadPendingPayments, moneyValue, recordClass, recordDate, recordId, recordName, recordStatus, updatePayment, type DashboardData, type PaymentRecord } from './data'
import type { AdminResource } from './types'

export default function AdminPage({ view }: { view: string }) {
  if (view === 'dashboard') return <Dashboard />
  if (view === 'payments') return <Payments />
  return <ResourcePage view={view} />
}

function Dashboard() {
  const [resource, setResource] = useState<AdminResource<DashboardData>>({ state: 'loading' })
  const load = () => { setResource({ state: 'loading' }); loadDashboard().then(data => setResource({ state: 'ready', data })).catch(error => setResource({ state: 'error', message: error instanceof Error ? error.message : 'Unable to load dashboard.' })) }
  useEffect(load, [])
  if (resource.state !== 'ready' || !resource.data) return <><PageHeading eyebrow="Studio overview" title="Dashboard" description="Live studio operations from the admin dashboard service." /><SectionCard title="Dashboard data"><StateNotice state={resource.state} message={resource.message} /><button type="button" onClick={load} className="mt-4 text-sm text-primary underline">Retry</button></SectionCard></>
  const { stats, recentBookings, upcomingSchedule } = resource.data
  const cards = [['Total members', stats.totalMembers], ['Active memberships', stats.activeMemberships], ['Pending bookings', stats.pendingBookings], ['Confirmed bookings', stats.confirmedBookings], ['Paid bookings', stats.paidBookings], ['Pending payments', stats.pendingPayments], ['Offline payments', stats.offlinePayments]]
  return <><PageHeading eyebrow="Studio overview" title="Dashboard" description="Live studio operations from the admin dashboard service." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <StatCard key={String(label)} label={String(label)} value={String(value)} />)}</div><div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]"><SectionCard title="Recent bookings" action={<Link href="/admin/bookings" className="text-sm text-accent hover:underline">View all</Link>}>{recentBookings.length ? <Table columns={['Member', 'Class', 'Status', 'Date']} rows={recentBookings.slice(0, 8).map(item => [recordName(item), recordClass(item), <StatusBadge key="status" value={recordStatus(item)} />, recordDate(item)])} /> : <StateNotice state="empty" />}</SectionCard><SectionCard title="Upcoming schedule">{upcomingSchedule.length ? <div className="space-y-3">{upcomingSchedule.slice(0, 8).map((item, index) => <div key={recordId(item) + index} className="border-b border-border pb-3 text-sm"><p className="font-medium text-primary">{recordClass(item)}</p><p className="mt-1 text-muted-foreground">{formatValue(item.date || item.dayOfWeek)} · {formatValue(item.startTime || item.time)}</p></div>)}</div> : <StateNotice state="empty" />}</SectionCard></div></>
}

function Payments() {
  const [resource, setResource] = useState<AdminResource<PaymentRecord[]>>({ state: 'loading' }); const [message, setMessage] = useState('')
  const load = () => { setMessage(''); setResource({ state: 'loading' }); createResource(loadPendingPayments()).then(setResource) }
  useEffect(load, [])
  async function act(id: string, action: 'confirm' | 'reject') { setMessage(''); try { await updatePayment(id, action); setMessage(`Payment ${action}ed successfully.`); load() } catch (error) { setMessage(error instanceof Error ? error.message : 'Payment update failed.') } }
  return <><PageHeading eyebrow="Commerce" title="Payments" description="Review pending payments returned by the protected admin payment service." />{message && <p role="status" className="mb-5 border border-border bg-card p-4 text-sm text-primary">{message}</p>}<SectionCard title="Pending payments">{resource.state === 'ready' && resource.data?.length ? <Table columns={['Member', 'Booking', 'Amount', 'Status', 'Actions']} rows={resource.data.map(item => { const id = recordId(item); return [recordName(item), id, moneyValue(item.amount ?? item.amountNGN ?? item.price), <StatusBadge key="status" value={recordStatus(item)} />, <div className="flex gap-2" key="actions"><button type="button" onClick={() => act(id, 'confirm')} className="rounded border border-primary px-3 py-2 text-xs text-primary">Confirm</button><button type="button" onClick={() => act(id, 'reject')} className="rounded border border-destructive px-3 py-2 text-xs text-destructive">Reject</button></div>] })} /> : <><StateNotice state={resource.state} message={resource.message} />{resource.state !== 'loading' && <button type="button" onClick={load} className="mt-4 text-sm text-primary underline">Retry</button>}</>}</SectionCard></>
}

function ResourcePage({ view }: { view: string }) { const config: Record<string, { title: string; eyebrow: string; endpoint: string }> = { members: { title: 'Members', eyebrow: 'Studio people', endpoint: '/api/admin/users' }, bookings: { title: 'Bookings', eyebrow: 'Studio operations', endpoint: '/api/bookings/my' }, schedule: { title: 'Schedule', eyebrow: 'Weekly timetable', endpoint: '/api/admin/schedule' }, memberships: { title: 'Memberships', eyebrow: 'Commerce', endpoint: '/api/memberships' }, 'health-safety': { title: 'Health & Safety', eyebrow: 'Studio safety', endpoint: '/api/admin/health-safety' } }; const item = config[view] || config.members; const [resource, setResource] = useState<AdminResource<unknown[]>>({ state: 'loading' }); useEffect(() => { loadAdmin(item.endpoint).then(setResource) }, [item.endpoint]); return <><PageHeading eyebrow={item.eyebrow} title={item.title} description={`Verified records from ${item.endpoint}.`} /><SectionCard title={item.title}>{resource.state === 'ready' && resource.data?.length ? <Table columns={['Record', 'Status', 'Date']} rows={resource.data.map((record, index) => [recordName(record), <StatusBadge key="status" value={recordStatus(record)} />, recordDate(record)])} /> : <StateNotice state={resource.state} message={resource.message} />}{view !== 'bookings' && view !== 'memberships' && <div className="mt-5"><DisabledAction label="Create or edit" /></div>}</SectionCard></> }
