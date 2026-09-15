'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'

export default function SculptAuthLoading() {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-background"
      aria-busy="true"
      aria-live="polite"
    >
      <motion.div
        initial={{ opacity: 0.72, scale: 0.96 }}
        animate={reducedMotion ? { opacity: 1, scale: 1 } : { opacity: [0.72, 1, 0.78], scale: [0.96, 1, 0.98] }}
        transition={reducedMotion ? { duration: 0.2 } : { duration: 3.6, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        className="relative h-28 w-28 sm:h-36 sm:w-36"
      >
        <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9tHjTZSjGFDhpRGlj69dYjMlefBuY4.png" alt="Sculpt LAB" fill priority unoptimized className="object-contain" />
      </motion.div>
    </motion.div>
  )
}
