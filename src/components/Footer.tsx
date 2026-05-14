'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    studio: [
      { label: 'About Us', href: '/about' },
      { label: 'Classes', href: '/classes' },
      { label: 'Memberships', href: '/memberships' },
    ],
    services: [
      { label: 'Private Sessions', href: '/private-sessions' },
      { label: 'Book Now', href: '/book' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Journal', href: '/journal' },
      { label: 'FAQ', href: '/contact' },
    ],
  }

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="Sculpt LAB Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-lg font-medium">Sculpt LAB</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Transform your body and mind through the power of pilates. Experience luxury wellness.
            </p>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-serif text-sm font-semibold mb-4 uppercase tracking-wider">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/10 my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-70">
            © {currentYear} Sculpt LAB Pilates. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
