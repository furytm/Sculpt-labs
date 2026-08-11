'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export default function BookingChoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-foreground/50 p-3 backdrop-blur-sm sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a booking type"
          onClick={onClose}
        >
          <motion.div
            className="relative my-auto w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-2xl sm:p-5"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="Close booking options" className="absolute right-3 top-3 rounded-full p-1.5 text-foreground/60 transition hover:bg-primary/10 hover:text-primary">
              <X className="h-4 w-4" />
            </button>

            <div className="grid gap-3 pt-1 sm:grid-cols-2">
              <Link href="/book?type=GROUP" onClick={onClose} className="group rounded-xl border-2 border-primary/20 bg-primary/5 p-4 transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-xl font-medium text-primary">Group Classes</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  View memberships <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>

              <Link href="/book?type=PRIVATE" onClick={onClose} className="group rounded-xl border-2 border-border bg-muted/20 p-4 transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10">
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h2 className="font-serif text-xl font-medium text-primary">Private Sessions</h2>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  View private session <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
