'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock3, Dumbbell, Sparkles } from 'lucide-react'
import Hero from '../Hero'

const weeklySchedule = [
  { day: 'Monday', sessions: [['10:00 AM', 'Intermediate'], ['11:00 AM', 'Beginner'], ['12:00 PM', 'Beginner'], ['1:00 PM', 'Intermediate']] },
  { day: 'Tuesday', sessions: [['7:00 AM', 'Intermediate'], ['8:00 AM', 'Reformer Stretch'], ['9:00 AM', 'Beginner'], ['11:00 AM', 'Intermediate'], ['2:00 PM', 'Beginner'], ['3:00 PM', 'Pilates and Strength'], ['4:00 PM', 'Intermediate'], ['5:00 PM', 'Beginner']] },
  { day: 'Wednesday', sessions: [['9:00 AM', 'Intermediate'], ['4:00 PM', 'Intermediate'], ['5:00 PM', 'Beginner'], ['6:00 PM', 'Beginner']] },
  { day: 'Thursday', sessions: [['8:00 AM', 'Pilates + Strength'], ['9:00 AM', 'Intermediate'], ['10:00 AM', 'Pilates + Strength'], ['11:00 AM', 'Beginner'], ['3:00 PM', 'Intermediate'], ['4:00 PM', 'Beginner']] },
  { day: 'Friday', sessions: [['11:00 AM', 'Beginner'], ['12:00 PM', 'Intermediate'], ['1:00 PM', 'Reformer Stretch'], ['2:00 PM', 'Beginner']] },
  { day: 'Saturday', sessions: [['7:00 AM', 'Beginner'], ['8:00 AM', 'Intermediate'], ['9:00 AM', 'Beginner'], ['10:00 AM', 'Pilates + Strength']] },
]

const classTone = (name: string) => {
  if (name.includes('Reformer')) return 'bg-accent/15 text-accent-foreground'
  if (name.includes('Strength')) return 'bg-secondary/40 text-primary'
  return 'bg-primary/10 text-primary'
}

export default function SchedulePage() {
  return (
    <div className="w-full overflow-hidden">
      <Hero
        title="Sculpt LAB Schedule"
        subtitle="Make space for strength, control, and the kind of movement that stays with you."
        imageSrc="/images/schedule-hero-pilates-resting.png"
        imageAlt="Pilates class in the Sculpt LAB studio"
      />

      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">Move with intention</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-primary sm:text-5xl">Your week, sculpted.</h2>
            </div>
            <div className="flex gap-4 border-l border-primary/20 pl-5 text-sm leading-7 text-foreground/70 sm:pl-8">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <p>Choose a pace that feels right for your body. Our timetable blends foundational, intermediate, reformer stretch, and strength-led sessions.</p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weeklySchedule.map((day, index) => (
              <motion.article
                key={day.day}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: index * 0.05 }}
                className="group border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/5 sm:p-6"
              >
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <h3 className="font-serif text-2xl text-primary">{day.day}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{day.sessions.length} classes</span>
                </div>
                <div className="mt-5 space-y-3">
                  {day.sessions.map(([time, type]) => (
                    <div key={`${day.day}-${time}-${type}`} className="flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2 text-sm text-foreground/70"><Clock3 className="h-4 w-4 text-accent" aria-hidden="true" />{time}</span>
                      <span className={`rounded-full px-3 py-1 text-right text-[11px] font-medium leading-4 ${classTone(type)}`}>{type}</span>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:grid-cols-[0.8fr_1.2fr] sm:px-6 lg:px-8 lg:items-center">
          <div className="relative min-h-80 overflow-hidden rounded-2xl soft-shadow sm:min-h-[420px]">
            <Image src="/images/studio-class.png" alt="Sculpt LAB Pilates class" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-accent"><Dumbbell className="h-4 w-4" aria-hidden="true" /> Class notes</div>
            <h2 className="mt-4 font-serif text-4xl text-primary">Arrive ready to feel better.</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-foreground/70">Please arrive a few minutes early, wear comfortable movement clothes, and let your instructor know how your body is feeling that day. Every class is an invitation to work with your body, not against it.</p>
            <Link href="/book" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">Book your session <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
