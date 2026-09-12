'use client'

import { useSearchParams } from 'next/navigation'
import { useAuth } from './AuthProvider'
import BookPage from './pages/BookPage'
import MemberBookingFlow from './MemberBookingFlow'

export default function BookingRoute() {
  const params = useSearchParams()
  const { user, loading } = useAuth()
  const memberFlow = params.get('member') === '1'
  if (loading) return <main className="flex min-h-[70vh] items-center justify-center text-muted-foreground">Loading your booking flow...</main>
  if (user || memberFlow) return <MemberBookingFlow />
  return <BookPage />
}
