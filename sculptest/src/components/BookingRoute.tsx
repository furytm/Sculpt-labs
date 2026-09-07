'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'
import BookPage from './pages/BookPage'
import MemberBookingFlow from './MemberBookingFlow'

export default function BookingRoute() {
  const params = useSearchParams()
  const { user, loading } = useAuth()
  if (loading) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your booking flow...</main>
  if (user && params.get('classId')) return <MemberBookingFlow />
  return <BookPage />
}
