'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CalendarDays, X } from 'lucide-react'
import Link from 'next/link'

export default function BookingChoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="booking-choice-title" onClick={onClose}>
          <motion.div className="relative w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-2xl sm:p-8" initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={{ type: 'spring', stiffness: 280, damping: 24 }} onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={onClose} aria-label="Close booking options" className="absolute right-4 top-4 rounded-full p-2 text-foreground/60 transition hover:bg-primary/10 hover:text-primary"><X className="h-5 w-5" /></button>
            <div className="mb-7 max-w-lg"><p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">Sculpt LAB booking</p><h2 id="booking-choice-title" className="font-serif text-3xl font-medium text-primary sm:text-4xl">What are you booking?</h2><p className="mt-3 text-foreground/70">Choose the experience that feels right for you. You can select your membership and share your details next.</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/book?type=GROUP" onClick={onClose} className="group rounded-xl border-2 border-primary/20 bg-primary/5 p-5 transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10"><span className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground"><CalendarDays className="h-5 w-5" /></span><h3 className="font-serif text-2xl font-medium text-primary">Group Classes</h3><p className="mt-2 min-h-12 text-sm leading-6 text-foreground/70">Train alongside the Sculpt LAB community in focused, expert-led sessions.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">View memberships <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>
              <Link href="/book?type=PRIVATE" onClick={onClose} className="group rounded-xl border-2 border-border bg-muted/20 p-5 transition hover:-translate-y-1 hover:border-primary hover:bg-primary/10"><span className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background"><CalendarDays className="h-5 w-5" /></span><h3 className="font-serif text-2xl font-medium text-primary">Private Sessions</h3><p className="mt-2 min-h-12 text-sm leading-6 text-foreground/70">A tailored one-to-one practice with dedicated instructor attention.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">View private options <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
