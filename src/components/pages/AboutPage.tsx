'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Hero from '../Hero'
import IconRenderer from '../IconRenderer'

export default function AboutPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero
        title="About Sculpt LAB"
        subtitle="A sanctuary for transformation where classical pilates meets modern luxury"
        imageSrc="/images/hero-about.jpg"
        imageAlt="Sculpt LAB founder and studio"
      />

      {/* Story Section */}
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
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden soft-shadow">
                <Image
                  src="/images/studio-founder.jpg"
                  alt="Founder"
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
              <h2 className="section-title text-primary mb-6">Our Story</h2>
              <div className="space-y-4 body-text text-foreground/80">
                <p>
                  Founded on the belief that pilates is more than an exercise—it&apos;s a journey to self-discovery, Sculpt LAB was created as a sanctuary where transformation happens.
                </p>
                <p>
                  Our studio embodies the principles of classical pilates while embracing modern luxury. We&apos;ve carefully curated every detail of our space, from the equipment to the atmosphere, to ensure that every visit is an experience of pure elegance and empowerment.
                </p>
                <p>
                  With a team of certified instructors who are passionate about your success, we&apos;re committed to helping you discover your strongest, most confident self.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-primary mb-4">Our Philosophy</h2>
            <p className="body-text text-lg text-foreground/70 max-w-2xl mx-auto">
              We believe in the transformative power of pilates
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Mindful Movement',
                description: 'Every movement is intentional, connecting body and mind for holistic transformation.',
                icon: '🧠',
              },
              {
                title: 'Personalized Excellence',
                description: 'Your journey is unique. We customize every session to your goals and abilities.',
                icon: '💎',
              },
              {
                title: 'Community & Support',
                description: 'Join a welcoming community of like-minded individuals on their wellness journey.',
                icon: '🤝',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glassmorphism p-8 text-center"
              >
                <div className="flex justify-center mb-4 text-primary">
                  <IconRenderer icon={item.icon} size={48} />
                </div>
                <h3 className="font-serif text-xl font-medium text-primary mb-3">
                  {item.title}
                </h3>
                <p className="body-text text-sm text-foreground/70">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-primary mb-4">Meet Our Instructors</h2>
            <p className="body-text text-lg text-foreground/70 max-w-2xl mx-auto">
              Certified professionals dedicated to your transformation
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[1, 2, 3].map((idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="relative h-80 mb-4 rounded-xl overflow-hidden soft-shadow">
                  <Image
                    src={`/images/instructor-${idx}.jpg`}
                    alt={`Instructor ${idx}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-xl font-medium text-primary">
                  Instructor {idx}
                </h3>
                <p className="body-text text-sm text-foreground/70 mt-1">
                  Certified Pilates Instructor
                </p>
                <p className="body-text text-sm text-foreground/60 mt-2">
                  Specializing in reformer and mat pilates with a passion for holistic wellness.
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-primary mb-6">
              Join Our Studio
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Experience the Sculpt LAB difference with a complimentary consultation
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow"
            >
              Schedule Your Consultation
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
