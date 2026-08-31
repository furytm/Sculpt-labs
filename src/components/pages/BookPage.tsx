'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Edit3,
  Loader2,
  MessageCircle,
} from 'lucide-react'

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

type BookingForm = {
  membershipId: string
  name: string
  email: string
  phone: string
}

const emptyForm: BookingForm = {
  membershipId: '',
  name: '',
  email: '',
  phone: '',
}

const whatsappNumber = '2348086828877'

export default function BookPage() {
  const searchParams = useSearchParams()

  const bookingType = (
    searchParams.get('type') || 'GROUP'
  ).toUpperCase()

  const queryMembershipId =
    searchParams.get('membershipId') || ''

    const classId =
  searchParams.get('classId') || ''

  const [step, setStep] = useState<1 | 2>(1)

  const [formData, setFormData] = useState<BookingForm>({
    ...emptyForm,
    membershipId: queryMembershipId,
  })

  const [memberships, setMemberships] = useState<Membership[]>([])

  const [status, setStatus] = useState<
    'loading' | 'ready' | 'empty' | 'error'
  >('loading')

  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function fetchMemberships() {
      setStatus('loading')

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/memberships?type=${encodeURIComponent(
            bookingType
          )}`
        )

        const body = await response.text()

        let result: {
          data?: Membership[]
          message?: string
        }

        try {
          result = JSON.parse(body)
        } catch {
          throw new Error(
            `Membership API returned ${response.status} ${response.statusText} instead of JSON.`
          )
        }

        if (!response.ok) {
          throw new Error(
            result.message || 'Unable to load memberships.'
          )
        }

        const nextMemberships = (result.data || []).map(
          (membership) => ({
            ...membership,
            id:
              membership.id ||
              (membership as any)._id,
            priceNGN: membership.price,
          })
        )

        setMemberships(nextMemberships)
        setStatus(
          nextMemberships.length ? 'ready' : 'empty'
        )
      } catch (error) {
        setStatus('error')

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Unable to load memberships.'
        )
      }
    }

    fetchMemberships()
  }, [bookingType])

  const selectedMembership = memberships.find(
    (membership) =>
      membership.id === formData.membershipId
  )

  const isContactComplete = Boolean(
    formData.name.trim() &&
      formData.email.trim() &&
      formData.phone.trim()
  )

  const total = selectedMembership?.priceNGN || 0

  const updateField = (
    name: keyof BookingForm,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hello Sculpt LAB, I have paid for ${
          selectedMembership?.name || 'my membership'
        } and would like to confirm my transfer. Name: ${
          formData.name || '[your name]'
        }. Email: ${
          formData.email || '[your email]'
        }.`
      )}`
    : '#'

  const handleProceedToPayment = async () => {
    if (!selectedMembership || !isContactComplete) {
      return
    }

    setIsProcessing(true)

    try {
      const response = await createBooking({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        membershipId: selectedMembership.id,
          classId: classId || undefined,
      })

      const authorizationUrl =
        response.data.authorizationUrl

      if (response.success && authorizationUrl) {
        const paymentWindow = window.open(
          authorizationUrl,
          '_blank',
          'noopener,noreferrer'
        )

        if (!paymentWindow) {
          alert(
            'Please allow popups to continue to payment.'
          )
        }
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20'

  const buttonClass =
    'inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50'

  const secondaryButtonClass =
    'inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-6 py-3 font-medium text-primary transition hover:bg-primary/5'

  return (
    <div className="min-h-screen w-full">
      <Hero
        title="Book Your Session"
        subtitle="Choose your Sculpt LAB membership, then complete your details"
        imageSrc="/images/hero-book.png"
        imageAlt="Book a Pilates session"
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {bookingType === 'PRIVATE'
              ? 'Private sessions'
              : 'Group classes'}
          </p>

          <h1 className="hero-text text-primary">
            Book in two easy steps
          </h1>

          <p className="body-text mx-auto mt-4 max-w-xl text-lg text-foreground/70">
            Select a membership, then share your contact
            details before payment.
          </p>
        </motion.div>

        {/* BOOKING PROGRESS */}
        <div
          className="mx-auto mb-10 flex max-w-xl items-center justify-center gap-3 sm:gap-5"
          aria-label="Booking progress"
        >
          {[
            { number: 1, label: 'Membership' },
            { number: 2, label: 'Contact & Review' },
          ].map((item, index) => (
            <div
              key={item.number}
              className="flex flex-1 items-center gap-3 sm:gap-5"
            >
              <button
                type="button"
                onClick={() =>
                  item.number === 1 && setStep(1)
                }
                className="mx-auto flex items-center gap-2 text-left"
                aria-current={
                  step === item.number
                    ? 'step'
                    : undefined
                }
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-serif text-lg transition ${
                    step >= item.number
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step > item.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    item.number
                  )}
                </span>

                <span
                  className={`hidden text-sm font-medium sm:block ${
                    step >= item.number
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
              </button>

              {index === 0 && (
                <div
                  className={`h-px flex-1 transition ${
                    step === 2
                      ? 'bg-primary'
                      : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* BOOKING STEPS */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
        >
          {step === 1 ? (
            /* STEP 1 */
            <section
              className="glassmorphism rounded-xl p-6 sm:p-8"
              aria-labelledby="membership-heading"
            >
              <p className="mb-2 text-sm text-foreground/60">
                Step 1
              </p>

              <h2
                id="membership-heading"
                className="section-title mb-8 text-primary"
              >
                Choose your membership
              </h2>

              {status === 'loading' && (
                <div className="rounded-lg border border-border p-5 text-foreground/70">
                  <Loader2 className="mr-2 inline h-5 w-5 animate-spin" />
                  Loading memberships...
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-lg border border-destructive/30 p-5 text-destructive">
                  {errorMessage}
                </div>
              )}

              {status === 'empty' && (
                <div className="rounded-lg border border-border p-5 text-foreground/70">
                  No memberships are currently
                  available.
                </div>
              )}

              {status === 'ready' && (
                <div className="grid gap-4">
                  {memberships.map((membership) => (
                    <button
                      key={membership.id}
                      type="button"
                      onClick={() =>
                        updateField(
                          'membershipId',
                          membership.id
                        )
                      }
                      className={`rounded-xl border p-5 text-left transition ${
                        formData.membershipId ===
                        membership.id
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-serif text-xl text-primary">
                            {membership.name}
                          </p>

                          <p className="mt-1 text-sm text-foreground/65">
                            {membership.description}
                          </p>
                        </div>

                        <p className="whitespace-nowrap font-medium text-primary">
                          ₦
                          {membership.priceNGN.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-border pt-6">
                <button
                  className={buttonClass}
                  disabled={!selectedMembership}
                  onClick={() => setStep(2)}
                >
                  Continue to contact details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          ) : (
            /* STEP 2 */
            <section
              className="glassmorphism rounded-xl p-6 sm:p-8"
              aria-labelledby="contact-heading"
            >
           

              <h2
                id="contact-heading"
                className="section-title mb-8 text-primary"
              >
                Contact & review
              </h2>

              {/* CONTACT DETAILS */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-foreground/75">
                  Full name

                  <input
                    className={inputClass}
                    value={formData.name}
                    onChange={(event) =>
                      updateField(
                        'name',
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm font-medium text-foreground/75">
                  Email

                  <input
                    type="email"
                    className={inputClass}
                    value={formData.email}
                    onChange={(event) =>
                      updateField(
                        'email',
                        event.target.value
                      )
                    }
                  />
                </label>

                <label className="text-sm font-medium text-foreground/75 sm:col-span-2">
                  Phone number

                  <input
                    className={inputClass}
                    value={formData.phone}
                    onChange={(event) =>
                      updateField(
                        'phone',
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>

              {/* REVIEW */}
              <dl className="mt-8 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
                <div>
                  <dt className="text-foreground/60">
                    Membership
                  </dt>

                  <dd className="mt-1 font-medium text-primary">
                    {selectedMembership?.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-foreground/60">
                    Total
                  </dt>

                  <dd className="mt-1 font-medium text-primary">
                    ₦{total.toLocaleString()}
                  </dd>
                </div>
              </dl>

              {/* PAYMENT OPTIONS */}
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Payment options
                </p>

                <button
                  className={`${buttonClass} mt-4 w-full`}
                  disabled={
                    !isContactComplete ||
                    isProcessing
                  }
                  onClick={handleProceedToPayment}
                >
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}

                  {isProcessing
                    ? 'Opening payment...'
                    : 'Pay Now'}
                </button>

                <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-foreground/50">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>

                {/* MANUAL PAYMENT */}

                  {/* BANK PAYMENT INFO */}
              <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <p className="text-sm font-medium uppercase tracking-[0.16em] text-primary">
                  Pay to Sculpt LAB account
                </p>

                <p className="mt-3 font-medium text-foreground">
                  Sculpt LAB Limited
                </p>

                <p className="text-foreground/75">
                  Moniepoint
                </p>

                <p className="mt-1 text-lg font-semibold tracking-wide text-primary">
                  3001445877
                </p>

                <p className="mt-3 text-sm leading-6 text-foreground/70">
                  After transferring, confirm your
                  payment with us on WhatsApp.
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground"
                >
                  <Image
                    src="/whatsapplogo.jpg"
                    alt="WhatsApp"
                    width={22}
                    height={22}
                    className="h-5 w-5 rounded object-cover"
                  />

                  Confirm your transfer on WhatsApp
                </a>
              </div>
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-border pt-6">
                <button
                  className={secondaryButtonClass}
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <button
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() => setStep(1)}
                >
                  <Edit3 className="h-4 w-4" />
                  Edit membership
                </button>
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </div>
  )
}
