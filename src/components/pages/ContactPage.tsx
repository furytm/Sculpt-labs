'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import Hero from '../Hero'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <Hero
        title="Get in Touch"
        subtitle="We'd love to hear from you. Connect with our team."
        imageSrc="/images/hero-contact.jpg"
        imageAlt="Sculpt LAB contact and community"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Contact Info Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="body-text text-xl text-foreground/70 max-w-2xl mx-auto">
            Have questions? We&apos;d love to hear from you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glassmorphism p-6"
            >
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif font-medium text-primary mb-2">
                    Studio Location
                  </h3>
                  <p className="body-text text-sm text-foreground/70">
                    123 Wellness Avenue
                    <br />
                    Suite 500
                    <br />
                    Los Angeles, CA 90001
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
              className="glassmorphism p-6"
            >
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif font-medium text-primary mb-2">
                    Phone
                  </h3>
                  <a
                    href="tel:+13105551234"
                    className="body-text text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    +1 (310) 555-1234
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="glassmorphism p-6"
            >
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif font-medium text-primary mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:hello@sculptlab.com"
                    className="body-text text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    hello@sculptlab.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glassmorphism p-6"
            >
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-serif font-medium text-primary mb-2">
                    Hours
                  </h3>
                  <div className="space-y-1 body-text text-sm text-foreground/70">
                    <p>Mon - Fri: 6:00 AM - 8:00 PM</p>
                    <p>Sat: 8:00 AM - 6:00 PM</p>
                    <p>Sun: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glassmorphism p-8 md:p-12">
              <h2 className="font-serif text-2xl font-medium text-primary mb-6">
                Send us a Message
              </h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-accent/20 border border-accent rounded-lg"
                >
                  <p className="text-accent font-medium">
                    Thank you for your message! We&apos;ll get back to you shortly.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-serif font-medium text-primary mb-2 text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-serif font-medium text-primary mb-2 text-sm">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-serif font-medium text-primary mb-2 text-sm">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="(555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block font-serif font-medium text-primary mb-2 text-sm">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block font-serif font-medium text-primary mb-2 text-sm">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white resize-none"
                    placeholder="Tell us more..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-muted/30 rounded-2xl overflow-hidden h-80 soft-shadow flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <p className="body-text text-foreground/50">
              123 Wellness Avenue, Los Angeles, CA 90001
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
