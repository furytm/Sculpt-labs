'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Hero from '../Hero'
import IconRenderer from '../IconRenderer'

export default function BookPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classType: '',
    instructor: '',
    date: '',
    time: '',
    message: '',
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleSubmit = () => {
    console.log('Booking submitted:', formData)
    setStep(4)
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero */}
      <Hero
        title="Book Your Session"
        subtitle="Reserve your spot and begin your transformation"
        imageSrc="/images/hero-book.jpg"
        imageAlt="Book a pilates session"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="hero-text text-primary mb-4">Book Your Session</h1>
          <p className="body-text text-lg text-foreground/70">
            Follow these simple steps to reserve your perfect pilates session
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-between mb-12"
        >
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-medium text-lg transition-all ${
                  s <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="w-6 h-6" /> : s}
              </motion.div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step 1: Class Selection */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : 20 }}
          className={step === 1 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">
              Step 1: Select Your Session
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                { id: 'class', label: 'Group Classes', icon: '👥' },
                { id: 'private', label: 'Private Session', icon: '1️⃣' },
                { id: 'couples', label: 'Couples Session', icon: '💑' },
                { id: 'group', label: 'Small Group', icon: '👥' },
              ].map((option) => (
                <motion.label
                  key={option.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center ${
                    formData.classType === option.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="classType"
                    value={option.id}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="text-primary mr-2">
                    <IconRenderer icon={option.icon} size={24} />
                  </div>
                  <span className="font-medium text-primary">{option.label}</span>
                </motion.label>
              ))}
            </div>

            <div className="mb-8">
              <label className="block font-serif font-medium text-primary mb-2">
                Class Type
              </label>
              <select
                name="classType"
                value={formData.classType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">Select a class</option>
                <option value="reformer">Reformer Basics</option>
                <option value="mat">Mat Pilates Flow</option>
                <option value="advanced">Advanced Intensive</option>
              </select>
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.classType}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </motion.div>

        {/* Step 2: Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 2 ? 1 : 0, x: step === 2 ? 0 : 20 }}
          className={step === 2 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">
              Step 2: Your Information
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-serif font-medium text-primary mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-serif font-medium text-primary mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block font-serif font-medium text-primary mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="(555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-serif font-medium text-primary mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any questions or special requests?"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.email}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Date & Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 3 ? 1 : 0, x: step === 3 ? 0 : 20 }}
          className={step === 3 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">
              Step 3: Choose Date & Time
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-serif font-medium text-primary mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-serif font-medium text-primary mb-2">
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select a time</option>
                  <option value="07:00">7:00 AM</option>
                  <option value="09:30">9:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                </select>
              </div>
            </div>

            <div className="mb-8">
              <label className="block font-serif font-medium text-primary mb-2">
                Preferred Instructor
              </label>
              <select
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="">Any Instructor</option>
                <option value="sarah">Sarah Mitchell</option>
                <option value="emma">Emma Rodriguez</option>
                <option value="james">James Chen</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.date || !formData.time}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Booking
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 4: Confirmation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: step === 4 ? 1 : 0, scale: step === 4 ? 1 : 0.95 }}
          className={step === 4 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-accent" />
            </motion.div>

            <h2 className="font-serif text-3xl font-medium text-primary mb-3">
              Booking Confirmed!
            </h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Your session has been successfully booked. You&apos;ll receive a confirmation email shortly.
            </p>

            <div className="bg-muted/30 p-6 rounded-lg mb-8 text-left">
              <h3 className="font-serif font-medium text-primary mb-4">Session Details:</h3>
              <div className="space-y-2 body-text text-sm">
                <p>
                  <span className="font-medium text-primary">Class:</span> {formData.classType}
                </p>
                <p>
                  <span className="font-medium text-primary">Date:</span> {formData.date}
                </p>
                <p>
                  <span className="font-medium text-primary">Time:</span> {formData.time}
                </p>
                <p>
                  <span className="font-medium text-primary">Instructor:</span>{' '}
                  {formData.instructor || 'Any Available'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book Another Session
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
