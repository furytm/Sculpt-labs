'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Hero from '../Hero'
import IconRenderer from '../IconRenderer'

export default function MembershipsPage() {
  const memberships = [
    {
      name: 'Starter',
      price: '$79',
      period: '/month',
      description: 'Perfect for exploring pilates',
      classes: 4,
      features: [
        '4 classes per month',
        'Access to all class types',
        'Member community',
        'Email support',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Practitioner',
      price: '$129',
      period: '/month',
      description: 'For committed practitioners',
      classes: 8,
      features: [
        '8 classes per month',
        'Unlimited class swaps',
        'Priority booking',
        '10% off private sessions',
        'Monthly wellness workshop',
        'Priority support',
      ],
      cta: 'Join Now',
      highlighted: true,
    },
    {
      name: 'Unlimited',
      price: '$189',
      period: '/month',
      description: 'Total transformation',
      classes: 'Unlimited',
      features: [
        'Unlimited classes',
        'Free private sessions (1/month)',
        'Priority booking',
        '20% off additional private sessions',
        'Monthly wellness workshop',
        'Exclusive member events',
        '24/7 studio access',
        'Dedicated support',
      ],
      cta: 'Get Unlimited',
      highlighted: false,
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero
        title="Memberships"
        subtitle="Choose a membership that fits your pilates lifestyle"
        imageSrc="/images/stock-mat-group.jpg"
        imageAlt="Pilates studio community"
      />

      {/* Memberships Cards */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {memberships.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl overflow-hidden transition-all duration-300 ${
                  plan.highlighted
                    ? 'md:scale-105 glassmorphism border-2 border-primary shadow-2xl'
                    : 'glassmorphism'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <h3 className="font-serif text-2xl font-medium text-primary mb-2">
                    {plan.name}
                  </h3>
                  <p className="body-text text-sm text-foreground/60 mb-6">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="font-serif text-4xl font-medium text-primary">
                      {plan.price}
                    </span>
                    <span className="text-foreground/60">{plan.period}</span>
                  </div>

                  <div className="mb-8 p-4 bg-primary/5 rounded-lg">
                    <p className="font-serif text-lg font-medium text-primary">
                      {typeof plan.classes === 'number' ? `${plan.classes} Classes` : 'Unlimited'}
                    </p>
                  </div>

                  <Link
                    href="/book"
                    className={`block w-full text-center px-6 py-3 font-sans font-medium rounded-lg transition-colors mb-8 ${
                      plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-2 border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <motion.div
                        key={featureIdx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: featureIdx * 0.05 }}
                        className="flex gap-3 items-start"
                      >
                        <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <span className="body-text text-sm text-foreground/70">
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title text-primary mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            {[
              {
                question: 'Can I pause my membership?',
                answer: 'Yes, members can pause for up to 2 months per year.',
              },
              {
                question: 'Do classes roll over each month?',
                answer: 'Classes do not roll over, but you can book in advance.',
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'You can change your plan anytime. Changes take effect on your next billing date.',
              },
              {
                question: 'What if I need to cancel?',
                answer: 'You can cancel anytime with a 7-day notice.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glassmorphism p-6"
              >
                <h3 className="font-serif font-medium text-primary mb-2">
                  {faq.question}
                </h3>
                <p className="body-text text-sm text-foreground/70">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Member Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title text-primary mb-4">Member Perks</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: '🎯', title: 'Goal Tracking', desc: 'Monitor your progress' },
              { icon: '👥', title: 'Community', desc: 'Connect with members' },
              { icon: '📱', title: 'Mobile App', desc: 'Book on the go' },
              { icon: '🎁', title: 'Special Events', desc: 'Exclusive workshops' },
            ].map((perk, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glassmorphism p-6 text-center"
              >
                <div className="flex justify-center mb-3 text-primary">
                  <IconRenderer icon={perk.icon} size={40} />
                </div>
                <h3 className="font-serif font-medium text-primary mb-2">
                  {perk.title}
                </h3>
                <p className="body-text text-sm text-foreground/70">
                  {perk.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-primary mb-6">
              Start Your Transformation Today
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Choose the membership that fits your lifestyle
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow"
            >
              Choose Your Plan
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
