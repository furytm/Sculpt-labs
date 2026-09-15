'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeading, QuickLink, SectionCard, StatCard, StateNotice, StatusBadge, Table, useAdminSidebar } from './components'
import { loadAdminDashboard } from './data'
import { displayValue, formatAdminDate, fullName, membershipName, type AdminResource } from './types'
import { formatTime, getAdminBookings, type AdminDashboardData, type AdminRecentBooking, type UpcomingScheduleItem } from '@/lib/api/booking'
import { confirmOfflinePayment, deleteAdminBooking, rejectOfflinePayment } from './types'

export default function AdminPage({ view }: { view: string }) {
  if (view === 'dashboard') return <Dashboard />
  if (view === 'bookings') return <BookingsPage />
  return <ResourcePage view={view} />
}

const WEEKDAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function dayLabel(value: string) {
  const match = WEEKDAY_ORDER.find(day => day.toUpperCase() === String(value || '').toUpperCase())
  return match || displayValue(value)
}

function bookingSchedules(booking: AdminRecentBooking) {
  const schedules = (booking.memberSchedules || []).map(item => item.schedule).filter(Boolean)
  if (schedules.length) return schedules
  return booking.schedule ? [booking.schedule] : []
}

function Dashboard() {
  const [dashboard, setDashboard] = useState<AdminResource<AdminDashboardData>>({ state: 'loading' })
  const [selectedBooking, setSelectedBooking] = useState<AdminRecentBooking | null>(null)
  const { closeSidebar } = useAdminSidebar()
  useEffect(() => { loadAdminDashboard().then(setDashboard) }, [])
  useEffect(() => {
    if (!selectedBooking) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedBooking(null) }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = '' }
  }, [selectedBooking])

  const ready = dashboard.state === 'ready' && dashboard.data ? dashboard.data : null
  const stats = ready?.stats
  const recent = ready?.recentBookings || []
  const upcoming = groupUpcoming(ready?.upcomingSchedule || [])

  const statValue = (value: number | undefined) => (ready ? String(value ?? 0) : dashboard.state === 'loading' ? 'Loading…' : 'Unavailable')

  return (
    <>
      <PageHeading eyebrow="Studio overview" title="Good morning, admin." description="A live view of Sculpt LAB operations, powered by the admin dashboard service." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Total members" value={statValue(stats?.totalMembers)} />
        <StatCard label="Active memberships" value={statValue(stats?.activeMemberships)} />
        <StatCard label="Pending bookings" value={statValue(stats?.pendingBookings)} />
        <StatCard label="Confirmed bookings" value={statValue(stats?.confirmedBookings)} />
        <StatCard label="Paid bookings" value={statValue(stats?.paidBookings)} />
        <StatCard label="Pending payments" value={statValue(stats?.pendingPayments)} />
        <StatCard label="Offline payments" value={statValue(stats?.offlinePayments)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <SectionCard title="Recent bookings" action={<Link href="/admin/bookings" className="text-base text-accent hover:underline">View all</Link>}>
          {dashboard.state === 'ready'
            ? recent.length
              ? <RecentBookingsTable bookings={recent} onDetails={booking => { closeSidebar(); setSelectedBooking(booking) }} onChanged={() => loadAdminDashboard().then(setDashboard)} />
              : <StateNotice state="empty" />
            : <StateNotice state={dashboard.state === 'loading' ? 'loading' : 'error'} message={dashboard.message} />}
        </SectionCard>
        <SectionCard title="Upcoming schedule">
          {dashboard.state === 'ready'
            ? upcoming.length
              ? <div className="space-y-5">{upcoming.map(group => (
                  <div key={group.day}>
                    <p className="text-sm font-medium text-primary">{group.day}</p>
                    <div className="mt-3 space-y-2">{group.times.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-base">
                        <span className="text-foreground">{formatTime(item.startTime)} – {formatTime(item.endTime)}</span>
                        <span className="text-muted-foreground">{displayValue(item.className)}{item.tutorName ? ` · ${item.tutorName}` : ''}</span>
                      </div>
                    ))}</div>
                  </div>
                ))}</div>
              : <StateNotice state="empty" />
            : <StateNotice state={dashboard.state === 'loading' ? 'loading' : 'error'} message={dashboard.message} />}
        </SectionCard>
      </div>

      {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <SectionCard title="Pending actions">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4"><span>Pending payments</span><StatusBadge value={ready ? String(stats?.pendingPayments ?? 0) : 'Unavailable'} /></div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-4"><span>Offline payments</span><StatusBadge value={ready ? String(stats?.offlinePayments ?? 0) : 'Unavailable'} /></div>
          </div>
        </SectionCard>
        <SectionCard title="Quick actions">
          <div className="flex flex-wrap gap-3">
            <QuickLink href="/admin/members" label="View members" />
            <QuickLink href="/admin/bookings" label="View bookings" />
            <QuickLink href="/admin/schedule" label="View schedule" />
            <QuickLink href="/admin/memberships" label="View memberships" />
            <QuickLink href="/admin/payments" label="View payments" />
          </div>
        </SectionCard>
      </div>
    </>
  )
}

