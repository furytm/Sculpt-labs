'use client'

import Image from 'next/image'

import { FormEvent, useEffect, useRef, useState } from 'react'
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
  const successRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{
    type: 'loading' | 'success' | 'error'
    message: string
  } | null>(null)
  const [whatsappOpen, setWhatsappOpen] = useState(false)

  useEffect(() => {
    if (submitted && successRef.current) {
      successRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [submitted])
  function openWhatsApp(question: string) {
    const message = question === 'Other'
      ? 'Hi Sculpt Lab, I have another question about joining the waitlist.'
      : `Hi Sculpt Lab, ${question}`
    window.open(`https://wa.me/2348086828877?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setWhatsappOpen(false)
  }

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const required = [
      'fullName',
      'whatsapp',
      'email',
      'experience',
      'attendance',
      'frequency',
      'sessionType',
      'benefit',
    ]

    if (required.some((key) => !form[key]?.trim())) {
      setError('Please complete the required fields so we can save your place.')

      setToast({
        type: 'error',
        message: 'Please complete all required fields.',
      })

      setTimeout(() => {
        setToast(null)
      }, 3500)

      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address.')

      setToast({
        type: 'error',
        message: 'Please enter a valid email address.',
      })

      setTimeout(() => {
        setToast(null)
      }, 3500)

      return
    }

    setError('')
    setIsSubmitting(true)

    setToast({
      type: 'loading',
      message: 'Saving your spot...',
    })

    try {
      const payload = {
        access_key: '89c7a85f-8cb7-498c-bfec-bb755d87d54b',
        subject: 'New Sculpt Lab Waitlist Signup',

        fullName: form.fullName,
        whatsapp: form.whatsapp,
        email: form.email,

        experience: form.experience,
        attendance: form.attendance,
        frequency: form.frequency,
        sessionType: form.sessionType,
        benefit: form.benefit,
        notes: form.notes || '',
      }

      const response = await fetch(
        'https://api.web3forms.com/submit',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'Something went wrong. Please try again.'
        )
      }


      await fetch(
        'https://hook.eu1.make.com/ufxgi1ybgbmptbzdey546o0z5vo28xo2',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: form.fullName,
            whatsapp: form.whatsapp,
            email: form.email,
            experience: form.experience,
            attendance: form.attendance,
            frequency: form.frequency,
            sessionType: form.sessionType,
            benefit: form.benefit,
            notes: form.notes || '',
            submittedAt: new Date().toISOString(),
          }),
        }
      )
      setSubmitted(true)

      setToast({
        type: 'success',
        message: "You're on the Sculpt Lab waitlist!",
      })

      setForm({})

      setTimeout(() => {
        setToast(null)
      }, 5000)
    } catch (submitError) {
      console.error('Waitlist submission error:', submitError)

      setError(
        'We could not save your place right now. Please try again.'
      )

      setToast({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      })



      setTimeout(() => {
        setToast(null)
      }, 4000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">



      {/* TOAST */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          className="fixed right-5 top-5 z-[100] w-[calc(100%-2.5rem)] max-w-sm"
        >
          <div
            className={`
            flex items-center gap-4 rounded-2xl
            border border-border
            bg-card/95 p-4
            shadow-[0_20px_60px_hsl(var(--foreground)/.15)]
            backdrop-blur-xl
          `}
          >
            {/* ICON */}
            <span
              className={`
              flex h-10 w-10 shrink-0 items-center justify-center
              rounded-full
              ${toast.type === 'success'
                  ? 'bg-accent text-accent-foreground'
                  : toast.type === 'error'
                    ? 'bg-destructive text-destructive-foreground'
                    : 'bg-primary/10 text-primary'
                }
            `}
            >
              {toast.type === 'loading' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </span>

            {/* MESSAGE */}
            <div className="min-w-0">
              <p className="font-serif text-lg">
                {toast.type === 'success'
                  ? 'Welcome to Sculpt Lab.'
                  : toast.type === 'loading'
                    ? 'Almost there...'
                    : 'Something went wrong.'}
              </p>

              <p className="mt-0.5 text-sm text-muted-foreground">
                {toast.message}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* HEADER */}

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
      <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
        Get ready, Lagos
      </span>

      <span className="text-primary-foreground/50">✦</span>

      <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
        The new Pilates experience is coming
      </span>

      <span className="text-primary-foreground/50">✦</span>

      <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
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

        <section
          id="waitlist"
          className="
    mx-auto grid max-w-7xl gap-12
    px-6 py-20
    lg:grid-cols-[.75fr_1.25fr]
    lg:px-10 lg:py-28
  "
        >
          {/* LEFT SIDE */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="text-xs uppercase tracking-[.25em] text-primary">
              First access
            </p>

            <h2 className="mt-4 font-serif text-5xl leading-none">
              Save your spot.
            </h2>

            <p className="mt-6 max-w-sm leading-7 text-muted-foreground">
              Leave your details and we&apos;ll be in touch with opening news,
              founding offers, and a first look at the studio.
            </p>

            <div className="mt-10 flex items-center gap-4 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              enquiries@sculptlab.com.ng
            </div>
          </div>

          {/* RIGHT SIDE */}
          {submitted ? (
            <motion.div
              ref={successRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.5 }}
              className="
        flex min-h-[520px]
        flex-col items-center justify-center
        rounded-[2rem]
        border border-border
        bg-secondary/20
        px-6 py-12
        text-center
        sm:px-10
      "
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Check className="h-7 w-7" />
              </span>

              <p className="mt-7 text-xs font-medium uppercase tracking-[0.25em] text-primary">
                Welcome to Sculpt Lab
              </p>

              <h3 className="mt-3 font-serif text-5xl leading-none sm:text-6xl">
                You&apos;re in.
              </h3>

              <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
                Welcome to the beginning of something beautiful.
                We&apos;ll be in touch with opening news, founding-member access,
                and your first look at Sculpt Lab.
              </p>

              <a
                href="#top"
                className="
          mt-8 inline-flex items-center gap-2
          rounded-full bg-primary
          px-6 py-3
          text-sm text-primary-foreground
          transition-transform
          hover:-translate-y-0.5
        "
              >
                Back to the top
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </motion.div>
          ) : (
            <form
              onSubmit={submit}
              className="
        rounded-[2rem]
        border border-border
        bg-card
        p-5
        shadow-[0_18px_60px_hsl(var(--foreground)/.08)]
        sm:p-8
        lg:p-10
      "
              noValidate
            >
              {/* FORM HEADER */}
              <div className="mb-8 flex items-start justify-between gap-6 border-b border-border pb-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[.22em] text-primary">
                    Your details
                  </p>

                  <h3 className="mt-2 font-serif text-3xl">
                    Save your place
                  </h3>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  8 quick questions
                </span>
              </div>

              {/* FORM FIELDS */}
              <div className="grid gap-6 sm:grid-cols-2">
                {fields.map((field) => (
                  <label
                    key={field.name}
                    className="sm:col-span-1"
                  >
                    <span className="text-sm">
                      {field.label}{' '}
                      <span
                        className="text-primary"
                        aria-hidden="true"
                      >
                        *
                      </span>
                    </span>

                    <input
                      required={field.required}
                      type={field.type}
                      value={form[field.name] ?? ''}
                      onChange={(e) =>
                        update(field.name, e.target.value)
                      }
                      className="
                mt-2 w-full rounded-xl
                border border-border
                bg-background/70
                px-4 py-3
                text-base
                outline-none
                transition-all
                placeholder:text-muted-foreground/60
                focus:border-primary
                focus:bg-background
                focus:ring-4
                focus:ring-primary/10
              "
                    />
                  </label>
                ))}

                <SelectField
                  name="experience"
                  label="Reformer experience"
                  options={options.experience}
                  value={form.experience}
                  update={update}
                />

                <SelectField
                  name="attendance"
                  label="Likely attendance time"
                  options={options.attendance}
                  value={form.attendance}
                  update={update}
                />

                <SelectField
                  name="frequency"
                  label="Ideal frequency"
                  options={options.frequency}
                  value={form.frequency}
                  update={update}
                />

                <SelectField
                  name="sessionType"
                  label="Session type"
                  options={options.sessionType}
                  value={form.sessionType}
                  update={update}
                />

                <SelectField
                  name="benefit"
                  label="What would you love from joining early?"
                  options={options.benefit}
                  value={form.benefit}
                  update={update}
                />

                <label className="sm:col-span-2">
                  <span className="text-sm">
                    Anything else you&apos;d like us to know?
                  </span>

                  <textarea
                    rows={3}
                    value={form.notes ?? ''}
                    onChange={(e) =>
                      update('notes', e.target.value)
                    }
                    className="
              mt-2 w-full resize-none
              border-0 border-b border-border
              bg-transparent
              px-0 py-3
              text-base
              outline-none
              transition-colors
              focus:border-primary
              focus:ring-0
            "
                  />
                </label>
              </div>

              {/* ERROR */}
              {error && (
                <p
                  role="alert"
                  className="mt-6 text-sm text-primary"
                >
                  {error}
                </p>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="
          mt-9 inline-flex items-center gap-3
          rounded-full bg-primary
          px-7 py-3
          text-sm text-primary-foreground
          transition-all
          hover:-translate-y-0.5
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
        "
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="
                h-4 w-4 animate-spin
                rounded-full border-2
                border-primary-foreground/30
                border-t-primary-foreground
              "
                    />
                    Saving your spot...
                  </>
                ) : (
                  <>
                    Get on the list
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                By joining, you agree to receive occasional studio updates.
                No noise, ever.
              </p>
            </form>
          )}
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
  {/*
<div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
  {whatsappOpen && (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="absolute bottom-20 right-0 w-72 rounded-2xl border border-border bg-white p-4 text-foreground shadow-2xl"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-serif text-lg">Ask us anything</p>

        <button
          type="button"
          onClick={() => setWhatsappOpen(false)}
          className="text-muted-foreground"
          aria-label="Close WhatsApp questions"
        >
          ×
        </button>
      </div>

      <div className="grid gap-2">
        <button
          type="button"
          onClick={() =>
            openWhatsApp("Can you tell me when the studio opens?")
          }
          className="rounded-xl border border-border bg-white px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
        >
          When does the studio open?
        </button>

        <button
          type="button"
          onClick={() =>
            openWhatsApp(
              "What are the class prices and founding member offers?"
            )
          }
          className="rounded-xl border border-border bg-white px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
        >
          What are the prices and offers?
        </button>

        <button
          type="button"
          onClick={() => openWhatsApp("Other")}
          className="rounded-xl border border-border bg-white px-3 py-3 text-left text-sm transition-colors hover:border-primary hover:bg-primary/5"
        >
          Other question
        </button>
      </div>
    </motion.div>
  )}

  <button
    type="button"
    onClick={() => setWhatsappOpen((open) => !open)}
    aria-label="Ask Sculpt Lab about the waitlist on WhatsApp"
    className="flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-[0_0_0_6px_hsl(var(--accent)/.18),0_0_30px_hsl(var(--accent)/.55)] transition-transform hover:scale-110"
  >
    <motion.span
      animate={{ scale: [1, 1.08, 1], opacity: [1, 0.78, 1] }}
      transition={{ duration: 1.8, repeat: Infinity }}
    >
      <Image
        src="/images/whatsapplogo.jpg"
        alt="WhatsApp"
        width={44}
        height={44}
        className="h-11 w-11 object-contain"
      />
    </motion.span>
  </button>
</div>
*/}
    </div>
  )
}
      function SelectField({name, label, options, value, update}: {name: string; label: string; options: string[]; value?: string; update: (name: string, value: string) => void }) {
  return <label className="sm:col-span-1"><span className="text-sm">{label} <span className="text-primary" aria-hidden="true">*</span></span><select required value={value ?? ''} onChange={(e) => update(name, e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-base outline-none transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"><option value="">Select one</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
}
