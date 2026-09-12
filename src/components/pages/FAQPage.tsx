'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Hero from '../Hero'

const faqs = [
  ['What should I wear?', 'Wear comfortable, fitted activewear that lets your instructor see your alignment. Grip socks are required for reformer and equipment sessions.'],
  ['How early should I arrive?', 'Please arrive 10–15 minutes before your first session and at least 5 minutes before later sessions so you can settle in safely.'],
  ['Can beginners join?', 'Yes. Reformer Basics and Mat Pilates are welcoming starting points. Your instructor will adapt exercises to your experience and needs.'],
  ['How do cancellations work?', 'Bookings can be cancelled or rescheduled up to 1 hour before class. Late cancellations and no-shows may be deducted from your package or membership.'],
  ['Can I attend while pregnant?', 'Pregnant clients are currently welcomed in private or duo sessions only, with medical clearance and advance communication with the instructor.'],
  ['What if I have an injury?', 'Share relevant injuries, conditions, limitations, or recent procedures before attending. Your instructor can modify exercises and may request medical clearance where appropriate.'],
  ['Where can I see available sessions?', 'Visit the Schedule page to browse sessions by day and time, then choose a class to begin booking.'],
]

export default function FAQPage() {
  return <div className="w-full"><Hero title="Frequently Asked Questions" subtitle="Everything you need to feel prepared for your next session." imageSrc="/images/studio-interior.jpg" imageAlt="Sculpt LAB studio interior" /><main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24"><p className="mb-4 text-center text-sm uppercase tracking-[0.24em] text-accent">Helpful before you arrive</p><h1 className="section-title mb-10 text-center text-primary">Move with confidence.</h1><Accordion type="single" collapsible className="w-full">{faqs.map(([question, answer], index) => <AccordionItem value={`item-${index}`} key={question}><AccordionTrigger className="text-left font-serif text-xl text-primary">{question}</AccordionTrigger><AccordionContent className="body-text text-foreground/70">{answer}</AccordionContent></AccordionItem>)}</Accordion></main></div>
}
