import { Suspense } from 'react'
import BookingRoute from '@/src/components/BookingRoute'

function BookPageContent() {
  return <BookingRoute />
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookPageContent />
    </Suspense>
  )
}
