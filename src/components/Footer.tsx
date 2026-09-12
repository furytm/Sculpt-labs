'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  if (pathname === '/waitlist') return null

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
      { label: 'Studio Guidelines', href: '/studio-guidelines' },
      { label: 'FAQ', href: '/faq' },
    ],
  }

  return (
    <footer className="bg-primary pt-16 pb-8 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-4">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <Link
              href="/"
              className="mb-4 flex items-center gap-3"
            >
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.jpg"
                  alt="Sculpt LAB Logo"
                  fill
                  className="object-contain"
                />
              </div>

              <span className="font-serif text-lg font-medium">
                Sculpt LAB
              </span>
            </Link>

            <p className="text-sm leading-relaxed opacity-80">
              Transform your body and mind through the power of pilates.
              Experience luxury wellness.
            </p>

            {/* Email */}
            <a
              href="mailto:enquiries@sculptlab.com.ng"
              className="mt-5 flex items-center gap-2 text-sm opacity-80 transition-opacity hover:opacity-100"
            >
              <Mail className="h-4 w-4 shrink-0" />
              enquiries@sculptlab.com.ng
            </a>

            {/* Studio Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary-foreground" />

                <div>
                  <h3 className="mb-1 font-serif text-sm font-medium">
                    Studio Location
                  </h3>

                  <p className="text-sm leading-relaxed opacity-70">
                    2ND FLOOR, Oriental Hotel, New Wing
                    <br />
                    3 Lekki-Epe EXPY, Victoria Island
                    <br />
                    LAGOS
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-5"
            >
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0 text-primary-foreground" />

                <div>
                  <h3 className="mb-1 font-serif text-sm font-medium">
                    Phone
                  </h3>

                  <a
                    href="tel:+2348062085711"
                    className="text-sm opacity-70 transition-opacity hover:opacity-100"
                  >
                    +234 806 208 5711
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="mb-4 font-serif text-sm font-semibold uppercase tracking-wider">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h3>

              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm opacity-80 transition-opacity hover:opacity-100"
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
        <div className="my-8 border-t border-primary-foreground/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm opacity-70">
            © {currentYear} Sculpt LAB Pilates. All rights reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="text-sm opacity-70 transition-opacity hover:opacity-100"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-of-service"
              className="text-sm opacity-70 transition-opacity hover:opacity-100"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}