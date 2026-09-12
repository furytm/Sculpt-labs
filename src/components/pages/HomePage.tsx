'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import VideoHero from '../VideoHero'
import IconRenderer from '../IconRenderer'
import { classes } from '../../../lib/data/classes'

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
     {/* Video Hero - Mobile & Tablet */}
<div className="lg:hidden h-screen">
  
  <VideoHero
    title="   Move with intention, Live with balance"
    subtitle=""
    videoSrc="/videos/pilates-studio.mp4"
  >
    <div className="flex flex-col gap-3 w-full px-6">
      <Link href="/classes" className="px-5 py-2.5 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-full hover:bg-primary/90 transition-colors soft-shadow text-center">Book Your Session</Link>

      <Link
        href="/schedule"
        className="px-5 py-2.5 border border-white text-white font-sans text-sm font-medium rounded-full hover:bg-white/10 transition-colors text-center"
      >
    Our Schedule
      </Link>
    </div>
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
              <motion.h1
                variants={itemVariants}
                className="hero-text mb-6 text-white"
              >
                Move with intention, live with balance
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="body-text text-lg text-white/80 mb-8"
              >
                Experience luxury pilates at Sculpt LAB. Our expert instructors
                guide you through transformative sessions that strengthen,
                lengthen, and empower your entire body.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/classes"
                  className="px-8 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow text-center"
                >
                  Book Your Session
                </Link>

                <Link
                  href="/schedule"
                  className="px-8 py-3 border-2 border-primary text-white font-sans font-medium rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  Our Schedule
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio Location Marquee */}
      <header className="overflow-hidden border-y border-border bg-foreground py-3 text-background">
        <div className="relative flex overflow-hidden whitespace-nowrap">
          <motion.div
            className="flex shrink-0 items-center"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="flex items-center">
              <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
                2ND FLOOR, ORIENTAL HOTEL, NEW WING
              </span>

              <span className="text-primary-foreground/50">✦</span>

              <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
                3 LEKKI-EPE EXPY, VICTORIA ISLAND
              </span>

              <span className="text-primary-foreground/50">✦</span>

              <span className="mx-4 text-[9px] font-medium uppercase tracking-[0.2em] text-primary-foreground sm:text-[10px] sm:tracking-[0.24em] lg:mx-6 lg:text-xs lg:tracking-[0.28em]">
                LAGOS
              </span>

              <span className="text-primary-foreground/50">✦</span>
            </div>
          </motion.div>
        </div>
      </header>

  



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
            {classes.slice(0, 3).map((classItem) => (
              <motion.div
                key={classItem.id}
                variants={itemVariants}
                className="group glassmorphism p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={classItem.image}
                    alt={classItem.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-serif text-xl font-medium mb-2 text-primary">
                  {classItem.name}
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

      {/* Limited Membership Promotion */}
      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative min-h-80 overflow-hidden rounded-2xl soft-shadow">
            <Image src="/images/membership-promotion.png" alt="Pilates reformer membership session" fill className="object-cover" />
          </div>
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.24em] text-accent">Limited-time offer</p>
            <h2 className="section-title text-primary mb-4">10 Classes / Month</h2>
            <p className="body-text mb-6 text-lg text-foreground/70">Build a consistent Pilates practice with ten studio classes each month at a limited membership price.</p>
            <div className="mb-7 flex items-baseline gap-3">
              <span className="font-serif text-4xl font-medium text-primary">₦150,000</span>
              <span className="text-lg text-muted-foreground line-through">₦165,000</span>
            </div>
            <Link href="/memberships#monthly-10" className="inline-flex items-center rounded-lg bg-primary px-7 py-3 font-sans font-medium text-primary-foreground transition-colors hover:bg-primary/90 soft-shadow">View membership offer<ChevronRight className="ml-2 h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Private Sessions Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden soft-shadow">
              <Image src="/images/stock-reformer-2.jpg" alt="Personalized private Pilates session" fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-accent mb-3">Private Sessions</p>
              <h2 className="section-title text-primary mb-5">Pilates, personalized to you</h2>
              <p className="body-text text-lg text-foreground/70 mb-6">Experience Pilates at its most personalized with expert instruction tailored to your unique goals, body, and pace.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {['Complete personalization', 'Expert form correction', 'Flexible scheduling', 'Customized progression'].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-sm text-foreground/75"><span className="text-accent">✓</span>{benefit}</div>
                ))}
              </div>
              <Link href="/private-sessions" className="inline-flex items-center px-7 py-3 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow">Explore Private Sessions<ChevronRight className="w-4 h-4 ml-2" /></Link>
            </div>
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
<Link href="/classes" className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-sans font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow text-lg">
  <Sparkles className="w-5 h-5 mr-2" />
  Book Your First Session
</Link>
          </motion.div>
        </div>
      </section>

      <Link
        href="/memberships"
        aria-label="Book the limited-time 10 classes per month offer"
        className="fixed bottom-5 right-5 z-40 flex h-32 w-32 flex-col items-center justify-center rounded-full border-2 border-accent/60 bg-background/95 text-center text-primary shadow-xl shadow-accent/20 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-accent sm:bottom-8 sm:right-8 sm:h-40 sm:w-40"
      >
        <span className="text-2xl font-serif font-medium sm:text-3xl">₦150K</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em]">10 Classes / Month</span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.12em] text-accent">Limited-time offer</span>
        <span className="mt-1 inline-flex items-center text-xs font-medium">Book Now <ChevronRight className="ml-1 h-3 w-3" /></span>
      </Link>
    </div>
  )
  }
