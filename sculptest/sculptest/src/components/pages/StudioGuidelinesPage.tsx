'use client'

import { motion } from 'framer-motion'
import {
  Baby,
  CalendarCheck,
  Check,
  CircleAlert,
  HeartPulse,
  Landmark,
  LockKeyhole,
  MessageCircle,
  PhoneOff,
  Shirt,
  Sparkles,
  Timer,
  Users,
  Utensils,
  Waves,
} from 'lucide-react'
import Hero from '../Hero'

const sections = [
  { number: '01', title: 'Arrival & Punctuality', icon: Timer, points: ['Arrive 10–15 minutes before your first session and at least 5 minutes before subsequent sessions.', 'Classes begin promptly. Clients more than 10 minutes late may not be permitted to join for safety reasons.', 'Sessions end at their scheduled time regardless of late arrival.'] },
  { number: '02', title: 'Bookings & Rescheduling', icon: CalendarCheck, points: ['All classes must be booked in advance.', 'Bookings and rescheduling are available up to 1 hour before class.', 'Your space is confirmed once payment or membership validation is complete.', 'Please book the correct class level and keep your details current.'] },
  { number: '03', title: 'Cancellations & No-Shows', icon: CircleAlert, points: ['Cancel at least 1 hour before class.', 'Late cancellations and no-shows may be deducted from your package or membership.', 'Repeated late cancellations may restrict booking privileges.'] },
  { number: '04', title: 'Waitlist', icon: Users, points: ['Join the waitlist when a class is full.', 'Confirm your space within the stated timeframe when notified.', 'Remove yourself from the waitlist if you no longer wish to attend.'] },
  { number: '05', title: 'Studio Attire', icon: Shirt, points: ['Wear comfortable, fitted activewear suitable for Pilates.', 'Grip socks are required for reformer and equipment sessions.', 'Shoes and clothing with exposed metal or zippers are not permitted on the studio floor.'] },
  { number: '06', title: 'Hygiene & Personal Care', icon: Sparkles, points: ['Arrive clean and appropriately groomed.', 'Avoid strong perfumes and fragrances.', 'If you are visibly unwell or experiencing contagious symptoms, please stay home and reschedule.'] },
  { number: '07', title: 'Health, Injuries & Medical Clearance', icon: HeartPulse, points: ['First-time clients must share relevant injuries, conditions, limitations, or recent procedures with their instructor.', 'Obtain medical clearance before participating if you have an injury or medical condition.', 'Stop and notify your instructor if an exercise causes pain, dizziness, or unusual discomfort.'] },
  { number: '08', title: 'Studio Equipment', icon: Landmark, points: ['Use equipment carefully and only as instructed.', 'Do not adjust unfamiliar equipment without guidance.', 'Report equipment concerns or damage immediately and return equipment neatly.'] },
  { number: '09', title: 'Personal Belongings', icon: LockKeyhole, points: ['Keep valuables to a minimum; Sculpt LAB is not responsible for lost, misplaced, or stolen items.', 'Store belongings in designated areas and keep phones on silent.'] },
  { number: '10', title: 'Mobile Phones & Recording', icon: PhoneOff, points: ['Phone use during class is discouraged to preserve a calm, private atmosphere.', 'Do not photograph or record other clients without their express permission.', 'Commercial or promotional content requires prior studio approval.'] },
  { number: '11', title: 'Respect for Other Clients', icon: MessageCircle, points: ['Help us maintain an inclusive and respectful environment.', 'Disruptive, aggressive, discriminatory, or disrespectful behaviour will not be tolerated.', 'Keep conversations at a considerate volume.'] },
  { number: '12', title: 'Instructor Guidance', icon: Waves, points: ['Follow reasonable safety instructions and communicate when an exercise feels unsuitable.', 'Instructors may modify exercises according to your ability, experience, or physical needs.'] },
  { number: '13', title: 'Children & Guests', icon: Baby, points: ['Children and guests are not permitted in active studio areas unless expressly authorised.', 'Guests must remain in designated waiting areas and may not participate without a valid booking.'] },
  { number: '14', title: 'Food & Drink', icon: Utensils, points: ['Food is not permitted in the studio.', 'Water must be kept in a sealed, non-breakable bottle. Clean spills immediately.'] },
]

const policies = [
  ['Private & Duo Sessions', 'Sessions are reserved for booked clients. Cancellations and rescheduling follow the applicable booking policy.'],
  ['Memberships & Packages', 'Memberships and packages are personal and non-transferable. Use sessions within their stated validity period; rollovers do not apply.'],
  ['Personal Items & Studio Space', 'Keep belongings neatly stored, avoid occupying unnecessary space, and leave the studio pristine.'],
  ['Respect for the Studio Environment', 'Treat the studio, equipment, and furnishings with care. Keep noise low and respect personal space.'],
]

export default function StudioGuidelinesPage() {
  return (
    <div className="w-full">
      <Hero title="Studio Guidelines" subtitle="A calm, polished experience starts with shared care and consideration." imageSrc="/images/membership-monthly-unlimited.png" imageAlt="A calm Sculpt LAB Pilates studio" />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-accent">Studio etiquette & client policies</p>
          <h1 className="section-title mb-5 text-primary">Move with intention.</h1>
          <p className="body-text text-lg text-foreground/70">At Sculpt LAB, our policies protect the quality of your experience, your safety, and the welcoming environment we create together.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = section.icon
            return <motion.article key={section.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index % 2 * 0.06 }} className="glassmorphism p-6 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></div><span className="font-serif text-3xl text-primary/30">{section.number}</span></div>
              <h2 className="mb-4 font-serif text-2xl text-primary">{section.title}</h2>
              <ul className="space-y-3 text-sm leading-6 text-foreground/70">{section.points.map((point) => <li key={point} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" /><span>{point}</span></li>)}</ul>
            </motion.article>
          })}
        </div>

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          {policies.map(([title, text]) => <article key={title} className="border-t border-primary/20 py-6"><h2 className="mb-2 font-serif text-2xl text-primary">{title}</h2><p className="body-text text-sm text-foreground/70">{text}</p></article>)}
        </section>

        <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16 rounded-2xl bg-primary p-8 text-center text-primary-foreground sm:p-12">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] opacity-75">Pregnancy policy</p>
          <h2 className="mb-4 font-serif text-3xl">Private or Duo sessions only</h2>
          <p className="mx-auto max-w-2xl text-sm leading-6 opacity-85">For safety and individualised care, pregnant clients are not permitted in group Pilates sessions. Medical clearance is required, and pregnancy must be shared with the instructor before booking or attending.</p>
        </motion.section>

        <section className="mx-auto mt-20 max-w-3xl text-center"><p className="mb-4 text-sm uppercase tracking-[0.24em] text-accent">Our studio standard</p><div className="grid gap-3 font-serif text-2xl text-primary sm:grid-cols-2"><p>Arrive prepared.</p><p>Move with intention.</p><p>Respect the space.</p><p>Respect each other.</p><p className="sm:col-span-2">Leave feeling better than when you arrived.</p></div></section>
      </main>
    </div>
  )
}
