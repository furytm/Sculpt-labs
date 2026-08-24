// import HomePage from '@/src/components/pages/HomePage'

// export default function Page() {
//   return <HomePage />
// }
import type { Metadata } from 'next'
import WaitlistPage from '@/src/components/pages/WaitlistPage'

export const metadata: Metadata = {
  title: 'Sculpt Lab — Join the Waitlist',
  description: 'Be first to experience a more intentional way to move at Sculpt Lab.',
}

export default function Page() {
  return <WaitlistPage />
}
