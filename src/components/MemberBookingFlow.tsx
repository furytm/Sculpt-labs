'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

import {
  assignBookingSchedules,
  confirmBooking,
  formatDate,
  getClassSchedules,
  getMyBookings,
  saveHealthSafety,
  updateBookingPart,
  type Health,
} from '@/lib/api/booking'
import { classes, getClassById } from '@/lib/data/classes'
import { useRequireAuth } from './AuthProvider'
import { toast } from '@/hooks/use-toast'

type Step = 'class' | 'schedule' | 'date' | 'health' | 'review'
type Answer = 'Yes' | 'No'

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const consents = [
  'The information I have provided is accurate and complete.',
  'I have disclosed my injuries and medical conditions.',
  'I will communicate changes in my health, pregnancy or injuries.',
  'I will obtain medical clearance where required.',
  'I will not participate if medically advised not to exercise.',
  'I will tell my instructor about concerning symptoms.',
  'I understand exercises may be modified or discontinued for safety.',
  'This form does not replace professional medical advice.',
]

const screenings = [
  'Has a doctor or healthcare professional ever advised you not to exercise?',
  'Do you currently have an injury, pain or physical limitation?',
  'Do you experience unexplained chest pain or discomfort during exercise?',
  'Do you experience dizziness, fainting or loss of balance?',
  'Do you experience unusual shortness of breath during physical activity?',
  'Do you have a diagnosed heart or cardiovascular condition?',
  'Do you have high or low blood pressure?',
  'Do you have asthma or another respiratory condition?',
  'Do you have diabetes or blood sugar-related concerns?',
  'Do you have osteoporosis or reduced bone density?',
  'Do you have a neurological condition affecting movement, balance or coordination?',
  'Do you have a joint, muscle, ligament or tendon condition?',
  'Have you had surgery within the past 12 months?',
  'Are you currently undergoing treatment or physical rehabilitation?',
  'Are you currently taking medication that may affect your ability to exercise?',
]

export default function MemberBookingFlow() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useRequireAuth()

  const requestedClass = params.get('classId') || ''

  const {
    data: bookings,
    isLoading,
    mutate,
  } = useSWR('member-bookings-flow', getMyBookings)

  const booking =
    bookings?.find(
      (item) =>
        item.paymentStatus === 'PAID' &&
        (requestedClass ? item.classId === requestedClass : true),
    ) ??
    bookings?.find((item) => item.paymentStatus === 'PAID')

  const [step, setStep] = useState<Step>(
    requestedClass ? 'schedule' : 'class',
  )

  const [classId, setClassId] = useState(
    requestedClass || booking?.classId || '',
  )

