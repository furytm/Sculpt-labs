'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { attachBookingAccount, confirmBooking, continueGuestBooking, formatTime, getBookingByReference, getClassSchedules, saveHealthDeclaration, updateBookingSchedule, updateBookingStartDate, type Booking, type Schedule } from '@/lib/api/booking'
import { useAuth } from '@/src/components/AuthProvider'

 type Step = 'health' | 'slot' | 'date' | 'account' | 'confirmed'

function messageFor(error: unknown, fallback: string) {
  return error instanceof Error && error.message && error.message !== 'Failed to fetch' && !/prisma|stack|database|internal/i.test(error.message) ? error.message : fallback
}

function BookingCompleteContent() {
  const router = useRouter()
  const params = useSearchParams()
  const reference = params.get('reference')?.trim() || ''
  const { user, loading: authLoading } = useAuth()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [token, setToken] = useState('')
  const flowStorageKey = 'sculpt-booking-flow'
  const [step, setStep] = useState<Step>('health')
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [startDate, setStartDate] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [notes, setNotes] = useState('')
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<'ready' | 'error' | 'confirmed'>('ready')

  const isPrivate = (booking?.membership?.type || '').toUpperCase() === 'PRIVATE'
  const steps = useMemo(() => isPrivate ? ['health', 'date', 'account'] as Step[] : ['health', 'slot', 'date', 'account'] as Step[], [isPrivate])

  const load = useCallback(async () => {
    if (!reference) { setError('Your booking reference is missing.'); setStatus('error'); setLoading(false); return }
    let flow: { bookingId?: string; bookingFlowToken?: string; reference?: string } | null = null
    try {
      const stored = sessionStorage.getItem(flowStorageKey)
      flow = stored ? JSON.parse(stored) as { bookingId?: string; bookingFlowToken?: string; reference?: string } : null
    } catch {
      sessionStorage.removeItem(flowStorageKey)
    }
    setToken(flow?.reference === reference ? flow.bookingFlowToken || '' : '')
    setLoading(true); setError('')
    try {
      const result = await getBookingByReference(reference)
      const nextBooking = result.booking || (result as unknown as { data?: { booking?: Booking } }).data?.booking
      if (!nextBooking) throw new Error('Booking not found.')
      setBooking(nextBooking)

      let nextToken = flow?.reference === reference ? flow.bookingFlowToken || '' : ''
      if (!nextToken) {
        const continuation = await continueGuestBooking(reference)
        nextToken = continuation.bookingFlowToken
      }
      if (!nextToken) throw new Error('Your booking session could not be started.')
      sessionStorage.setItem(flowStorageKey, JSON.stringify({ bookingId: nextBooking.id, bookingFlowToken: nextToken, reference }))
      setToken(nextToken)
      setSelectedSchedule(result.selectedSchedule || nextBooking.schedule || null)
      setStartDate(nextBooking.preferredStartDate || nextBooking.bookingDate || '')
      if (nextBooking.paymentStatus !== 'PAID') { setError('Payment has not been completed for this booking.'); setStatus('error'); return }
      if (nextBooking.bookingStatus === 'CONFIRMED') { setStatus('confirmed'); setStep('confirmed'); return }
      setAccepted(Boolean(nextBooking.healthSafetyForm?.accepted))
      setNotes(nextBooking.healthSafetyForm?.notes || '')
      if (nextBooking.healthSafetyForm?.accepted) {
        if (nextBooking.membership?.type?.toUpperCase() !== 'PRIVATE' && !nextBooking.scheduleId) setStep('slot')
        else if (!nextBooking.preferredStartDate && !nextBooking.bookingDate) setStep('date')
        else setStep('account')
      } else setStep('health')
      if (nextBooking.classId && nextBooking.membership?.type?.toUpperCase() !== 'PRIVATE') {
        setSchedules(await getClassSchedules(nextBooking.classId))
      }
    } catch (cause) {
      setError(messageFor(cause, 'We could not find this booking. Please check the reference and try again.')); setStatus('error')
    } finally { setLoading(false) }
  }, [reference])

  useEffect(() => { void load() }, [load])

  async function continueStep() {
    if (!booking) return
    setBusy(true); setError('')
    try {
      if (step === 'health') {
        if (!accepted) throw new Error('Please accept the health declaration to continue.')
        await saveHealthDeclaration(booking.id, { bookingFlowToken: token, accepted, notes })
      } else if (step === 'slot') {
        if (!selectedSchedule) throw new Error('Please select a slot before continuing.')
        await updateBookingSchedule(booking.id, { bookingFlowToken: token, scheduleId: selectedSchedule.id })
      } else if (step === 'date') {
        const today = new Date().toISOString().slice(0, 10)
        if (!startDate || startDate < today) throw new Error('Choose a start date that is today or later.')
        await updateBookingStartDate(booking.id, { bookingFlowToken: token, startDate })
      } else if (step === 'account') {
        if (!token) throw new Error('Your booking session has expired. Please return to the confirmation page.')
        await attachBookingAccount(booking.id, { bookingFlowToken: token })
        await confirmBooking(booking.id, token)
        sessionStorage.removeItem(flowStorageKey)
        router.replace('/dashboard'); return
      }
      await load()
    } catch (cause) { setError(messageFor(cause, step === 'health' ? 'Unable to save your health declaration.' : step === 'date' ? 'Unable to save your start date.' : 'Unable to continue your booking.')) } finally { setBusy(false) }
  }

  function goBack() {
    const index = steps.indexOf(step)
    if (index > 0) setStep(steps[index - 1])
    else router.push(`/confirmation?reference=${encodeURIComponent(reference)}`)
  }

  if (loading || authLoading) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading booking...</main>
  if (status === 'error') return <main className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="font-serif text-4xl text-primary">Unable to continue</h1><p className="mt-4 text-muted-foreground">{error}</p><div className="mt-8 flex justify-center gap-3"><button onClick={() => void load()} className="bg-primary px-5 py-3 text-primary-foreground">Retry</button><button onClick={() => router.push('/classes')} className="border border-border px-5 py-3 text-primary">Return to Classes</button></div></main>
  if (status === 'confirmed') return <main className="mx-auto max-w-xl px-6 py-24 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20"><Check className="text-accent" /></div><h1 className="mt-6 font-serif text-4xl text-primary">Your booking is already confirmed.</h1><p className="mt-4 text-muted-foreground">{booking?.membership?.name || 'Your Sculpt LAB booking'} is ready in your member dashboard.</p><button onClick={() => router.push('/dashboard')} className="mt-8 bg-primary px-5 py-3 text-primary-foreground">Go to Dashboard</button></main>

  const stepIndex = steps.indexOf(step)
  return <main className="min-h-[75vh] bg-muted/20 px-4 py-12 sm:px-6"><div className="mx-auto max-w-2xl"><p className="text-xs uppercase tracking-[0.24em] text-accent">Sculpt LAB booking</p><h1 className="mt-3 font-serif text-5xl text-primary">Complete your booking</h1><p className="mt-3 text-muted-foreground">Your class and payment are secured. Finish these details before we attach the booking to your account.</p><div className="my-8 flex items-center gap-2" aria-label="Booking progress">{steps.map((item, index) => <div key={item} className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs ${index <= stepIndex ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'}`}>{index < stepIndex ? <Check className="h-4 w-4" /> : index + 1}</span>{index < steps.length - 1 && <span className="h-px w-8 bg-border sm:w-16" />}</div>)}</div>
    <section className="border border-border bg-background p-6 sm:p-8">
      {step === 'health' && <div className="space-y-8"><div><h2 className="font-serif text-3xl text-primary">Health Declaration</h2><p className="mt-3 leading-6 text-muted-foreground">Before taking part in a Sculpt LAB session, please read and confirm the following.</p></div><div className="space-y-5 border border-border bg-muted/20 p-5 text-sm leading-7 text-primary sm:p-6"><p>I confirm that I am physically able to participate in Pilates and exercise activities and that I am not aware of any health condition, injury or physical limitation that would make exercise unsafe for me without appropriate medical advice.</p><p>I agree to inform my instructor before my session if I:</p><ul className="list-disc space-y-2 pl-5"><li>am pregnant or recently postpartum;</li><li>have an injury, ongoing pain or physical limitation;</li><li>have recently had surgery or am undergoing rehabilitation;</li><li>have a heart, respiratory or other medical condition that may affect exercise;</li><li>have been advised by a healthcare professional to restrict or avoid exercise; or</li><li>experience any significant change in my health.</li></ul><p>I understand that I should exercise within my own abilities and immediately inform my instructor if I experience pain, dizziness, chest discomfort, unusual shortness of breath or feel unwell during a session.</p></div><div className="space-y-4"><h3 className="font-serif text-2xl text-primary">Your confirmation</h3><label className="flex cursor-pointer gap-3 text-sm leading-6 text-primary"><input type="checkbox" checked={accepted} onChange={event => { setAccepted(event.target.checked); setError('') }} className="mt-1 h-5 w-5 shrink-0 accent-primary" /> <span>I have read and understood the Health Declaration and confirm that I can participate safely, or that I have informed Sculpt LAB of any relevant health information.</span></label></div><div><label className="block text-sm text-primary" htmlFor="health-notes">Do you have anything we should know before your session? <span className="text-muted-foreground">Optional</span></label><textarea id="health-notes" value={notes} onChange={event => setNotes(event.target.value)} className="mt-2 min-h-32 w-full border border-border bg-background px-4 py-3 text-foreground" placeholder="Please share anything you would like your instructor to know before your session." /></div></div>}
      {step === 'slot' && <div className="space-y-6"><h2 className="font-serif text-3xl text-primary">Select Your Slot</h2><p className="text-muted-foreground">Choose a schedule for {booking?.membership?.name || 'your purchased class'}.</p>{schedules.length ? <div className="grid gap-3">{schedules.map(item => <button key={item.id} type="button" onClick={() => setSelectedSchedule(item)} className={`border p-4 text-left ${selectedSchedule?.id === item.id ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="font-medium text-primary">{item.dayOfWeek}</span><span className="mt-1 block text-sm text-muted-foreground">{formatTime(item.startTime)} – {formatTime(item.endTime)}{item.tutorName ? ` · ${item.tutorName}` : ''}</span>{typeof item.availableSlots === 'number' && <span className="mt-1 block text-xs text-muted-foreground">{item.availableSlots} spaces available</span>}</button>)}</div> : <p className="border border-border p-5 text-muted-foreground">No available slots are currently available for this class.</p>}</div>}
      {step === 'date' && <div className="space-y-6"><h2 className="font-serif text-3xl text-primary">Choose Start Date</h2><p className="text-muted-foreground">Choose the date you would like your membership to begin.</p><label className="block text-sm text-primary">Start date<input type="date" min={new Date().toISOString().slice(0, 10)} value={startDate} onChange={event => setStartDate(event.target.value)} className="mt-2 w-full border border-border bg-background px-4 py-3" /></label></div>}
      {step === 'account' && <div className="space-y-6"><h2 className="font-serif text-3xl text-primary">{user ? `You’re signed in as ${user.email}` : 'Create Your SCULPT LAB Account'}</h2><p className="leading-6 text-muted-foreground">{user ? 'Complete your booking to activate it in your dashboard.' : 'Your booking is ready. Choose how you would like to finish setting up your account.'}</p>{!user && <div className="grid gap-3"><button onClick={() => router.push(`/register?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(booking?.email || '')}`)} className="bg-primary px-5 py-3 text-primary-foreground">Create an Account</button><button onClick={() => router.push(`/login?reference=${encodeURIComponent(reference)}&email=${encodeURIComponent(booking?.email || '')}`)} className="border border-primary px-5 py-3 text-primary">I Already Have an Account</button><button onClick={() => { window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'https://sculpt-backend-6flc.onrender.com'}/api/auth/google?reference=${encodeURIComponent(reference)}` }} className="border border-border px-5 py-3 text-primary">Continue with Google</button></div>}</div>}
      {error && <p role="alert" className="mt-5 rounded bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <div className="mt-8 flex justify-between gap-3"><button type="button" onClick={goBack} className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm text-primary"><ArrowLeft className="h-4 w-4" />Back</button>{step !== 'account' || user ? <button type="button" disabled={busy || (step === 'slot' && !selectedSchedule) || (step === 'health' && !accepted)} onClick={() => void continueStep()} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-50">{busy ? 'Saving…' : user && step === 'account' ? 'Complete Booking' : 'Continue'}<ArrowRight className="h-4 w-4" /></button> : null}</div>
    </section></div></main>
}

export default function BookingCompletePage() {
  return <Suspense fallback={<main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading booking...</main>}><BookingCompleteContent /></Suspense>
}
