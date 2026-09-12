'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Clock3, Infinity, Sparkles } from 'lucide-react'
import Hero from '../Hero'
import { useEffect, useState } from 'react'
import { formatPrice, getMemberships, Membership } from '@/lib/data/membershipmain'

const membershipImages: Record<string, string> = {
  'intro-week': '/images/membership-intro-week.png',
  'founding-member': '/images/membership-founding-member.png',
  'single-class': '/images/membership-single-class.png',
  'monthly-5': '/images/membership-monthly-5.png',
  'monthly-10': '/images/membership-monthly-10.png',
  'monthly-unlimited': '/images/membership-monthly-unlimited.png',
  'quarterly-5': '/images/membership-quarterly-5.png',
  'quarterly-10': '/images/membership-quarterly-10.png',
  'quarterly-20': '/images/membership-quarterly-20.png',
  'quarterly-48': '/images/membership-quarterly-48.png',
  'annual-unlimited': '/images/membership-annual-unlimited.png',
}

const imageForPlan = (plan: Membership) => {
  const key = plan.slug || plan.id
  return membershipImages[key] || '/images/membership-monthly-unlimited.png'
}

const isMonthly = (plan: Membership) => plan.period.includes('/month')

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMemberships()
      .then(setMemberships)
      .catch(() => setError('Unable to load memberships. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading memberships...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {error}
      </div>
    )
  }

  return (
    <div className="w-full overflow-hidden">
      <Hero
        title="Memberships"
        subtitle="Choose the rhythm that makes showing up feel effortless"
        imageSrc="/images/membership-monthly.png"
        imageAlt="Pilates studio with reformers"
      />

      <section className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <p className="mb-3 text-xs   text-primary font-semibold uppercase tracking-[0.24em] text-accent-foreground/70">
              Find your frequency
            </p>

            <h2 className="section-title text-primary">
              A plan for every kind of commitment.
            </h2>

            <p className="body-text mt-4 text-foreground/65">
              All memberships are presented with their billing terms before payment. No surprises at checkout.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {memberships.map((plan, idx) => {
              const monthly = isMonthly(plan)
              const founding = plan.id === 'founding-member'

              return (
                <motion.article
                  id={plan.id === 'monthly-10' ? 'monthly-10' : undefined}
                  key={plan.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: idx * 0.06, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className={`group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl ${
                    founding
                      ? 'border-primary ring-2 ring-primary/15'
                      : 'border-border'
                  }`}
                >
                  <div className="relative aspect-[4/2] overflow-hidden">
                    <Image
                      src={imageForPlan(plan)}
                      alt={`${plan.name} membership`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />

                    <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-primary-foreground">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                        {plan.badge ||
                          (monthly ? 'Monthly access' : 'Flexible access')}
                      </span>

                      {founding ? (
                        <Sparkles className="h-5 w-5" />
                      ) : plan.id === 'intro-week' ? (
                        <Clock3 className="h-5 w-5" />
                      ) : (
                        <Infinity className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <h3 className="font-serif text-2xl font-medium text-primary">
                      {plan.name}
                    </h3>

                    <p className="body-text mt-2 min-h-12 text-sm text-foreground/60">
                      {plan.description}
                    </p>

                    <div className="mt-5 flex items-baseline gap-2">
                      {plan.id === 'monthly-10' && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(plan.originalPrice || 165000)}
                        </span>
                      )}

                      <span className="font-serif text-4xl font-medium text-primary">
                        {formatPrice(plan.price)}
                      </span>

                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>

                    {plan.id === 'monthly-10' && (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                        Limited-time offer · 10 classes / month
                      </p>
                    )}

                    <Link
                      href={`/book?membershipId=${plan.id}`}
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium transition-colors ${
                        plan.highlighted
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'border border-primary text-primary hover:bg-primary/5'
                      }`}
                    >
                      {plan.highlighted
                        ? 'Join founding members'
                        : 'Choose plan'}

                      <ArrowUpRight className="h-4 w-4" />
                    </Link>

                    <div className="mt-7 space-y-3 border-t pt-6">
                      {plan.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-start gap-3 text-sm text-foreground/70"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}