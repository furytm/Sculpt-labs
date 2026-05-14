'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, Zap } from 'lucide-react'
import VideoHero from '../VideoHero'

export default function ClassesPage() {
  const classes = [
    {
      title: 'Reformer Basics',
      duration: '50 min',
      level: 'Beginner',
      description: 'Perfect introduction to pilates on the reformer. Learn fundamental movements and build your foundation.',
      image: '/images/class-reformer.jpg',
      features: ['Core Strengthening', 'Flexibility', 'Machine Basics'],
      color: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Mat Pilates Flow',
      duration: '60 min',
      level: 'Intermediate',
      description: 'Dynamic mat-based workout combining flowing movements with controlled breathing for full-body engagement.',
      image: '/images/class-mat.jpg',
      features: ['Full Body Workout', 'Flexibility', 'Endurance'],
      color: 'from-accent/20 to-accent/5',
    },
    {
      title: 'Advanced Intensive',
      duration: '55 min',
      level: 'Advanced',
      description: 'Challenge yourself with our expert-level sessions designed for experienced practitioners.',
      image: '/images/class-advanced.jpg',
      features: ['Power Training', 'Complex Sequences', 'Peak Performance'],
      color: 'from-secondary/20 to-secondary/5',
    },
    {
      title: 'Power Reformer',
      duration: '50 min',
      level: 'Intermediate-Advanced',
      description: 'High-intensity reformer class focusing on strength building and muscle toning.',
      image: '/images/class-power.jpg',
      features: ['Strength Building', 'Muscle Toning', 'Cardio Element'],
      color: 'from-primary/20 to-primary/5',
    },
    {
      title: 'Prenatal Pilates',
      duration: '45 min',
      level: 'All Levels',
      description: 'Specially designed for expecting mothers to maintain strength and prepare for birth.',
      image: '/images/class-prenatal.jpg',
      features: ['Safe Pregnancy', 'Core Support', 'Pain Relief'],
      color: 'from-accent/20 to-accent/5',
    },
    {
      title: 'Therapeutic Pilates',
      duration: '50 min',
      level: 'All Levels',
      description: 'Gentle restorative pilates designed for injury recovery and rehabilitation.',
      image: '/images/class-therapeutic.jpg',
      features: ['Injury Recovery', 'Mobility', 'Flexibility'],
      color: 'from-secondary/20 to-secondary/5',
    },
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <VideoHero
        title="Our Classes"
        subtitle="Transform your body and mind with our carefully designed pilates classes"
        videoSrc="/videos/classes-reformer.mp4"
      />

      {/* Classes Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {classes.map((classItem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group glassmorphism overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={classItem.image}
                    alt={classItem.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${classItem.color}`} />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-serif text-xl font-medium text-primary">
                      {classItem.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="flex items-center gap-1 text-sm text-foreground/70">
                      <Clock className="w-4 h-4" />
                      {classItem.duration}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-foreground/70">
                      <Zap className="w-4 h-4" />
                      {classItem.level}
                    </div>
                  </div>

                  <p className="body-text text-sm text-foreground/70 mb-4">
                    {classItem.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {classItem.features.map((feature) => (
                      <span
                        key={feature}
                        className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/book"
                    className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Book Class
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title text-primary mb-4">Weekly Schedule</h2>
            <p className="body-text text-lg text-foreground/70">
              Multiple sessions daily to fit your lifestyle
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-7 gap-4"
          >
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} className="glassmorphism p-4">
                <h3 className="font-serif font-medium text-primary mb-3 text-center">
                  {day}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-primary/10 p-2 rounded text-primary font-medium">
                    7:00 AM
                  </div>
                  <div className="bg-accent/10 p-2 rounded text-accent font-medium">
                    9:30 AM
                  </div>
                  <div className="bg-secondary/10 p-2 rounded text-secondary font-medium">
                    5:00 PM
                  </div>
                  {day !== 'Sun' && (
                    <div className="bg-primary/10 p-2 rounded text-primary font-medium">
                      7:00 PM
                    </div>
                  )}
                </div>
              </div>
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
              Ready to Begin?
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Book your first class and experience the Sculpt LAB difference
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow"
            >
              Book Your Class Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
