'use client'

import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Check, Clock3, Instagram, Mail, Sparkles } from 'lucide-react'

const fields = [
  { name: 'fullName', label: 'Full name', type: 'text', required: true },
  { name: 'whatsapp', label: 'WhatsApp number', type: 'tel', required: true },
  { name: 'email', label: 'Email address', type: 'email', required: true },
] as const

const options = {
  experience: ['New to reformer', 'Some experience', 'Very experienced'],
  attendance: ['Early morning', 'Midday', 'Evening', 'Flexible', 'Other'],
  frequency: ['Once a week', 'Twice a week', 'Three or more times', 'Not sure yet'],
  sessionType: ['Group reformer', 'Private sessions', 'A mix of both'],
  benefit: ['Founding member access', 'Priority booking', 'Launch offers', 'All of the above'],
}

type FormState = Record<string, string>

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0 } }

export default function WaitlistPage() {
  const [form, setForm] = useState<FormState>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [whatsappOpen, setWhatsappOpen] = useState(false)

  function openWhatsApp(question: string) {
    const message = question === 'Other'
      ? 'Hi Sculpt Lab, I have another question about joining the waitlist.'
      : `Hi Sculpt Lab, ${question}`
    window.open(`https://wa.me/23481266788?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setWhatsappOpen(false)
  }

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const required = ['fullName', 'whatsapp', 'email', 'experience', 'attendance', 'frequency', 'sessionType', 'benefit']
    if (required.some((key) => !form[key]?.trim())) {
      setError('Please complete the required fields so we can save your place.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
 <header className="overflow-hidden border-y border-border bg-foreground text-background py-3">
  <div className="relative flex overflow-hidden whitespace-nowrap">
    <motion.div
      className="flex shrink-0 items-center"
      animate={{ x: ["-50%", "0%"] }}
      transition={{
        duration: 18,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="flex items-center">
        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          Get ready, Lagos
        </span>

        <span className="text-primary-foreground/50">✦</span>

        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          The new Pilates experience is coming
        </span>

        <span className="text-primary-foreground/50">✦</span>

        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          Join the waitlist
        </span>

        <span className="text-primary-foreground/50">✦</span>
      </div>

      {/* Duplicate for seamless loop */}
      <div className="flex items-center">
        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          Get ready, Lagos
        </span>

        <span className="text-primary-foreground/50">✦</span>

        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          The new Pilates experience is coming
        </span>

        <span className="text-primary-foreground/50">✦</span>

        <span className="mx-6 text-xs font-medium uppercase tracking-[0.28em] text-primary-foreground">
          Join the waitlist
        </span>

        <span className="text-primary-foreground/50">✦</span>
      </div>
    </motion.div>
  </div>
</header>

      <main id="top">
      
  <section
    className="
      relative mx-auto grid max-w-7xl
      gap-12 overflow-hidden
      px-6 pt-12 pb-20

      bg-[url('/waitlist-meditation.jpg')]
      bg-cover bg-center
      after:absolute after:inset-0
      after:bg-background/65

      lg:grid-cols-[1.05fr_.95fr]
      lg:items-center
      lg:gap-16
      lg:overflow-visible
      lg:bg-none
      lg:px-10
      lg:py-10
      lg:after:hidden
    "
  >
    {/* LEFT CONTENT */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reveal}
      transition={{ duration: 0.7 }}
    className="relative z-10 lg:-translate-y-12"
    >
      <p
        className="
          mb-7 flex items-center gap-3
          text-xs font-medium uppercase
          tracking-[0.28em] text-primary
        "
      >
        <span className="h-px w-10 bg-primary" />
        Opening soon in Lagos
      </p>

     <h1
  className="
    max-w-3xl font-serif
    text-6xl leading-[0.88]
    tracking-[-0.045em]
    sm:text-8xl
    lg:text-[8rem]
  "
>
  Lagos,{" "}
  <em className="text-primary">
    get ready.
  </em>
</h1>

      <p
        className="
          mt-8 max-w-xl
          text-base leading-7
          text-muted-foreground
          sm:text-lg
        "
      >
A new reformer Pilates experience is coming to Lagos.
Be first in line for founding-member access, launch offers,
and opening news.
      </p>

      <a
        href="#waitlist"
        className="
          mt-9 inline-flex items-center gap-3
          rounded-full bg-primary
          px-6 py-3
          text-sm text-primary-foreground
          shadow-[0_0_0_6px_hsl(var(--primary)/.12),0_0_28px_hsl(var(--primary)/.45)]
          transition-transform
          hover:-translate-y-0.5
        "
      >
        <span>Get on the list</span>

        <motion.span
          animate={{
            y: [0, 4, 0],
            opacity: [1, 0.55, 1],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
          }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </a>
    </motion.div>

    {/* RIGHT IMAGE */}
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reveal}
      transition={{ duration: 0.8, delay: 0.15 }}
      className="
        relative z-10
        hidden overflow-hidden
        bg-muted
        lg:block
        lg:aspect-[5/5]
      "
    >
      <Image
        src="/waitlist-meditation.jpg"
        alt="A calm Pilates studio prepared for intentional movement"
        fill
        className="object-cover"
        priority
      />

      <div
        className="
          absolute bottom-5 left-5
          flex items-center gap-2
          bg-background/90
          px-4 py-3
          text-xs uppercase
          tracking-[0.18em]
        "
      >
        <Sparkles className="h-4 w-4 text-accent" />
        Lagos, Nigeria
      </div>
    </motion.div>
  </section>


        <section className="border-y border-border bg-secondary/20">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[.75fr_1.25fr] lg:px-10 lg:py-24">
            <div><p className="text-xs uppercase tracking-[.25em] text-primary">The studio</p><h2 className="mt-4 max-w-md font-serif text-4xl leading-tight sm:text-5xl">A softer kind of strength.</h2></div>
            <div className="grid gap-8 sm:grid-cols-3"><div><Clock3 className="h-5 w-5 text-primary" /><h3 className="mt-4 font-serif text-2xl">Slow down</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Intentional sessions built around breath, control, and your body&apos;s own pace.</p></div><div><Sparkles className="h-5 w-5 text-primary" /><h3 className="mt-4 font-serif text-2xl">Feel more</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">A beautiful, low-pressure room where every level has space to grow.</p></div><div><ArrowUpRight className="h-5 w-5 text-primary" /><h3 className="mt-4 font-serif text-2xl">Belong here</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">A founding community connected by movement, care, and consistency.</p></div></div>
          </div>
        </section>

        <section id="waitlist" className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.75fr_1.25fr] lg:px-10 lg:py-28">
          <div className="lg:sticky lg:top-10 lg:self-start"><p className="text-xs uppercase tracking-[.25em] text-primary">First access</p><h2 className="mt-4 font-serif text-5xl leading-none">Save your spot.</h2><p className="mt-6 max-w-sm leading-7 text-muted-foreground">Leave your details and we&apos;ll be in touch with opening news, founding offers, and a first look at the studio.</p><div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground"><Mail className="h-4 w-4 text-primary" /> enquiries@sculptlab.com.ng</div></div>
          {submitted ? <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[520px] flex-col items-center justify-center border border-border bg-secondary/20 p-8 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="h-6 w-6" /></span><h3 className="mt-6 font-serif text-4xl">You&apos;re on the list.</h3><p className="mt-3 max-w-sm leading-7 text-muted-foreground">We&apos;ll keep you close and share the next chapter as soon as it&apos;s ready.</p></motion.div> : <form onSubmit={submit} className="rounded-[2rem] border border-border bg-card p-5 shadow-[0_18px_60px_hsl(var(--foreground)/.08)] sm:p-8 lg:p-10" noValidate><div className="mb-8 flex items-start justify-between gap-6 border-b border-border pb-6"><div><p className="text-xs font-medium uppercase tracking-[.22em] text-primary">Your details</p><h3 className="mt-2 font-serif text-3xl">Save your place</h3></div><span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">8 quick questions</span></div><div className="grid gap-6 sm:grid-cols-2">{fields.map((field) => <label key={field.name} className="sm:col-span-1"><span className="text-sm">{field.label} <span className="text-primary" aria-hidden="true">*</span></span><input required={field.required} type={field.type} value={form[field.name] ?? ''} onChange={(e) => update(field.name, e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-base outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10" /></label>)}<SelectField name="experience" label="Reformer experience" options={options.experience} value={form.experience} update={update} /><SelectField name="attendance" label="Likely attendance time" options={options.attendance} value={form.attendance} update={update} /><SelectField name="frequency" label="Ideal frequency" options={options.frequency} value={form.frequency} update={update} /><SelectField name="sessionType" label="Session type" options={options.sessionType} value={form.sessionType} update={update} /><SelectField name="benefit" label="What would you love from joining early?" options={options.benefit} value={form.benefit} update={update} /><label className="sm:col-span-2"><span className="text-sm">Anything else you&apos;d like us to know?</span><textarea rows={3} value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} className="mt-2 w-full resize-none border-0 border-b border-border bg-transparent px-0 py-3 text-base outline-none transition-colors focus:border-primary focus:ring-0" /></label></div>{error && <p role="alert" className="mt-6 text-sm text-primary">{error}</p>}<button type="submit" className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3 text-sm text-primary-foreground transition-transform hover:-translate-y-0.5">Reserve my place <ArrowUpRight className="h-4 w-4" /></button><p className="mt-4 text-xs leading-5 text-muted-foreground">By joining, you agree to receive occasional studio updates. No noise, ever.</p></form>}
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10 lg:pb-28">
          <div className="grid items-center gap-8 border-t border-border pt-12 md:grid-cols-[1fr_.8fr] md:gap-16 lg:pt-20">
            <div className="relative aspect-[4/5] overflow-hidden bg-muted"><Image src="/waitlist-reformer.jpg" alt="Pilates movement practiced with intention" fill className="object-cover" /></div>
            <div className="max-w-sm"><p className="text-xs uppercase tracking-[.25em] text-primary">The practice</p><h2 className="mt-5 font-serif text-5xl leading-[.95] sm:text-6xl">Move with <em className="text-primary">intention.</em></h2><p className="mt-6 leading-7 text-muted-foreground">Every session is an invitation to slow down, listen closer, and let the smallest details make a difference.</p></div>
          </div>
          <div className="mt-16 grid items-center gap-8 border-t border-border pt-12 md:grid-cols-[.8fr_1fr] md:gap-16 lg:mt-24 lg:pt-20">
            <div className="order-2 max-w-sm md:order-1"><p className="text-xs uppercase tracking-[.25em] text-primary">The feeling</p><h2 className="mt-5 font-serif text-5xl leading-[.95] sm:text-6xl">Live with <em className="text-primary">balance.</em></h2><p className="mt-6 leading-7 text-muted-foreground">A stronger body, a quieter mind, and a rhythm that gives something back to the rest of your day.</p></div>
            <div className="relative order-1 aspect-[4/5] overflow-hidden bg-muted md:order-2"><Image src="/waitlist-studio.jpg" alt="A balanced reformer Pilates pose in a light-filled studio" fill className="object-cover" /></div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-5 border-t border-border px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><span className="flex items-center gap-3"><Image src="/logo.png" alt="Sculpt Lab" width={38} height={38} className="h-9 w-9 object-contain" /><span>Opening soon. Made for your next chapter.</span></span><a href="https://instagram.com" aria-label="Sculpt Lab on Instagram" className="transition-colors hover:text-primary"><Instagram className="h-5 w-5" /></a></footer>

      <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">{whatsappOpen && <motion.div initial={{ opacity: 0, y: 10, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} className="absolute bottom-20 right-0 w-72 rounded-2xl border border-border bg-card p-4 shadow-2xl"><div className="mb-3 flex items-center justify-between"><p className="font-serif text-lg">Ask us anything</p><button type="button" onClick={() => setWhatsappOpen(false)} className="text-muted-foreground" aria-label="Close WhatsApp questions">×</button></div><div className="grid gap-2"><button type="button" onClick={() => openWhatsApp('Can you tell me when the studio opens?')} className="rounded-xl border border-border px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5">When does the studio open?</button><button type="button" onClick={() => openWhatsApp('What are the class prices and founding member offers?')} className="rounded-xl border border-border px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5">What are the prices and offers?</button><button type="button" onClick={() => openWhatsApp('Other')} className="rounded-xl border border-border px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5">Other question</button></div></motion.div>}<button type="button" onClick={() => setWhatsappOpen((open) => !open)} aria-label="Ask Sculpt Lab about the waitlist on WhatsApp" className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-[0_0_0_6px_hsl(var(--accent)/.18),0_0_30px_hsl(var(--accent)/.55)] transition-transform hover:scale-110"><motion.span animate={{ scale: [1, 1.08, 1], opacity: [1, .78, 1] }} transition={{ duration: 1.8, repeat: Infinity }}><Image src="/whatsapp-logo.png" alt="WhatsApp" width={44} height={44} className="h-11 w-11 object-contain" /></motion.span></button></div>
    </div>
  )
}

function SelectField({ name, label, options, value, update }: { name: string; label: string; options: string[]; value?: string; update: (name: string, value: string) => void }) {
  return <label className="sm:col-span-1"><span className="text-sm">{label} <span className="text-primary" aria-hidden="true">*</span></span><select required value={value ?? ''} onChange={(e) => update(name, e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-base outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"><option value="">Select one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}
