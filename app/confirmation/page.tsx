'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Hero from '@/src/components/Hero'
import { getClassById } from "@/lib/data/classes";
import { getInstructorById } from "@/lib/data/instructors";
import { getSessionById } from "@/lib/data/schedule";
import { API_BASE_URL } from '@/lib/api/booking'

interface ConfirmationBooking {
  reference?: string
  paymentReference?: string
  id?: string
  membership?: { name?: string }
  membershipName?: string
  class?: { name?: string; instructor?: { name?: string } }
  className?: string
  instructor?: { name?: string }
  instructorName?: string
  schedule?: { date?: string; time?: string; startTime?: string; instructor?: { name?: string } }
  bookingDate?: string
  date?: string
  bookingTime?: string
  time?: string
  paymentStatus?: string
}

interface ConfirmationBooking {
  id?: string;

  classId?: string;
  scheduleId?: string;

  paymentReference?: string;
  bookingDate?: string;

  membership?: {
    name?: string;
  };

  paymentStatus?: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reference = searchParams.get('reference')
  const [booking, setBooking] = useState<ConfirmationBooking | null>(null)
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
        const response = await fetch(`${API_BASE_URL}/api/bookings/confirmation/${encodeURIComponent(reference)}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load your booking confirmation.')
        }

        setBooking(result.data.booking)
      } catch (fetchError) {
        console.error('Unable to load booking confirmation:', fetchError)
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load your booking confirmation.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfirmation()
  }, [reference])

  const bookingDate = booking?.bookingDate || booking?.schedule?.date || booking?.date
  const classInfo = booking?.classId
  ? getClassById(booking.classId)
  : undefined;

const session = booking?.scheduleId
  ? getSessionById(booking.scheduleId)
  : undefined;

const instructor = session
  ? getInstructorById(session.instructorId)
  : undefined;
  console.log("Booking scheduleId:", booking?.scheduleId);
console.log("Resolved session:", session);
  const bookingTime = booking?.bookingTime || booking?.schedule?.time || booking?.schedule?.startTime || booking?.time
  const instructorName = booking?.instructorName || booking?.instructor?.name || booking?.schedule?.instructor?.name || booking?.class?.instructor?.name

  return (
    <div className="w-full min-h-screen">
      <Hero
        title="Book Your Session"
        subtitle="Reserve your perfect pilates class in 7 simple steps"
        imageSrc="/images/hero-book.jpg"
        imageAlt="Book a pilates session"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="glassmorphism p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="font-serif text-3xl font-medium text-primary mb-2">Payment Successful!</h2>
            <p className="body-text text-lg text-foreground/70 mb-8">Your booking has been confirmed.</p>

            {isLoading ? (
              <p className="body-text text-foreground/70">Loading your booking confirmation...</p>
            ) : error ? (
              <p className="body-text text-destructive">{error}</p>
            ) : (
              <>
                <div className="bg-muted/30 p-6 rounded-lg mb-8 text-left space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Booking Reference</p>
                    <p className="font-serif text-2xl font-medium text-primary">
                      {booking?.reference || booking?.paymentReference || booking?.id}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-foreground/10">
                    <p className="text-sm text-foreground/60 mb-3">Session Details</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-foreground">Membership:</span>{' '}
                        <span className="text-foreground/70">{booking?.membership?.name}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Class:</span>{' '}
                        <span className="text-foreground/70">{classInfo?.name}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Instructor:</span>{' '}
                        <span className="text-foreground/70">{instructor?.name}</span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Date:</span>{' '}
                        <span className="text-foreground/70">
                          {bookingDate ? new Date(bookingDate).toLocaleDateString() : ''}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Time:</span>{' '}
                        <span className="text-foreground/70">{session?.time}</span>
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
                    We&apos;ve reserved your class successfully. Create an account to manage your bookings, reschedule sessions, view your payment history, receive membership benefits, and enjoy a personalized experience.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => router.push('/register')}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Create an Account
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-foreground/20"></div>
                    <span className="text-xs text-foreground/50 uppercase tracking-wider font-medium">Or</span>
                    <div className="flex-1 h-px bg-foreground/20"></div>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfirmationContent />
    </Suspense>
  )
}