function groupUpcoming(items: UpcomingScheduleItem[]) {
  return WEEKDAY_ORDER
    .map(day => ({ day, times: items.filter(item => String(item.dayOfWeek || '').toUpperCase() === day.toUpperCase()) }))
    .filter(group => group.times.length)
}

function BookingActions({ booking, onDetails, onChanged }: { booking: AdminRecentBooking; onDetails: () => void; onChanged: () => void }) {
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const [dialog, setDialog] = useState<'delete' | 'confirm' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  const paymentMethod = String((booking as { paymentMethod?: string }).paymentMethod || '').toUpperCase()
  const paymentStatus = String(booking.paymentStatus || '').toUpperCase()
  const offlinePending = paymentMethod === 'OFFLINE' && paymentStatus === 'PENDING'

  async function runAction() {
    setBusy(true)
    try {
      if (dialog === 'delete') await deleteAdminBooking(booking.id)
      if (dialog === 'confirm') await confirmOfflinePayment(booking.id)
      if (dialog === 'reject') await rejectOfflinePayment(booking.id, reason)
      setDialog(null); setOpen(false); setReason(''); onChanged()
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to complete this action.')
    } finally { setBusy(false) }
  }

  return <div className="relative flex justify-end gap-2 whitespace-nowrap">
    {offlinePending && <><button type="button" disabled={busy} onClick={() => setDialog('confirm')} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs text-primary-foreground disabled:opacity-50">Confirm payment</button><button type="button" disabled={busy} onClick={() => setDialog('reject')} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary disabled:opacity-50">Reject</button></>}
    <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} className="rounded-lg border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-secondary">Actions</button>
    {open && <div className="absolute right-0 top-9 z-20 min-w-36 rounded-xl border border-border bg-white p-1 shadow-xl"><button type="button" onClick={() => { setOpen(false); onDetails() }} className="block w-full rounded-lg px-3 py-2 text-left text-xs hover:bg-secondary">View details</button><button type="button" onClick={() => { setOpen(false); setDialog('delete') }} className="block w-full rounded-lg px-3 py-2 text-left text-xs text-red-700 hover:bg-red-50">Delete booking</button></div>}
    {dialog && <div className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/35 p-4" role="presentation"><section role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 text-foreground shadow-2xl"><h2 className="font-serif text-2xl text-primary">{dialog === 'delete' ? 'Delete booking?' : dialog === 'confirm' ? 'Confirm offline payment?' : 'Reject offline payment?'}</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{dialog === 'delete' ? 'This permanently removes the booking. The user account and membership will not be deleted.' : dialog === 'confirm' ? 'This confirms that the customer’s offline payment was received.' : 'Optionally provide a reason for rejecting this payment.'}</p>{dialog === 'reject' && <textarea value={reason} onChange={event => setReason(event.target.value)} className="mt-4 min-h-24 w-full rounded-xl border border-border p-3 text-sm" placeholder="Rejection reason (optional)" />}
      <div className="mt-6 flex justify-end gap-3"><button type="button" disabled={busy} onClick={() => setDialog(null)} className="rounded-xl border border-border px-4 py-2 text-sm">Cancel</button><button type="button" disabled={busy} onClick={runAction} className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">{busy ? 'Processing…' : dialog === 'delete' ? 'Delete booking' : dialog === 'confirm' ? 'Confirm payment' : 'Reject payment'}</button></div></section></div>}
  </div>
}

