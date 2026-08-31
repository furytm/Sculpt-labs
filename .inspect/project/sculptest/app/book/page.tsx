import { Suspense } from 'react'
import BookPage from '@/src/components/pages/BookPage'

function BookPageContent() {
  return <BookPage />
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BookPageContent />
    </Suspense>
  )
}