const [startDate, setStartDate] = useState(
  booking?.preferredStartDate
    ? booking.preferredStartDate.slice(0, 10)
    : ''
)

  const [health, setHealth] = useState<Health>({
    fullName: '',
    email: '',
    phone: '',
    consent: [],
  })

  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedClass = useMemo(
    () => getClassById(classId),
    [classId],
  )

  const {
    data: schedules,
    isLoading: schedulesLoading,
  } = useSWR(
    classId ? ['class-schedules', classId] : null,
    ([, id]) => getClassSchedules(id),
  )

  useEffect(() => {
    if (user) {
      setHealth((current) => ({
        ...current,
        fullName: current.fullName || user.fullName || '',
        email: current.email || user.email || '',
        phone: current.phone || user.phone || '',
      }))
    }
  }, [user])

  useEffect(() => {
    if (!booking) return

    // Keep the selected class in sync with the booking
    if (requestedClass && booking.classId !== requestedClass) {
      setClassId(requestedClass)

      updateBookingPart(
        booking.id,
        'class',
        { classId: requestedClass },
      ).catch((error) => {
        console.error(
          'Failed to save selected class:',
          error,
        )

        setError(
          error instanceof Error
            ? error.message
            : 'Unable to save your selected class.',
        )
      })
    } else if (booking.classId && !classId) {
      setClassId(booking.classId)
    }

    // Use preferredStartDate for the new booking flow
    if (booking.preferredStartDate && !startDate) {
      setStartDate(
        booking.preferredStartDate.slice(0, 10),
      )
    }
  }, [
    booking,
    requestedClass,
    classId,
    startDate,
  ])

  const set = (
    key: string,
    value: string | boolean | string[],
  ) => {
    setHealth((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const toggle = (key: string, value: string) => {
    set(
      key,
      ((health[key] as string[]) || []).includes(value)
        ? ((health[key] as string[]) || []).filter(
            (item) => item !== value,
          )
        : [
            ...((health[key] as string[]) || []),
            value,
          ],
    )
  }

  const field = (
    label: string,
    key: string,
    type = 'text',
  ) => (
    <label className="block text-sm text-primary">
      {label}

      <input
        type={type}
        value={String(health[key] || '')}
        onChange={(event) =>
          set(key, event.target.value)
        }
        className="mt-2 w-full border border-border bg-background px-4 py-3 text-foreground"
      />
    </label>
  )

  const yesNo = (
    label: string,
    key: string,
  ) => (
    <div>
      <p className="text-sm leading-6 text-primary">
        {label}
      </p>

      <div className="mt-2 flex gap-2">
        {(['Yes', 'No'] as Answer[]).map(
          (value) => (
            <button
              type="button"
              key={value}
              onClick={() => set(key, value)}
              className={`border px-4 py-2 text-sm ${
                health[key] === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-primary'
              }`}
            >
              {value}
            </button>
          ),
        )}
      </div>
    </div>
  )

  const chooseClass = async (id: string) => {
    if (!booking) {
      return setError(
        'We could not find your paid booking. Please return to your dashboard.',
      )
    }

    setSaving(true)
    setError('')

    try {
      await updateBookingPart(
        booking.id,
        'class',
        { classId: id },
      )

      setClassId(id)
      setStep('schedule')

      await mutate()
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to save your class.',
      )
    } finally {
      setSaving(false)
    }
  }

  const continueFlow = async () => {
    setError('')

    if (step === 'schedule') {
      if (!classId) {
        return setError(
          'Please select a class first.',
        )
      }

      if (!schedules?.length) {
        return setError(
          'No active schedules are available for this class.',
        )
      }

      setStep('date')
      return
    }

    if (step === 'date') {
      if (!startDate) {
        return setError(
          'Choose a start date.',
        )
      }

      const date = new Date(
        `${startDate}T12:00:00`,
      )

      if (
        Number.isNaN(date.getTime()) ||
        date < new Date(new Date().toDateString())
      ) {
        return setError(
          'Choose a valid future date.',
        )
      }

      if (!booking) {
        return setError(
          'Paid booking not found.',
        )
      }

      setSaving(true)

      try {
        await updateBookingPart(
          booking.id,
          'start-date',
          { startDate },
        )

        setStep('health')
        await mutate()
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : 'Unable to save your start date.',
        )
      } finally {
        setSaving(false)
      }

      return
    }

    if (step === 'health') {
      if (
        !health.signature ||
        ((health.consent as string[]) || []).length !==
          consents.length
      ) {
        return setError(
          'Please complete the declaration and signature.',
        )
      }

      setStep('review')
    }
  }

  const confirm = async () => {
    if (!booking) return

    setSaving(true)

    try {
      const screeningAnswers = Object.fromEntries(
        screenings.map((_, i) => [
          `screening_${i}`,
          health[`screening_${i}`] || '',
        ]),
      )

      await saveHealthSafety(booking.id, {
        ...health,
        age: health.age
          ? Number(health.age)
          : undefined,
        pregnancyWeeks: health.pregnancyWeeks
          ? Number(health.pregnancyWeeks)
          : undefined,
        screeningAnswers,
      })

await assignBookingSchedules(booking.id)
      await confirmBooking(booking.id)

      toast({
        title: 'Booking confirmed',
        description: `${
          selectedClass?.name || 'Your class'
        } has been booked successfully.`,
      })

      router.replace('/dashboard')
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to complete your booking.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">
        Loading your booking details…
      </main>
    )
  }

  if (!booking) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-4xl text-primary">
          Paid booking not found
        </h1>

        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="mt-8 bg-primary px-5 py-3 text-primary-foreground"
        >
          Return to dashboard
        </button>
      </main>
    )
  }

  const steps: Step[] = [
    'class',
    'schedule',
    'date',
    'health',
    'review',
  ]

  const index = steps.indexOf(step)

  return (
    <main className="min-h-[75vh] bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.24em] text-accent">
          Member booking
        </p>

        <h1 className="mt-3 font-serif text-5xl text-primary">
          Complete your booking
        </h1>

        <p className="mt-2 text-muted-foreground">
          Choose your real studio timetable, then
          confirm your membership session.
        </p>

        <div
          className="my-8 flex items-center gap-2"
          aria-label="Booking progress"
        >
          {steps.map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2"
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                  i <= index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-border text-muted-foreground'
                }`}
              >
                {i < index ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </span>

              {i < steps.length - 1 && (
                <span className="h-px w-5 bg-border sm:w-10" />
              )}
            </div>
          ))}
        </div>

        {step === 'class' && (
          <section className="space-y-5 border border-border bg-background p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-primary">
              Choose your class
            </h2>

            <p className="text-sm text-muted-foreground">
              Select one of the current Sculpt LAB class
              types.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {classes.map((item) => (
                <button
                  type="button"
                  disabled={saving}
                  key={item.id}
                  onClick={() =>
                    chooseClass(item.id)
                  }
                  className="border border-border p-5 text-left transition hover:border-primary disabled:opacity-60"
                >
                  <h3 className="font-serif text-2xl text-primary">
                    {item.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 'schedule' && (
          <section className="space-y-5 border border-border bg-background p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-primary">
              Schedule preview
            </h2>

            <p className="text-sm text-muted-foreground">
              These are the recurring studio times for
              your selected class. Your enrollment will
              include these scheduled sessions.
            </p>

            {schedulesLoading ? (
              <p className="text-sm text-muted-foreground">
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Loading schedules…
              </p>
            ) : schedules?.length ? (
              <div className="grid gap-3">
                {schedules.map((item) => (
                  <div
                    key={item.id}
                    className="border border-border p-5"
                  >
                    <p className="font-serif text-2xl text-primary">
                      {item.dayOfWeek}
                    </p>

                    <p className="mt-2 text-sm text-primary">
                      {item.startTime} – {item.endTime}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Instructor:{' '}
                      {item.tutorName ||
                        'Studio team'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="border border-border p-5 text-sm text-muted-foreground">
                No active schedules are available for
                this class.
              </p>
            )}
          </section>
        )}

        {step === 'date' && (
          <section className="space-y-5 border border-border bg-background p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-primary">
              Choose your start date
            </h2>

            <p className="text-sm text-muted-foreground">
              Choose the date you would like your
              membership to begin.
            </p>

            <div className="border border-border p-4 text-sm text-primary">
              {selectedClass?.name} ·{' '}
              {schedules?.length || 0} recurring
              sessions included
            </div>

            <input
              aria-label="Membership start date"
              type="date"
              min={new Date()
                .toISOString()
                .slice(0, 10)}
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full border border-border bg-background px-4 py-3 text-foreground"
            />
          </section>
        )}

        {step === 'health' && (
          <section className="space-y-8 border border-border bg-background p-6 sm:p-8">
            <div>
              <h2 className="font-serif text-3xl text-primary">
                Client Health & Exercise Readiness Form
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Optional information may be left blank.
                Only answer what applies to you.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {field('Client Full Name', 'fullName')}
              {field(
                'Email Address',
                'email',
                'email',
              )}
              {field('Phone Number', 'phone')}
              {field(
                'Date of Birth',
                'dateOfBirth',
                'date',
              )}
              {field('Age', 'age', 'number')}
              {field(
                'Emergency Contact Name',
                'emergencyContactName',
              )}
              {field(
                'Relationship',
                'emergencyContactRelationship',
              )}
              {field(
                'Emergency Contact Phone',
                'emergencyContactPhone',
              )}
            </div>

            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-primary">
                Pregnancy & postpartum
              </h3>

              {yesNo(
                'Are you currently pregnant?',
                'pregnancy',
              )}

              {health.pregnancy === 'Yes' && (
                <div className="grid gap-4 border-l-2 border-accent pl-4 sm:grid-cols-2">
                  {field(
                    'How many weeks pregnant?',
                    'pregnancyWeeks',
                    'number',
                  )}

                  {field(
                    'Expected due date',
                    'dueDate',
                    'date',
                  )}

                  {yesNo(
                    'Have you received clearance from your doctor or midwife to participate?',
                    'pregnancyClearance',
                  )}
                </div>
              )}

              {yesNo(
                'Have you recently given birth?',
                'postpartum',
              )}

              {health.postpartum === 'Yes' && (
                <div className="grid gap-4 border-l-2 border-accent pl-4 sm:grid-cols-2">
                  {field(
                    'Date of delivery',
                    'deliveryDate',
                    'date',
                  )}

                  {yesNo(
                    'Have you received medical clearance to resume exercise?',
                    'postpartumClearance',
                  )}
                </div>
              )}
            </div>

            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-primary">
                Current health screening
              </h3>

              {screenings.map((question, i) => (
                <div key={question}>
                  {yesNo(
                    question,
                    `screening_${i}`,
                  )}

                  {health[`screening_${i}`] ===
                    'Yes' && (
                    <label className="mt-3 block border-l-2 border-accent pl-4 text-sm text-primary">
                      Please provide details

                      <textarea
                        value={String(
                          health[
                            `screening_${i}_details`
                          ] || '',
                        )}
                        onChange={(e) =>
                          set(
                            `screening_${i}_details`,
                            e.target.value,
                          )
                        }
                        className="mt-2 min-h-24 w-full border border-border bg-background px-4 py-3 text-foreground"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              <h3 className="font-serif text-2xl text-primary">
                Surgery / medical procedure
              </h3>

              {yesNo(
                'Have you undergone surgery, a medical procedure or significant rehabilitation?',
                'surgery',
              )}

              {health.surgery === 'Yes' && (
                <div className="space-y-4 border-l-2 border-accent pl-4">
                  {field(
                    'Please provide details and date',
                    'surgeryDetails',
                  )}

                  {yesNo(
                    'Have you been medically cleared to return to exercise?',
                    'surgeryClearance',
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-serif text-2xl text-primary">
                Client Declaration & Consent
              </h3>

              {consents.map((item) => (
                <label
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-primary"
                >
                  <input
                    type="checkbox"
                    checked={(
                      (health.consent as string[]) ||
                      []
                    ).includes(item)}
                    onChange={() =>
                      toggle('consent', item)
                    }
                    className="mt-1"
                  />

                  {item}
                </label>
              ))}

              {field(
                'Client acknowledgement / signature',
                'signature',
              )}
            </div>
          </section>
        )}

        {step === 'review' && (
          <section className="border border-border bg-background p-6 sm:p-8">
            <h2 className="font-serif text-3xl text-primary">
              Review your booking
            </h2>

            <dl className="mt-8 divide-y divide-border">
              {[
                [
                  'Class',
                  selectedClass?.name || classId,
                ],
                [
                  'Start Date',
                  formatDate(startDate),
                ],
                [
                  'Membership',
                  booking.membership?.name ||
                    booking.membershipId,
                ],
                [
                  'Health & Safety',
                  'Completed',
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid gap-1 py-4 sm:grid-cols-3"
                >
                  <dt className="text-sm text-muted-foreground">
                    {label}
                  </dt>

                  <dd className="text-sm text-primary sm:col-span-2">
                    {value || 'Not available'}
                  </dd>
                </div>
              ))}

              <div className="py-4 sm:grid sm:grid-cols-3">
                <dt className="text-sm text-muted-foreground">
                  Recurring schedules
                </dt>

                <dd className="mt-3 space-y-3 text-sm text-primary sm:col-span-2 sm:mt-0">
                  {schedules?.map((item) => (
                    <div key={item.id}>
                      <p>{item.dayOfWeek}</p>

                      <p className="text-muted-foreground">
                        {item.startTime} –{' '}
                        {item.endTime} ·{' '}
                        {item.tutorName ||
                          'Studio team'}
                      </p>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
        )}

        {error && (
          <p
            role="alert"
            className="mt-4 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              step === 'class'
                ? router.back()
                : setStep(steps[index - 1])
            }
            className="inline-flex items-center gap-2 border border-border px-4 py-3 text-sm text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          {step === 'review' ? (
            <button
              type="button"
              onClick={confirm}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground disabled:opacity-60"
            >
              {saving
                ? 'Confirming…'
                : 'Confirm Booking'}

              <Check className="h-4 w-4" />
            </button>
          ) : step !== 'class' ? (
            <button
              type="button"
              onClick={continueFlow}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm text-primary-foreground"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </main>
  )
}