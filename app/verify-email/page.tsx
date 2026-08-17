import { Suspense } from 'react'
import { VerifyEmailPage } from '@/src/components/pages/AuthPages'

export default function Page() {
  return <Suspense fallback={<main className="flex min-h-[70vh] items-center justify-center">Loading…</main>}><VerifyEmailPage /></Suspense>
}