function RecentBookingsTable({ bookings, onDetails, onChanged }: { bookings: AdminRecentBooking[]; onDetails: (booking: AdminRecentBooking) => void; onChanged: () => void }) {
  const columns = ['Member', 'Membership', 'Class', 'Payment', 'Booking', 'Created', 'Actions']
  const rows = bookings.map(booking => {
    const schedules = bookingSchedules(booking)
    return [
      <span className="font-medium">{fullName(booking)}</span>,
      <span>{membershipName(booking.membership)}</span>,
      <span>{displayValue(schedules[0]?.className ?? booking.classId)}</span>,
      <StatusBadge value={booking.paymentStatus} />,
      <StatusBadge value={booking.bookingStatus} />,
      <span>{formatAdminDate(booking.createdAt)}</span>,
      <BookingActions booking={booking} onDetails={() => onDetails(booking)} onChanged={onChanged} />,
    ]
  })
  return <Table columns={columns} rows={rows} />
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</dt><dd className="mt-1 text-foreground">{value}</dd></div>
}

function BookingDetails({ booking, schedules }: { booking: AdminRecentBooking; schedules: { className?: string | null; dayOfWeek?: string; startTime?: string; endTime?: string; tutorName?: string | null }[] }) {
  const startDate = booking.memberSchedules?.find(item => item.startDate)?.startDate ?? booking.bookingDate
  const healthDone = Boolean(booking.healthSafetyForm?.submittedAt || booking.healthSafetyForm?.createdAt || booking.healthSafetyForm?.id)
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <dl className="grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <DetailRow label="Member" value={fullName(booking)} />
        <DetailRow label="Email" value={displayValue(booking.email)} />
        <DetailRow label="Phone" value={displayValue(booking.phone)} />
        <DetailRow label="Membership" value={membershipName(booking.membership)} />
        <DetailRow label="Class" value={displayValue(schedules[0]?.className ?? booking.classId)} />
        <DetailRow label="Start date" value={formatAdminDate(startDate)} />
        <DetailRow label="Payment status" value={<StatusBadge value={booking.paymentStatus} />} />
        <DetailRow label="Payment method" value={displayValue((booking as { paymentMethod?: string }).paymentMethod)} />
        <DetailRow label="Booking status" value={<StatusBadge value={booking.bookingStatus} />} />
        <DetailRow label="Booking reference" value={displayValue(booking.paymentReference)} />
        <DetailRow label="Booking ID" value={displayValue(booking.id)} />
        <DetailRow label="Health & Safety" value={healthDone ? 'Completed' : 'Not submitted'} />
        <DetailRow label="Created" value={formatAdminDate(booking.createdAt)} />
      </dl>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Recurring schedules</p>
        {schedules.length
          ? <ul className="mt-2 space-y-1.5 text-sm text-foreground">{schedules.map((item, index) => (
              <li key={index}>{dayLabel(item.dayOfWeek || '')} — {formatTime(item.startTime)} – {formatTime(item.endTime)}{item.tutorName ? ` · ${item.tutorName}` : ''}</li>
            ))}</ul>
          : <p className="mt-2 text-sm text-muted-foreground">Not available</p>}
      </div>
    </div>
  )
}

function BookingDetailsModal({ booking, onClose }: { booking: AdminRecentBooking; onClose: () => void }) {
  const schedules = bookingSchedules(booking)
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/35 p-4 sm:p-6" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section role="dialog" aria-modal="true" aria-labelledby="booking-details-title" className="max-h-[min(42rem,calc(100vh-2rem))] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-white p-5 text-foreground shadow-2xl sm:p-7">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.16em] text-accent">Booking record</p><h2 id="booking-details-title" className="mt-2 font-serif text-3xl text-primary">Booking details</h2></div><button type="button" onClick={onClose} aria-label="Close booking details" className="rounded-xl border border-border bg-white p-2.5 text-foreground shadow-sm hover:bg-secondary" ><XIcon /></button></div>
      <div className="mt-6"><BookingDetails booking={booking} schedules={schedules} /></div>
    </section>
  </div>
}

function XIcon() { return <span aria-hidden="true" className="text-2xl leading-none">×</span> }

