'use client'

import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { getClassById } from '@/lib/data/classes'
import BookingNowTrigger from './BookingNowTrigger'

const classSchedules: Record<string, Array<[string, string]>> = {
  Beginner: [
    ['Monday', '11:00 AM'], ['Monday', '12:00 PM'], ['Tuesday', '9:00 AM'], ['Tuesday', '2:00 PM'],
    ['Tuesday', '5:00 PM'], ['Wednesday', '5:00 PM'], ['Wednesday', '6:00 PM'], ['Thursday', '11:00 AM'],
    ['Thursday', '4:00 PM'], ['Friday', '11:00 AM'], ['Friday', '2:00 PM'], ['Saturday', '7:00 AM'],
    ['Saturday', '9:00 AM'],
  ],
  Intermediate: [
    ['Monday', '10:00 AM'], ['Monday', '1:00 PM'], ['Tuesday', '7:00 AM'], ['Tuesday', '11:00 AM'],
    ['Tuesday', '4:00 PM'], ['Wednesday', '9:00 AM'], ['Wednesday', '4:00 PM'], ['Thursday', '9:00 AM'],
    ['Thursday', '3:00 PM'], ['Friday', '12:00 PM'], ['Saturday', '8:00 AM'],
  ],
  'Reformer Stretch': [['Tuesday', '8:00 AM'], ['Friday', '1:00 PM']],
  'Pilates + Strength': [['Tuesday', '3:00 PM'], ['Thursday', '8:00 AM'], ['Thursday', '10:00 AM'], ['Saturday', '10:00 AM']],
}

export default function ClassScheduleModal({ classId, onClose }: { classId: string | null; onClose: () => void }) {
  const selectedClass = classId ? getClassById(classId) : undefined
  const schedules = selectedClass ? classSchedules[selectedClass.name] ?? [] : []

  useEffect(() => {
    if (!classId) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKeyDown)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', handleKeyDown) }
  }, [classId, onClose])

  return <AnimatePresence>
    {classId && selectedClass ? <motion.div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-foreground/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="class-schedule-title" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="relative w-full max-w-lg border border-border bg-background p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()} initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
        <button type="button" onClick={onClose} aria-label="Close class schedule" className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-primary"><X className="h-5 w-5" /></button>
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Class schedule</p>
        <h2 id="class-schedule-title" className="mt-3 font-serif text-3xl text-primary">{selectedClass.name}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{selectedClass.description}</p>
        <h3 className="mt-7 font-serif text-xl text-primary">Available days and times</h3>
        {schedules.length ? <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{schedules.map(([day, time]) => <div key={`${day}-${time}`} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/30 px-3 py-3 text-sm"><p className="font-medium text-primary">{day}</p><p className="text-muted-foreground">{time}</p></div>)}</div> : <p className="mt-4 border border-border p-4 text-sm text-muted-foreground">No active schedules are available for this class.</p>}
        <BookingNowTrigger className="mt-7 w-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90" classId={classId} onOpen={onClose}>Book Now</BookingNowTrigger>
      </motion.div>
    </motion.div> : null}
  </AnimatePresence>
}
