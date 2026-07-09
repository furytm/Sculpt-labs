'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Hero from '../Hero'

export default function PrivateSessionsPage() {
  const sessionTypes = [
    {
      title: 'One-on-One Reformer',
      duration: '50 min',
      description: 'Completely personalized session on the reformer tailored to your goals',
      benefits: ['Custom Program', 'Full Attention', 'Flexible Timing', 'Video Analysis'],
      image: '/images/stock-reformer-1.jpg',
    },
    {
      title: 'One-on-One Mat',
      duration: '60 min',
      description: 'Intimate mat pilates session with focused instruction',
      benefits: ['Body-Specific Work', 'Injury Modification', 'Progression Tracking', 'Home Exercises'],
      image: '/images/stock-mat-assist.jpg',
    },
    {
      title: 'Couples Session',
      duration: '60 min',
      description: 'Partner up for a fun and motivating pilates experience',
      benefits: ['Shared Goals', 'Motivation Boost', 'Quality Time', 'Partner Support'],
      image: '/images/stock-reformer-assist.jpg',
    },
    {
      title: 'Small Group Training',
      duration: '45 min',
      description: 'Specialized training in groups of 2-4 people',
      benefits: ['Personalized Attention', 'Group Energy', 'Customized Programs', 'Social Connection'],
      image: '/images/stock-mat-group.jpg',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero */}
      <Hero
        title="Private Sessions"
        subtitle="Experience pilates at its most personalized with expert instruction tailored to your unique goals"
        imageSrc="/images/stock-reformer-assist.jpg"
        imageAlt="Private pilates session"
      />

      {/* Why Private Sessions */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 md:h-[450px] rounded-2xl overflow-hidden soft-shadow">
                <Image
                  src="/images/stock-reformer-2.jpg"
                  alt="Private Session"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title text-primary mb-6">Why Choose Private Sessions?</h2>
              <div className="space-y-4">
                {[
                  'Complete personalization based on your body and goals',
                  'Faster progress with expert form correction',
                  'Perfect for rehabilitation and injury recovery',
                  'Flexible scheduling to fit your lifestyle',
                  'One-on-one attention and motivation',
                  'Customized progression and challenge levels',
                ].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-3 items-start"
                  >
                    <Check className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <span className="body-text text-foreground/80">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Session Types */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-primary mb-4">Session Types</h2>
            <p className="body-text text-lg text-foreground/70">
              Choose the format that works best for you
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {sessionTypes.map((session, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glassmorphism overflow-hidden group hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={session.image}
                    alt={session.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-medium text-primary mb-2">
                    {session.title}
                  </h3>
                  <p className="text-sm text-foreground/60 mb-4">{session.duration}</p>
                  <p className="body-text text-foreground/80 mb-6">
                    {session.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    {session.benefits.map((benefit) => (
                      <div key={benefit} className="flex gap-2 items-start text-sm">
                        <span className="text-accent mt-1">✓</span>
                        <span className="text-foreground/70">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/book"
                    className="block text-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Schedule Session
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title text-primary mb-4">Investment in Your Wellness</h2>
            <p className="body-text text-lg text-foreground/70">
              Flexible packages available
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { sessions: 1, price: '$150', savings: '— ' },
              { sessions: 5, price: '$650', savings: 'Save $100' },
              { sessions: 10, price: '$1,200', savings: 'Save $300' },
            ].map((pkg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-lg p-8 ${
                  idx === 1 ? 'glassmorphism border-2 border-primary/30 scale-105' : 'glassmorphism'
                }`}
              >
                <h3 className="font-serif text-xl font-medium text-primary mb-2">
                  {pkg.sessions} Session{pkg.sessions > 1 ? 's' : ''}
                </h3>
                <p className="text-sm text-accent mb-4 font-medium">{pkg.savings}</p>
                <p className="text-3xl font-serif font-medium text-primary mb-6">
                  {pkg.price}
                </p>
                <Link
                  href="/book"
                  className="block text-center px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Book Now
                </Link>
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
              Ready to Transform?
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Consult with our instructors about creating your perfect program
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow"
            >
              Schedule Your Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
