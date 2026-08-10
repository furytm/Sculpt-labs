'use client'

import { useState } from 'react'
import BookingChoiceModal from './BookingChoiceModal'

export default function BookingNowTrigger({
  className,
  children = 'Book Now',
  onOpen,
}: {
  className?: string
  children?: React.ReactNode
  onOpen?: () => void
}) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    onOpen?.()
    setOpen(true)
  }

  return (
    <>
      <button type="button" className={className} onClick={handleOpen}>
        {children}
      </button>
      <BookingChoiceModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
