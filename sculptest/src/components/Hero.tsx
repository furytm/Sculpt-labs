'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  backgroundOverlay?: boolean
}

export default function Hero({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  backgroundOverlay = true,
}: HeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full h-80 md:h-96 lg:h-screen flex items-center justify-center overflow-hidden mt-16 md:mt-20"
    >
      {/* Background Image */}
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      {backgroundOverlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background/80" />
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-3xl"
      >
        <h1 className="hero-text text-white mb-4 text-balance">
          {title}
        </h1>
        {subtitle && (
          <p className="body-text text-white/80 md:text-lg text-balance">
            {subtitle}
          </p>
        )}
      </motion.div>


    </motion.section>
  )
}
