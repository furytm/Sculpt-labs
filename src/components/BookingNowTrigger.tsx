'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import BookingChoiceModal from './BookingChoiceModal'

export default function BookingNowTrigger({
  classId,
  className,
  children = 'Book Now',
  onOpen,
}: {
  classId?: string
  className?: string
  children?: React.ReactNode
  onOpen?: () => void
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { user, loading } = useAuth()

  const handleOpen = () => {
    onOpen?.()
    if (!loading && user) {
      router.push(classId ? `/book?classId=${encodeURIComponent(classId)}` : '/classes')
      return
    }
    setOpen(true)
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleOpen}
      >
        {children}
      </button>

      <BookingChoiceModal
        open={open}
        onClose={() => setOpen(false)}
        classId={classId}
      />
    </>
  )
}
