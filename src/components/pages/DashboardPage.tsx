'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import { ArrowRight, CheckCircle2, LogOut } from 'lucide-react'
import { useRequireAuth } from '@/src/components/AuthProvider'
import { getMyBookings, Booking } from '@/lib/api/booking'
import { getClassName } from '@/lib/data/classes'

type Tab = 'overview' | 'membership' | 'bookings' | 'profile'

function formatBookingDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

// function isUpcoming(booking: Booking) {
//   const date = new Date(booking.bookingDate)
//   return !Number.isNaN(date.getTime()) && date >= new Date()
// }

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-accent">{children}</p>
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading, logout } = useRequireAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [loggingOut, setLoggingOut] = useState(false)
  const { data: bookings, error, isLoading, mutate } = useSWR<Booking[]>(user ? 'member-bookings' : null, getMyBookings, { revalidateOnFocus: false })

  if (loading || !user) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your member space...</main>

const upcoming = (bookings || []).filter(
  (booking) =>
    booking.bookingStatus === "CONFIRMED"
)
const pendingBooking = bookings?.find(
  (booking) =>
    booking.paymentStatus === "PAID" &&
    booking.bookingStatus !== "CONFIRMED" &&
    Boolean(booking.classId)
)

const selectedClassId =
  pendingBooking?.classId

