'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import VideoHero from '../VideoHero'
import IconRenderer from '../IconRenderer'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Video Hero - Visible on mobile and md */}
      <div className="lg:hidden">
        <VideoHero
          title="Transform Your Body, Elevate Your Mind"
          subtitle="Experience luxury pilates at Sculpt LAB. Our expert instructors guide you through transformative sessions that strengthen, lengthen, and empower your entire body."
          videoSrc="/videos/pilates-studio.mp4"
        >
          <Link
            href="/book"
            className="px-6 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow text-center"
          >
            Book Your Session
          </Link>
          <Link
            href="/classes"
            className="px-6 py-3 border-2 border-white text-white font-sans font-medium rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            Explore Classes
          </Link>
        </VideoHero>
      </div>

      {/* Desktop Hero Section with Content Overlay */}
      <section className="hidden lg:block relative w-full overflow-hidden mt-16 md:mt-20">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-screen object-cover"
        >
          <source src="/videos/pilates-studio.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative h-screen flex items-center justify-start">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-2xl"
            >
              <motion.h1 variants={itemVariants} className="hero-text mb-6 text-white">
                Transform Your Body, Elevate Your Mind
              </motion.h1>
              <motion.p variants={itemVariants} className="body-text text-lg text-white/80 mb-8">
                Experience luxury pilates at Sculpt LAB. Our expert instructors guide you through transformative sessions that strengthen, lengthen, and empower your entire body.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/book"
                  className="px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow text-center"
                >
                  Book Your Session
                </Link>
                <Link
                  href="/classes"
                  className="px-8 py-3 border-2 border-primary text-white font-sans font-medium rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  Explore Classes
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classes Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title text-primary mb-4">Our Classes</h2>
            <p className="body-text text-lg text-foreground/70 max-w-2xl mx-auto">
              From beginner-friendly to advanced intense sessions
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Reformer Basics',
                description: 'Perfect introduction to pilates on the reformer',
                image: '/images/stock-reformer-1.jpg',
                icon: '🏋️',
              },
              {
                title: 'Mat Pilates Flow',
                description: 'Dynamic mat-based workout for core strength',
                image: '/images/stock-mat-cords.jpg',
                icon: '🧘',
              },
              {
                title: 'Advanced Intensive',
                description: 'Challenge yourself with our expert-level sessions',
                image: '/images/stock-reformer-modern.jpg',
                icon: '✨',
              },
            ].map((classItem, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group glassmorphism p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={classItem.image}
                    alt={classItem.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2 text-primary">
                  {classItem.title}
                </h3>
                <p className="body-text text-sm text-foreground/70 mb-4">
                  {classItem.description}
                </p>
                <Link
                  href="/classes"
                  className="inline-flex items-center text-primary hover:text-primary/70 transition-colors text-sm font-medium group/link"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/classes"
              className="inline-flex items-center px-8 py-3 border-2 border-primary text-primary font-sans font-medium rounded-lg hover:bg-primary/5 transition-colors"
            >
              View All Classes
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative h-96 md:h-[450px] rounded-2xl overflow-hidden soft-shadow">
                <Image
                  src="/images/studio-interior.jpg"
                  alt="Sculpt LAB Studio"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 variants={itemVariants} className="section-title text-primary mb-6">
                Why Choose Sculpt LAB
              </motion.h2>

              <motion.div variants={itemVariants} className="space-y-6">
                {[
                  {
                    icon: '👥',
                    title: 'Expert Instructors',
                    description: 'Certified professionals with years of experience',
                  },
                  {
                    icon: '✨',
                    title: 'Personalized Attention',
                    description: 'Small classes and private sessions tailored to you',
                  },
                  {
                    icon: '🏆',
                    title: 'Premium Equipment',
                    description: 'State-of-the-art reformers and facilities',
                  },
                  {
                    icon: '🧘',
                    title: 'Holistic Approach',
                    description: 'Mind, body, and spirit transformation',
                  },
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="shrink-0 text-primary">
                      <IconRenderer icon={feature.icon} size={32} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-primary mb-1">
                        {feature.title}
                      </h3>
                      <p className="body-text text-sm text-foreground/70">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title text-primary mb-6">
              Ready to Transform?
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join our community of pilates enthusiasts and experience the difference that expert instruction and luxury facilities can make.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Book Your First Session
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
