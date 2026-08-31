'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { API_BASE_URL, getMyBookings } from '@/lib/api/booking'
import { getClassById } from '@/lib/data/classes'
import { useRequireAuth } from './AuthProvider'
import { toast } from '@/hooks/use-toast'


type Step = 'preferences' | 'health' | 'review'
type Answer = 'Yes' | 'No'
type Health = Record<string, string | boolean | string[]>

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const times = ['Morning', 'Afternoon', 'Evening']
const consents = ['The information I have provided is accurate and complete.', 'I have disclosed my injuries and medical conditions.', 'I will communicate changes in my health, pregnancy or injuries.', 'I will obtain medical clearance where required.', 'I will not participate if medically advised not to exercise.', 'I will tell my instructor about concerning symptoms.', 'I understand exercises may be modified or discontinued for safety.', 'This form does not replace professional medical advice.']
const screenings = ['Has a doctor or healthcare professional ever advised you not to exercise?', 'Do you currently have an injury, pain or physical limitation?', 'Do you experience unexplained chest pain or discomfort during exercise?', 'Do you experience dizziness, fainting or loss of balance?', 'Do you experience unusual shortness of breath during physical activity?', 'Do you have a diagnosed heart or cardiovascular condition?', 'Do you have high or low blood pressure?', 'Do you have asthma or another respiratory condition?', 'Do you have diabetes or blood sugar-related concerns?', 'Do you have osteoporosis or reduced bone density?', 'Do you have a neurological condition affecting movement, balance or coordination?', 'Do you have a joint, muscle, ligament or tendon condition?', 'Have you had surgery within the past 12 months?', 'Are you currently undergoing treatment or physical rehabilitation?', 'Are you currently taking medication that may affect your ability to exercise?']

export default function MemberBookingFlow() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useRequireAuth()
  const classId = params.get('classId') || ''
  const selectedClass = useMemo(() => getClassById(classId), [classId])
  const { data: bookings, isLoading } = useSWR('member-bookings-flow', getMyBookings)
  const booking = bookings?.find(item => item.paymentStatus === 'PAID' && item.classId === classId) ?? bookings?.find(item => item.paymentStatus === 'PAID')
  const [step, setStep] = useState<Step>('preferences')
  const [preferredStartDate, setPreferredStartDate] = useState('')
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [preferredTimes, setPreferredTimes] = useState<string[]>([])
const [health, setHealth] = useState<Health>({
  fullName: '',
  email: '',
  phone: '',
  pregnancy: '',
  postpartum: '',
  consent: [],
})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
  if (!user) return

  setHealth(current => ({
    ...current,
    fullName:
      current.fullName || user.fullName || '',
    email:
      current.email || user.email || '',
    phone:
      current.phone || user.phone || '',
  }))
}, [user])

  const set = (key: string, value: string | boolean | string[]) => setHealth(current => ({ ...current, [key]: value }))
  const answer = (key: string, value: Answer) => set(key, value)
  const toggle = (key: string, value: string) => set(key, ((health[key] as string[]) || []).includes(value) ? ((health[key] as string[]) || []).filter(item => item !== value) : [...((health[key] as string[]) || []), value])
  const field = (label: string, key: string, type = 'text') => <label className="block text-sm text-primary">{label}<input type={type} value={String(health[key] || '')} onChange={event => set(key, event.target.value)} className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground" /></label>
  const yesNo = (label: string, key: string) => <div><p className="text-sm leading-6 text-primary">{label}</p><div className="mt-2 flex gap-2">{(['Yes', 'No'] as Answer[]).map(value => <button type="button" key={value} onClick={() => answer(key, value)} className={`border px-4 py-2 text-sm ${health[key] === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-primary'}`}>{value}</button>)}</div></div>
