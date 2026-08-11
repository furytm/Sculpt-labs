'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import BookingChoiceModal from './BookingChoiceModal'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/classes', label: 'Classes' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/memberships', label: 'Memberships' },
    { href: '/private-sessions', label: 'Private Sessions' },
    { href: '/book', label: 'Book Now' },
    { href: '/journal', label: 'Journal' },
  ]

  const desktopLinkClass = 'font-sans text-sm tracking-wide text-foreground/70 hover:text-primary transition-colors relative group whitespace-nowrap'
  const mobileLinkClass = 'font-sans text-sm px-3 py-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-md transition-colors'

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-x-0 top-0 z-50 border-b border-primary/10 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 shadow-lg shadow-black/5 backdrop-blur-md' : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-24 items-center justify-center md:h-20">
          <Link href="/" aria-label="Sculpt LAB home" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="relative h-28 w-28 md:h-20 md:w-20">
              <Image src="/logo.png" alt="Sculpt LAB Logo" fill className="object-contain" priority />
            </motion.div>
          </Link>

          <button
            type="button"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className="absolute right-0 p-2 text-foreground transition-colors hover:text-primary lg:hidden"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden min-h-12 items-center justify-center gap-x-10 gap-y-3 pb-2 pt-0 lg:flex xl:gap-x-14" aria-label="Main navigation">
          {navLinks.map((link) => link.label === 'Book Now' ? (
            <button key={link.href} type="button" onClick={() => setIsBookingModalOpen(true)} className={desktopLinkClass}>
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
          ) : (
            <Link key={link.href} href={link.href} className={desktopLinkClass}>
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>
      </div>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-primary/10 bg-background lg:hidden"
        >
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => link.label === 'Book Now' ? (
              <button
                key={link.href}
                type="button"
                className={`${mobileLinkClass} text-left`}
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsBookingModalOpen(true)
                }}
              >
                {link.label}
              </button>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className={mobileLinkClass}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="mt-2 rounded-lg bg-primary px-3 py-2 text-center font-sans text-sm text-primary-foreground transition-colors hover:bg-primary/90">
              Get Started
            </Link>
          </nav>
        </motion.div>
      )}

      <BookingChoiceModal open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </motion.header>
  )
}
