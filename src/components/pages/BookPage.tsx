'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Edit3, Loader2 } from 'lucide-react'
import Hero from '../Hero'
import { API_BASE_URL, createBooking } from '@/lib/api/booking'

interface Membership {
  id: string
  name: string
  description?: string
  price: number
  priceNGN: number
  period?: string
  classLimit?: number | null
  features?: string[]
  autoRenew?: boolean
  highlighted?: boolean
  badge?: string
}

type BookingForm = { membershipId: string; name: string; email: string; phone: string }
const emptyForm: BookingForm = { membershipId: '', name: '', email: '', phone: '' }

export default function BookPage() {
  const searchParams = useSearchParams()
  const bookingType = (searchParams.get('type') || 'GROUP').toUpperCase()
  const queryMembershipId = searchParams.get('membershipId') || ''
  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<BookingForm>({ ...emptyForm, membershipId: queryMembershipId })
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function fetchMemberships() {
      setStatus('loading')
      try {
        const response = await fetch(`${API_BASE_URL}/api/memberships?type=${encodeURIComponent(bookingType)}`)
        const body = await response.text()
        let result: { data?: Membership[]; message?: string }
        try { result = JSON.parse(body) } catch { throw new Error(`Membership API returned ${response.status} ${response.statusText} instead of JSON.`) }
        if (!response.ok) throw new Error(result.message || 'Unable to load memberships.')
        const nextMemberships = (result.data || []).map((membership) => ({ ...membership, id: membership.id || (membership as any)._id, priceNGN: membership.price }))
        setMemberships(nextMemberships)
        setStatus(nextMemberships.length ? 'ready' : 'empty')
      } catch (error) {
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load memberships.')
      }
    }
    fetchMemberships()
  }, [bookingType])

  const selectedMembership = memberships.find((membership) => membership.id === formData.membershipId)
  const isContactComplete = Boolean(formData.name.trim() && formData.email.trim() && formData.phone.trim())
  const total = selectedMembership?.priceNGN || 0
  const updateField = (name: keyof BookingForm, value: string) => setFormData((current) => ({ ...current, [name]: value }))

  const handleProceedToPayment = async () => {
    if (!selectedMembership || !isContactComplete) return
    setIsProcessing(true)
    try {
      const response = await createBooking({ fullName: formData.name, email: formData.email, phone: formData.phone, membershipId: selectedMembership.id })
      const authorizationUrl = response.data.authorizationUrl
      if (response.success && authorizationUrl) {
        const paymentWindow = window.open(authorizationUrl, '_blank', 'noopener,noreferrer')
        if (!paymentWindow) alert('Please allow popups to continue to payment.')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred. Please try again.')
    } finally { setIsProcessing(false) }
  }

  const inputClass = 'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'
  const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'
  const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary transition hover:bg-primary/5'

  return <div className="w-full min-h-screen"><Hero title="Book Your Session" subtitle="Choose your Sculpt LAB membership, then complete your details" imageSrc="/images/hero-book.png" imageAlt="Book a Pilates session" /><div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center"><p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">{bookingType === 'PRIVATE' ? 'Private sessions' : 'Group classes'}</p><h1 className="hero-text text-primary">Book in two easy steps</h1><p className="body-text mx-auto mt-4 max-w-xl text-lg text-foreground/70">Select a membership, then share your contact details before payment.</p></motion.div><div className="mx-auto mb-10 flex max-w-xl items-center justify-center gap-3 sm:gap-5" aria-label="Booking progress">{[{ number: 1, label: 'Membership' }, { number: 2, label: 'Contact & Review' }].map((item, index) => <div key={item.number} className="flex flex-1 items-center gap-3 sm:gap-5"><button type="button" onClick={() => item.number === 1 && setStep(1)} className="flex items-center gap-2 text-left" aria-current={step === item.number ? 'step' : undefined}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg transition ${step >= item.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>{step > item.number ? <Check className="h-5 w-5" /> : item.number}</span><span className={`hidden text-sm font-medium sm:block ${step >= item.number ? 'text-primary' : 'text-muted-foreground'}`}>{item.label}</span></button>{index === 0 && <div className={`h-px flex-1 transition ${step === 2 ? 'bg-primary' : 'bg-border'}`} />}</div>)}</div><motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>{step === 1 ? <section className="glassmorphism rounded-xl p-6 sm:p-8" aria-labelledby="membership-title"><div className="mb-8"><p className="mb-2 text-sm text-foreground/60">Step 1</p><h2 id="membership-title" className="font-serif text-3xl font-medium text-primary">Choose your membership</h2></div>{status === 'loading' ? <div className="flex items-center gap-2 rounded-lg border border-border p-5 text-foreground/70"><Loader2 className="h-4 w-4 animate-spin" /> Loading memberships...</div> : status === 'error' ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{errorMessage}</div> : status === 'empty' ? <div className="rounded-lg border border-border p-5 text-foreground/70">No memberships are available for this booking type yet.</div> : <div className="grid gap-4 sm:grid-cols-2">{memberships.map((membership) => <label key={membership.id} className={`cursor-pointer rounded-lg border-2 p-5 transition ${formData.membershipId === membership.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}><input type="radio" name="membershipId" value={membership.id} checked={formData.membershipId === membership.id} onChange={(event) => updateField('membershipId', event.target.value)} className="sr-only" /><span className="block font-medium text-primary">{membership.name}</span><span className="mt-2 block font-serif text-2xl text-primary">₦{membership.priceNGN.toLocaleString()}</span>{membership.period ? <span className="mt-1 block text-xs uppercase tracking-wide text-foreground/50">{membership.period}</span> : null}{membership.description ? <span className="mt-3 block text-sm leading-6 text-foreground/70">{membership.description}</span> : null}<span className="mt-4 block text-xs font-medium text-primary">{membership.autoRenew ? 'Auto-renews · cancel anytime' : 'One-time payment'}</span></label>)}</div>}<div className="mt-8 flex justify-end border-t border-border pt-6"><button type="button" onClick={() => setStep(2)} disabled={!selectedMembership || status !== 'ready'} className={buttonClass}>Continue to contact details <ArrowRight className="h-4 w-4" /></button></div></section> : <section className="glassmorphism rounded-xl p-6 sm:p-8" aria-labelledby="contact-review-title"><div className="mb-8"><p className="mb-2 text-sm text-foreground/60">Step 2</p><h2 id="contact-review-title" className="font-serif text-3xl font-medium text-primary">Contact & review</h2><p className="mt-2 text-foreground/70">We&apos;ll use these details to confirm your booking.</p></div><div className="space-y-5"><div><label htmlFor="name" className="mb-2 block font-medium text-primary">Full name</label><input id="name" value={formData.name} onChange={(event) => updateField('name', event.target.value)} className={inputClass} placeholder="Your full name" autoComplete="name" /></div><div><label htmlFor="email" className="mb-2 block font-medium text-primary">Email address</label><input id="email" type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className={inputClass} placeholder="you@example.com" autoComplete="email" /></div><div><label htmlFor="phone" className="mb-2 block font-medium text-primary">Phone number</label><input id="phone" type="tel" value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className={inputClass} placeholder="+234 XXX XXX XXXX" autoComplete="tel" /></div></div><div className="mt-8 rounded-lg border border-border bg-muted/20 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-serif text-xl font-medium text-primary">Booking review</h3><button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4"><Edit3 className="h-3.5 w-3.5" /> Edit membership</button></div><div className="grid gap-3 text-sm sm:grid-cols-2"><ReviewLine label="Type" value={bookingType === 'PRIVATE' ? 'Private session' : 'Group class'} /><ReviewLine label="Membership" value={selectedMembership?.name || 'Not selected'} /></div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="font-medium text-primary">Total price</span><span className="font-serif text-2xl font-medium text-primary">₦{total.toLocaleString()}</span></div></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep(1)} className={secondaryButtonClass}><ArrowLeft className="h-4 w-4" /> Back to membership</button><button type="button" onClick={handleProceedToPayment} disabled={!isContactComplete || isProcessing} className={buttonClass}>{isProcessing ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</> : <>Pay now <ArrowRight className="h-4 w-4" /></>}</button></div></section>}</motion.div></div></div>
}

function ReviewLine({ label, value }: { label: string; value: string }) { return <div><dt className="text-foreground/60">{label}</dt><dd className="mt-1 font-medium text-primary">{value}</dd></div> }
