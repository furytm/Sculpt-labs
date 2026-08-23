'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Hero from '@/src/components/Hero'
import { API_BASE_URL } from '@/lib/api/booking'

interface ConfirmationBooking {
  id?: string
  fullName?: string
  email?: string
  phone?: string
  paymentReference?: string
  amount?: number
  paymentStatus?: string
  membership?: {
    name?: string
    price?: number
    type?: string
  }
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const reference = searchParams.get('reference')

  const [booking, setBooking] =
    useState<ConfirmationBooking | null>(null)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConfirmation = async () => {
      if (!reference) {
        setError('Booking reference is missing.')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/bookings/confirmation/${encodeURIComponent(
            reference
          )}`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.message ||
              'Unable to load your payment confirmation.'
          )
        }

        setBooking(result.data.booking)
      } catch (fetchError) {
        console.error(
          'Unable to load payment confirmation:',
          fetchError
        )

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Unable to load your payment confirmation.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfirmation()
  }, [reference])

  const bookingReference =
    booking?.paymentReference ||
    booking?.id ||
    reference ||
    ''

  const email = booking?.email || ''

  const amount =
    typeof booking?.amount === 'number'
      ? booking.amount
      : booking?.membership?.price

  return (
    <div className="w-full min-h-screen">
      <Hero
        title="Welcome to Sculpt Lab"
        subtitle="Your Pilates journey starts here"
        imageSrc="/images/hero-book.jpg"
        imageAlt="Sculpt Lab Pilates studio"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="glassmorphism p-8 sm:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
              }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="font-serif text-3xl font-medium text-primary mb-2">
              Payment Successful!
            </h2>

            <p className="body-text text-lg text-foreground/70 mb-8">
              Your Sculpt Lab membership has been purchased successfully.
            </p>

            {isLoading ? (
              <p className="body-text text-foreground/70">
                Loading your payment confirmation...
              </p>
            ) : error ? (
              <p className="body-text text-destructive">
                {error}
              </p>
            ) : (
              <>
                <div className="bg-muted/30 p-6 rounded-lg mb-8 text-left space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">
                      Payment Reference
                    </p>

                    <p className="font-serif text-xl sm:text-2xl font-medium text-primary break-all">
                      {bookingReference}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-foreground/10 space-y-3">
                    <div>
                      <p className="text-sm text-foreground/60">
                        Membership
                      </p>

                      <p className="font-medium text-foreground">
                        {booking?.membership?.name || 'Membership'}
                      </p>
                    </div>

                    {booking?.membership?.type && (
                      <div>
                        <p className="text-sm text-foreground/60">
                          Type
                        </p>

                        <p className="font-medium text-foreground">
                          {booking.membership.type === 'PRIVATE'
                            ? 'Private Session'
                            : 'Group Classes'}
                        </p>
                      </div>
                    )}

                    {typeof amount === 'number' && (
                      <div>
                        <p className="text-sm text-foreground/60">
                          Amount Paid
                        </p>

                        <p className="font-medium text-foreground">
                          ₦{amount.toLocaleString()}
                        </p>
                      </div>
                    )}

                    {email && (
                      <div>
                        <p className="text-sm text-foreground/60">
                          Email
                        </p>

                        <p className="font-medium text-foreground break-all">
                          {email}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-foreground/60">
                        Payment Status
                      </p>

                      <p className="font-medium text-accent">
                        {booking?.paymentStatus === 'PAID'
                          ? 'Paid'
                          : booking?.paymentStatus || 'Processing'}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-10 text-center"
                >
                  <p className="body-text text-foreground/80 leading-relaxed max-w-md mx-auto">
                    Your membership is ready. Create an account to
                    manage your membership, choose your classes,
                    book sessions, view your payment history, and
                    enjoy your Sculpt Lab experience.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() =>
                      router.push(
                        `/register?email=${encodeURIComponent(
                          email
                        )}&reference=${encodeURIComponent(
                          bookingReference
                        )}`
                      )
                    }
                    className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Create an Account
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        `/login?email=${encodeURIComponent(email)}`
                      )
                    }
                    className="w-full px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    I Already Have an Account
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-foreground/20" />

                    <span className="text-xs text-foreground/50 uppercase tracking-wider font-medium">
                      Or
                    </span>

                    <div className="flex-1 h-px bg-foreground/20" />
                  </div>

                  <button
                    onClick={() => router.push('/')}
                    className="w-full px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
                  >
                    Continue as Guest
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}