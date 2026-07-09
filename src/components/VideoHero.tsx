'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface VideoHeroProps {
  title: string
  subtitle?: string
  description?: string
  videoSrc: string
  children?: ReactNode
}

export default function VideoHero({
  title,
  subtitle,
  description,
  videoSrc,
  children,
}: VideoHeroProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative w-full min-h-96 md:min-h-[500px] flex items-center justify-center overflow-hidden mt-16 md:mt-20 py-16 md:py-24"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />

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
          <p className="body-text text-white/80 md:text-lg mb-6 text-balance">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="body-text text-white/70 md:text-base mb-8 max-w-2xl mx-auto text-balance">
            {description}
          </p>
        )}
        {children && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {children}
          </div>
        )}
      </motion.div>
    </motion.section>
  )
}