const continueFlow = () => {
  setError('')

  if (step === 'preferences') {
    if (
      !preferredStartDate ||
      !availableDays.length ||
      !preferredTimes.length
    ) {
      return setError(
        'Please choose a preferred start date, available days, and preferred time.'
      )
    }

    setStep('health')
    return
  }

  if (step === 'health') {
    // Validate required health questions here

    setStep('review')
    return
  }
}

 const confirm = async () => {
    if (!selectedClass) {
    return setError('Please select a class before confirming your booking.')
  }
  if (!booking?.id) {
    return setError(
      'We could not find your paid booking. Please return to your dashboard.'
    )
  }

  setSaving(true)
  setError('')

  try {

      // Build screening answers
    const screeningAnswers = Object.fromEntries(
      screenings.map((_, index) => [
        `screening_${index}`,
        health[`screening_${index}`] || ''
      ])
    )

    // Build screening details
    const screeningDetails = Object.fromEntries(
      screenings
        .map((_, index) => [
          `screening_${index}_details`,
          health[`screening_${index}_details`] || ''
        ])
        .filter(([, value]) => value)
    )
    // ==========================================
    // 1. SAVE BOOKING PREFERENCES
    // ==========================================

    const preferencesResponse = await fetch(
      `${API_BASE_URL}/api/bookings/${booking.id}/preferences`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
     body: JSON.stringify({
  classId,

  preferredStartDate,

  availableDays: availableDays.map(day =>
    day.toUpperCase()
  ),

  preferredTimes: preferredTimes.map(time =>
    time.toUpperCase()
  ),
})
      }
    )

    const preferencesResult =
      await preferencesResponse
        .json()
        .catch(() => ({}))

    if (!preferencesResponse.ok) {
      throw new Error(
        preferencesResult.message ||
        'Unable to save your booking preferences.'
      )
    }

    // ==========================================
    // 2. SAVE HEALTH & SAFETY FORM
    // ==========================================

    const healthResponse = await fetch(
      `${API_BASE_URL}/api/bookings/${booking.id}/health-safety`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateOfBirth:
            health.dateOfBirth || undefined,

          age:
            health.age
              ? Number(health.age)
              : undefined,

          emergencyContactName:
            health.emergencyContactName ||
            undefined,

          emergencyContactRelationship:
            health.emergencyContactRelationship ||
            undefined,

          emergencyContactPhone:
            health.emergencyContactPhone ||
            undefined,

          pregnancy:
            health.pregnancy || undefined,

          pregnancyWeeks:
            health.pregnancyWeeks
              ? Number(health.pregnancyWeeks)
              : undefined,

          dueDate:
            health.dueDate || undefined,

          pregnancyClearance:
            health.pregnancyClearance ||
            undefined,

          postpartum:
            health.postpartum || undefined,

          deliveryDate:
            health.deliveryDate ||
            undefined,

          postpartumClearance:
            health.postpartumClearance ||
            undefined,

      // 👇 ADD THIS HERE
      screeningAnswers: {
        ...screeningAnswers,
        ...screeningDetails,
      },

          

          surgery:
            health.surgery || undefined,

          surgeryDetails:
            health.surgeryDetails ||
            undefined,

          surgeryClearance:
            health.surgeryClearance ||
            undefined,

          consent:
            health.consent || [],

          signature:
            health.signature || undefined,

        }),
      }
    )

    const healthResult =
      await healthResponse
        .json()
        .catch(() => ({}))

    if (!healthResponse.ok) {
      throw new Error(
        healthResult.message ||
        'Unable to save your Health & Safety information.'
      )
    }

    // ==========================================
    // 3. CONFIRM BOOKING
    // ==========================================

    const confirmResponse = await fetch(
      `${API_BASE_URL}/api/bookings/${booking.id}/confirm`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const confirmResult =
      await confirmResponse
        .json()
        .catch(() => ({}))

    if (!confirmResponse.ok) {
      throw new Error(
        confirmResult.message ||
        'Unable to confirm your booking.'
      )
    }

    // ==========================================
    // 4. RETURN TO DASHBOARD
    // ==========================================

toast({
  title: 'Booking confirmed',
  description: `${selectedClass.name} has been booked successfully.`,
})

router.replace('/dashboard')

  } catch (caught) {
    setError(
      caught instanceof Error
        ? caught.message
        : 'Unable to complete your booking.'
    )
  } finally {
    setSaving(false)
  }
}

  if (!selectedClass) return <main className="mx-auto max-w-2xl px-6 py-24 text-center"><h1 className="font-serif text-4xl text-primary">Choose a class to get started</h1><button type="button" onClick={() => router.push('/classes')} className="mt-8 bg-primary px-5 py-3 text-primary-foreground">Choose a class</button></main>
  if (isLoading) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your booking details…</main>

  return <main className="min-h-[75vh] bg-muted/20 px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-3xl"><p className="text-xs uppercase tracking-[0.24em] text-accent">Client wellness & safety</p><h1 className="mt-3 font-serif text-5xl text-primary">{selectedClass.name}</h1><p className="mt-2 text-muted-foreground">Complete your member booking</p><div className="my-8 flex items-center gap-2" aria-label="Booking progress">{(['preferences', 'health', 'review'] as Step[]).map((item, index) => <div key={item} className="flex items-center gap-2"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${step === item || index < (['preferences', 'health', 'review'] as Step[]).indexOf(step) ? 'bg-primary text-primary-foreground' : 'bg-border text-muted-foreground'}`}>{index < (['preferences', 'health', 'review'] as Step[]).indexOf(step) ? <Check className="h-4 w-4" /> : index + 1}</span>{index < 2 && <span className="h-px w-10 bg-border" />}</div>)}</div>

    {step === 'preferences' && <section className="space-y-8 border border-border bg-background p-6 sm:p-8"><h2 className="font-serif text-3xl text-primary">When would you like to start?</h2><input aria-label="Preferred start date" type="date" value={preferredStartDate} onChange={event => setPreferredStartDate(event.target.value)} className="w-full border border-border bg-background px-4 py-3 text-foreground" /><p className="text-xs text-muted-foreground">This is your preferred start date, not a confirmed appointment.</p><h2 className="font-serif text-3xl text-primary">Which days are you usually available?</h2><div className="flex flex-wrap gap-2">{days.map(day => <button type="button" key={day} onClick={() => setAvailableDays(current => current.includes(day) ? current.filter(item => item !== day) : [...current, day])} className={`border px-3 py-2 text-sm ${availableDays.includes(day) ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-primary'}`}>{day.slice(0, 3)}</button>)}</div><h2 className="font-serif text-3xl text-primary">What time works best?</h2><div className="grid gap-3">{times.map(time => <button type="button" key={time} onClick={() => setPreferredTimes(current => current.includes(time) ? current.filter(item => item !== time) : [...current, time])} className={`border p-4 text-left ${preferredTimes.includes(time) ? 'border-primary bg-primary/5' : 'border-border'}`}><b className="text-primary">{time}</b></button>)}</div></section>}

    {step === 'health' && <section className="space-y-8 border border-border bg-background p-6 sm:p-8"><div><h2 className="font-serif text-3xl text-primary">Client Health & Exercise Readiness Form</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Optional information may be left blank. Only answer what applies to you.</p></div><div className="grid gap-4 sm:grid-cols-2">{field('Client Full Name', 'fullName')}
{field('Email Address', 'email', 'email')}
{field('Phone Number', 'phone')}
{field('Date of Birth', 'dateOfBirth', 'date')}
{field('Age', 'age', 'number')}
{field('Emergency Contact Name', 'emergencyContactName')}
{field('Relationship', 'emergencyContactRelationship')}
{field('Emergency Contact Phone', 'emergencyContactPhone')}</div><div className="space-y-5"><h3 className="font-serif text-2xl text-primary">Pregnancy & postpartum</h3>{yesNo('Are you currently pregnant?', 'pregnancy')}{health.pregnancy === 'Yes' && <div className="grid gap-4 border-l-2 border-accent pl-4 sm:grid-cols-2">{field('How many weeks pregnant?', 'pregnancyWeeks', 'number')}{field('Expected due date', 'dueDate', 'date')}{yesNo('Have you received clearance from your doctor or midwife to participate in Pilates/exercise?', 'pregnancyClearance')}</div>}{yesNo('Have you recently given birth?', 'postpartum')}{health.postpartum === 'Yes' && <div className="grid gap-4 border-l-2 border-accent pl-4 sm:grid-cols-2">{field('Date of delivery', 'deliveryDate', 'date')}{yesNo('Have you received medical clearance to resume exercise?', 'postpartumClearance')}</div>}</div><div className="space-y-5"><h3 className="font-serif text-2xl text-primary">Current health screening</h3>{screenings.map((question, index) => <div key={question}>{yesNo(question, `screening_${index}`)}{health[`screening_${index}`] === 'Yes' && <label className="mt-3 block border-l-2 border-accent pl-4 text-sm text-primary">Please provide details<textarea value={String(health[`screening_${index}_details`] || '')} onChange={event => set(`screening_${index}_details`, event.target.value)} className="mt-2 min-h-24 w-full border border-border bg-background px-4 py-3 text-foreground" /></label>}</div>)}</div><div className="space-y-5"><h3 className="font-serif text-2xl text-primary">Surgery / medical procedure</h3>{yesNo('Have you undergone any surgery, medical procedure or significant physical rehabilitation?', 'surgery')}{health.surgery === 'Yes' && <div className="space-y-4 border-l-2 border-accent pl-4">{field('Please provide details and date', 'surgeryDetails')}{yesNo('Have you been medically cleared to return to exercise?', 'surgeryClearance')}</div>}</div>
<div className="space-y-5">
  <h3 className="font-serif text-2xl text-primary">
    Client Declaration & Consent
  </h3>

  {consents.map(consent => (
    <label
      key={consent}
      className="flex gap-3 text-sm leading-6 text-primary"
    >
      <input
        type="checkbox"
        checked={
          ((health.consent as string[]) || [])
            .includes(consent)
        }
        onChange={() =>
          toggle('consent', consent)
        }
        className="mt-1"
      />

      {consent}
    </label>
  ))}

  {field(
    'Client acknowledgement / signature',
    'signature'
  )}

  <p className="text-sm text-muted-foreground">
    Submitted on completion
  </p>
</div></section>}

    {step === 'review' && <section className="border border-border bg-background p-6 sm:p-8"><h2 className="font-serif text-3xl text-primary">Review your booking</h2><dl className="mt-8 divide-y divide-border">{[['Selected class', selectedClass.name], ['Booking ID', booking?.id || ''], ['Preferred start date', preferredStartDate], ['Available days', availableDays.join(' · ')], ['Preferred times', preferredTimes.join(' · ')], ['Health & Safety', 'Completed']].map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-3"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm text-primary sm:col-span-2">{value}</dd></div>)}</dl></section>}

    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<div className="mt-6 flex justify-between"><button type="button" onClick={() => step === 'preferences' ? router.back() : setStep(step === 'review' ? 'health' : 'preferences')} className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm text-primary"><ArrowLeft className="h-4 w-4" /> Back</button>{step === 'review' ? <button type="button" onClick={confirm} disabled={saving} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-60">{saving ? 'Confirming…' : 'Confirm Booking'}<Check className="h-4 w-4" /></button> : <button type="button" onClick={continueFlow} className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground">Continue<ArrowRight className="h-4 w-4" /></button>}</div></div></main>
}