const selectedClassName =
  selectedClassId
    ? getClassName(selectedClassId)
    : null
  const membership = (user as typeof user & { membership?: { name?: string; status?: string } }).membership
  const membershipName = membership?.name || 'Membership details unavailable'
  const membershipStatus = membership?.status?.toUpperCase() === 'EXPIRED' ? 'EXPIRED' : 'ACTIVE'
  const firstName = (user.fullName || 'member').split(' ')[0]
  const tabLink = (value: Tab) => `border-b-2 px-1 pb-3 text-xs uppercase tracking-[0.16em] transition ${tab === value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-primary'}`
  const handleLogout = async () => {
    setLoggingOut(true)
    try { await logout() } finally { router.replace('/login'); setLoggingOut(false) }
  }

  return (
    <main className="min-h-[75vh] bg-muted/20 px-4 py-12 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-start justify-between gap-5">
          <div>
            <SectionLabel>Member dashboard</SectionLabel>
            <h1 className="mt-3 font-serif text-4xl text-primary sm:text-5xl">Welcome back, {firstName}</h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">Your next step is ready.</p>
          </div>
          <button type="button" aria-label="Log out" onClick={async () => { await logout(); router.replace('/login') }} className="mt-1 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground transition hover:text-primary"><LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span></button>
        </header>

        <div className="mb-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <Image src="/sculpt-dashboard-pilates.png" alt="Calm Sculpt LAB Pilates studio" width={1400} height={560} className="h-48 w-full object-cover sm:h-64" priority />
        </div>

        <nav className="mb-10 flex gap-5 overflow-x-auto border-b border-border" aria-label="Member navigation">
          <button type="button" className={tabLink('overview')} onClick={() => setTab('overview')}>Dashboard</button>
          <button type="button" className={tabLink('membership')} onClick={() => setTab('membership')}>My membership</button>
          <button type="button" className={tabLink('bookings')} onClick={() => setTab('bookings')}>My bookings</button>
          <button type="button" className={tabLink('profile')} onClick={() => setTab('profile')}>Profile</button>
        </nav>

        {tab === 'overview' && <div className="space-y-6">
          <section className="border border-border bg-background p-6 sm:p-8">
            <SectionLabel>Membership</SectionLabel>
            <div className="mt-7 flex items-end justify-between gap-4"><h2 className="font-serif text-3xl text-primary">{membershipName}</h2><span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent"><span className="h-2 w-2 rounded-full bg-accent" />{membershipStatus}</span></div>
            <button type="button" onClick={() => setTab('membership')} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">View membership <ArrowRight className="h-4 w-4" /></button>
          </section>

          <section className="border border-primary bg-background p-6 shadow-sm sm:p-8">
            <SectionLabel>Ready to book?</SectionLabel>
            {selectedClassName ? <><h2 className="mt-7 font-serif text-4xl text-primary">{selectedClassName}</h2><p className="mt-2 text-sm text-muted-foreground">Your selected class</p><Link href={`/book?classId=${encodeURIComponent(selectedClassId!)}`} className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Book {selectedClassName} <ArrowRight className="h-4 w-4" /></Link><div><Link href="/classes" className="mt-5 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline">Choose a different class</Link></div></> : <><h2 className="mt-7 font-serif text-3xl text-primary">Choose a class to get started.</h2><Link href="/classes" className="mt-7 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Choose a class <ArrowRight className="h-4 w-4" /></Link></>}
          </section>

        <section className="border-t border-border pt-7">
  <SectionLabel>Upcoming booking</SectionLabel>

  {isLoading ? (
    <p className="mt-5 text-sm text-muted-foreground">
      Loading your bookings...
    </p>
  ) : error ? (
    <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-destructive">
      <span>
        We couldn&apos;t load your bookings.
      </span>

      <button
        type="button"
        onClick={() => mutate()}
        className="underline"
      >
        Try again
      </button>
    </div>
  ) : upcoming.length === 0 ? (
    <p className="mt-5 text-sm text-muted-foreground">
      No upcoming bookings yet.
    </p>
  ) : (
    <div className="mt-5 border border-border bg-background p-5">
      <h2 className="font-serif text-2xl text-primary">
        {upcoming[0].classId
          ? getClassName(upcoming[0].classId)
          : 'Class not selected'}
      </h2>

      {upcoming[0].bookingDate && (
        <p className="mt-2 text-sm text-muted-foreground">
          {formatBookingDate(upcoming[0].bookingDate)}

          {upcoming[0].scheduleId
            ? ` · ${upcoming[0].scheduleId}`
            : ''}
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent">
        <span className="h-2 w-2 rounded-full bg-accent" />
        {upcoming[0].bookingStatus}
      </span>
    </div>
  )}
</section>

          <section className="border-t border-border pt-7"><SectionLabel>Quick actions</SectionLabel><div className="mt-5 grid gap-3 sm:grid-cols-3"><button type="button" onClick={() => setTab('membership')} className="border border-border bg-background px-4 py-4 text-left text-sm text-primary transition hover:border-primary">My Membership</button><button type="button" onClick={() => setTab('bookings')} className="border border-border bg-background px-4 py-4 text-left text-sm text-primary transition hover:border-primary">My Bookings</button><button type="button" onClick={() => setTab('profile')} className="border border-border bg-background px-4 py-4 text-left text-sm text-primary transition hover:border-primary">Profile</button></div></section>
        </div>}

        {tab === 'membership' && <section className="space-y-8"><div className="border border-border bg-background p-6 sm:p-8"><SectionLabel>Membership</SectionLabel><h2 className="mt-4 font-serif text-4xl text-primary">{membershipName}</h2><p className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-accent"><span className="h-2 w-2 rounded-full bg-accent" />{membershipStatus}</p></div><div><SectionLabel>Benefits</SectionLabel><p className="mt-4 text-sm leading-7 text-muted-foreground">Your membership includes access to Sculpt LAB classes and member booking support.</p></div><div className="flex flex-wrap gap-3"><button type="button" className="border border-primary px-4 py-3 text-sm text-primary">Upgrade Membership</button><button type="button" className="border border-border px-4 py-3 text-sm text-primary">Change Membership</button><button type="button" className="border border-border px-4 py-3 text-sm text-primary">Renew Membership</button></div></section>}

        {tab === 'bookings' && <section><SectionLabel>My bookings</SectionLabel><h2 className="mt-3 font-serif text-4xl text-primary">Booking history</h2><div className="mt-10"><SectionLabel>Upcoming bookings</SectionLabel>{upcoming.length ? <div className="mt-4 space-y-3">{upcoming.map((booking) => <BookingRow key={booking.id} booking={booking} />)}</div> : <p className="mt-4 text-sm text-muted-foreground">No upcoming bookings yet.</p>}</div><div className="mt-10"><SectionLabel>Past bookings</SectionLabel>{bookings?.filter(
  (booking) => booking.bookingStatus !== 'CONFIRMED'
).length ? (
  <div className="mt-4 space-y-3">
    {bookings
      .filter(
        (booking) =>
          booking.bookingStatus !== 'CONFIRMED'
      )
      .map((booking) => (
        <BookingRow
          key={booking.id}
          booking={booking}
        />
      ))}
  </div>
) : (
  <p className="mt-4 text-sm text-muted-foreground">
    No past bookings yet.
  </p>
)}</div></section>}

        {tab === 'profile' && <section><SectionLabel>Profile</SectionLabel><h2 className="mt-3 font-serif text-4xl text-primary">Your details</h2><div className="mt-10 space-y-8 border border-border bg-background p-6 sm:p-8"><div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Personal information</p><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-muted-foreground">Full name</dt><dd className="mt-1 text-primary">{user.fullName || 'Not provided'}</dd></div><div><dt className="text-muted-foreground">Email</dt><dd className="mt-1 text-primary">{user.email || 'Not provided'}</dd></div><div><dt className="text-muted-foreground">Phone</dt><dd className="mt-1 text-primary">{user.phone || 'Not provided'}</dd></div></dl></div><div className="border-t border-border pt-6"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Emergency contact</p><p className="mt-3 text-sm text-muted-foreground">No emergency contact on file.</p></div><div className="border-t border-border pt-6"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Change password</p><button type="button" className="mt-4 text-sm text-primary underline underline-offset-4">Request a password change</button></div><div className="border-t border-border pt-6"><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Account</p><button type="button" onClick={handleLogout} disabled={loggingOut} className="mt-4 inline-flex items-center gap-2 border border-primary px-4 py-3 text-sm text-primary transition hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60">{loggingOut ? 'Logging out…' : 'Log out'}</button></div></div></section>}
      </div>
    </main>
  )
}

function BookingRow({
  booking,
}: {
  booking: Booking
}) {
  return (
    <div className="flex flex-col gap-3 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-serif text-xl text-primary">
          {booking.classId
            ? getClassName(booking.classId)
            : 'Class not selected'}
        </h3>

        {booking.bookingDate && (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatBookingDate(
              booking.bookingDate
            )}

            {booking.scheduleId
              ? ` · ${booking.scheduleId}`
              : ''}
          </p>
        )}
      </div>

      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-accent">
        <CheckCircle2 className="h-4 w-4" />

        {booking.bookingStatus}
      </span>
    </div>
  )
}
