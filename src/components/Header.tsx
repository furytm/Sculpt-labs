'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/classes', label: 'Classes' },
    { href: '/memberships', label: 'Memberships' },
    { href: '/private-sessions', label: 'Private Sessions' },
    { href: '/book', label: 'Book Now' },
    { href: '/journal', label: 'Journal' },
  ]

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-lg shadow-black/5'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Extreme Left */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
            className="relative h-16 w-16 md:h-24 md:w-24"
            >
              <Image
                src="/logo.png"
                alt="Sculpt LAB Logo"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          
          </Link>

          {/* Desktop Navigation - Hidden on mobile and tablet */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center mx-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm tracking-wide text-foreground/70 hover:text-primary transition-colors relative group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <Link
            href="/contact"
            className="hidden lg:inline-block px-6 py-2 bg-primary text-primary-foreground font-sans text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors soft-shadow shrink-0"
          >
            Get Started
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden bg-background border-b border-primary/10"
        >
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-sm px-3 py-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-sans text-sm px-3 py-2 mt-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              Get Started
            </Link>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