function BookingsPage() {
  const [resource, setResource] = useState<AdminResource<AdminRecentBooking[]>>({ state: 'loading' })
  const [selectedBooking, setSelectedBooking] = useState<AdminRecentBooking | null>(null)
  useEffect(() => { getAdminBookings().then(bookings => setResource({ state: bookings.length ? 'ready' : 'empty', data: bookings })).catch(error => setResource({ state: 'error', message: error instanceof Error ? error.message : 'Unable to load bookings.' })) }, [])
  useEffect(() => {
    if (!selectedBooking) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedBooking(null) }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.style.overflow = '' }
  }, [selectedBooking])

  const bookings = resource.data || []
  return <>
    <PageHeading eyebrow="Studio operations" title="Bookings" description="Review all bookings and inspect their member, payment, and recurring schedule details." />
    <SectionCard title="All bookings">
      {resource.state === 'loading' && <StateNotice state="loading" />}
      {resource.state === 'empty' && <StateNotice state="empty" />}
      {resource.state === 'error' && <StateNotice state="error" message={resource.message} />}
      {resource.state === 'ready' && <AllBookingsTable bookings={bookings} onDetails={setSelectedBooking} onChanged={() => getAdminBookings().then(next => setResource({ state: next.length ? 'ready' : 'empty', data: next }))} />}
    </SectionCard>
    {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
  </>
}

function AllBookingsTable({ bookings, onDetails, onChanged }: { bookings: AdminRecentBooking[]; onDetails: (booking: AdminRecentBooking) => void; onChanged: () => void }) {
  const columns = ['Member', 'Email', 'Phone', 'Membership', 'Class', 'Payment', 'Method', 'Booking', 'Start date', 'Reference', 'Created', 'Actions']
  const rows = bookings.map(booking => {
    const schedules = bookingSchedules(booking)
    return [
      <span className="font-medium">{fullName(booking)}</span>,
      <span>{displayValue(booking.email)}</span>,
      <span>{displayValue(booking.phone)}</span>,
      <span>{membershipName(booking.membership)}</span>,
      <span>{displayValue(schedules[0]?.className ?? booking.classId)}</span>,
      <StatusBadge value={booking.paymentStatus} />,
      <span>{displayValue((booking as { paymentMethod?: string }).paymentMethod)}</span>,
      <StatusBadge value={booking.bookingStatus} />,
      <span>{formatAdminDate(booking.memberSchedules?.find(item => item.startDate)?.startDate ?? booking.bookingDate)}</span>,
      <span>{displayValue(booking.paymentReference)}</span>,
      <span>{formatAdminDate(booking.createdAt)}</span>,
      <BookingActions booking={booking} onDetails={() => onDetails(booking)} onChanged={onChanged} />,
    ]
  })
  return <div className="overflow-x-auto"><Table columns={columns} rows={rows} /></div>
}

function ResourcePage({ view }: { view: string }) { const config: Record<string, { title: string; eyebrow: string; description: string; endpoint: string }> = { members: { title: 'Members', eyebrow: 'Studio people', description: 'Member management will appear here when the protected admin members endpoint is available.', endpoint: '/api/admin/members' }, bookings: { title: 'Bookings', eyebrow: 'Studio operations', description: 'Review bookings returned by the existing member bookings endpoint. Admin-only actions remain unavailable until backend support exists.', endpoint: '/api/bookings/my' }, schedule: { title: 'Schedule', eyebrow: 'Weekly timetable', description: 'The weekly timetable will use verified schedule data only. Create, edit, and delete are intentionally disabled.', endpoint: '/api/admin/schedule' }, memberships: { title: 'Memberships', eyebrow: 'Commerce', description: 'Browse membership plans from the existing memberships endpoint. Management actions are read-only for this MVP.', endpoint: '/api/memberships' }, payments: { title: 'Payments', eyebrow: 'Commerce', description: 'Payment records and offline verification require protected admin payment endpoints.', endpoint: '/api/admin/payments' }, 'health-safety': { title: 'Health & Safety', eyebrow: 'Studio safety', description: 'Health & Safety records are admin-only and will appear when the protected endpoint is available.', endpoint: '/api/admin/health-safety' } }; const item = config[view] || config.members; return <><PageHeading eyebrow={item.eyebrow} title={item.title} description={item.description} /><SectionCard title={item.title}><StateNotice state={view === 'bookings' || view === 'memberships' ? 'loading' : 'unavailable'} message={view === 'bookings' || view === 'memberships' ? 'This view is wired to the existing API and will render its verified records here.' : `Waiting for ${item.endpoint}. No mock records or actions are shown.`} /></SectionCard></> }
