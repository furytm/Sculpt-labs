'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import Hero from '@/src/components/Hero'
import { continueGuestBooking, getBookingByReference } from '@/lib/api/booking'

type ConfirmationBooking = { fullName?: string; email?: string; amount?: number; paymentReference?: string; paymentStatus?: string; membership?: { name?: string; type?: string; price?: number } }

function ConfirmationContent() {
  const router = useRouter(); const params = useSearchParams()
  const reference = params.get('reference') || params.get('transaction_id') || ''
  const [booking, setBooking] = useState<ConfirmationBooking | null>(null)
  const [error, setError] = useState(''); const [loading, setLoading] = useState(true)
  useEffect(() => { if (!reference) { setError('Your payment reference is missing.'); setLoading(false); return }; getBookingByReference(reference).then(result => { setBooking(result.booking as ConfirmationBooking) }).catch(() => setError('We could not load your payment confirmation. Please try again.')).finally(() => setLoading(false)) }, [reference])
  const paymentReference = booking?.paymentReference || reference
  async function continueBooking() {
    if (!paymentReference) return
    setLoading(true); setError('')
    try {
      const result = await continueGuestBooking(paymentReference)
      sessionStorage.setItem('sculpt-booking-flow', JSON.stringify({ bookingId: result.booking.id, bookingFlowToken: result.bookingFlowToken, reference: paymentReference }))
      router.push(`/booking/complete?reference=${encodeURIComponent(paymentReference)}`)
    } catch { setError('We could not start your booking completion. Please try again.') } finally { setLoading(false) }
  }
  return <div className="min-h-screen"><Hero title="Welcome to Sculpt Lab" subtitle="Your Pilates journey starts here" imageSrc="/images/hero-book.jpg" imageAlt="Sculpt Lab Pilates studio" /><div className="mx-auto max-w-3xl px-4 py-16 sm:px-6"><div className="glassmorphism p-8 text-center sm:p-12"><div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20"><Check className="h-8 w-8 text-accent" /></div><h2 className="mb-2 font-serif text-3xl font-medium text-primary">Payment Successful!</h2><p className="mb-8 text-lg text-foreground/70">Your Sculpt Lab membership has been purchased successfully.</p>{loading ? <p className="text-foreground/70"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading your payment confirmation...</p> : error ? <div><p className="text-destructive">{error}</p><button onClick={() => router.push('/classes')} className="mt-6 border border-primary px-5 py-3 text-primary">Return to Classes</button></div> : <><div className="mb-8 space-y-4 rounded-lg bg-muted/30 p-6 text-left"><div><p className="text-sm text-foreground/60">Payment Reference</p><p className="break-all font-serif text-xl font-medium text-primary">{paymentReference}</p></div><div className="space-y-3 border-t border-foreground/10 pt-4"><div><p className="text-sm text-foreground/60">Membership</p><p className="font-medium">{booking?.membership?.name || 'Membership'}</p></div>{booking?.membership?.type && <div><p className="text-sm text-foreground/60">Booking type</p><p className="font-medium">{booking.membership.type === 'PRIVATE' ? 'Private Session' : 'Group Classes'}</p></div>}{typeof (booking?.amount ?? booking?.membership?.price) === 'number' && <div><p className="text-sm text-foreground/60">Amount Paid</p><p className="font-medium">₦{(booking?.amount ?? booking?.membership?.price)?.toLocaleString()}</p></div>}{booking?.email && <div><p className="text-sm text-foreground/60">Email</p><p className="break-all font-medium">{booking.email}</p></div>}<div><p className="text-sm text-foreground/60">Payment Status</p><p className="font-medium text-accent">{booking?.paymentStatus === 'PAID' ? 'Paid' : booking?.paymentStatus || 'Processing'}</p></div></div></div><p className="mx-auto mb-8 max-w-md leading-7 text-foreground/80">Your payment is complete. Continue to your health declaration and finish your booking details.</p><button onClick={() => router.push(`/booking/complete?reference=${encodeURIComponent(paymentReference)}`)} className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground">Continue to Health Declaration</button></>}</div></div></div>
}

export default function ConfirmationPage() { return <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}><ConfirmationContent /></Suspense> }
