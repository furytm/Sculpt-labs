'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Hero from '../Hero'
import { classes } from '@/lib/data/classes'
import { memberships } from '@/lib/data/memberships'
import { getScheduleForDate, getAvailableTimes, getSessionByDateAndTime } from '@/lib/data/schedule'
import { getInstructorForTime } from '@/lib/data/instructors'
import { validateVoucher } from '@/lib/data/vouchers'
import { onProceedToPayment, BookingData } from '@/lib/api/paymentPlaceholder'
import { sendBookingConfirmationEmail } from '@/lib/api/email'

export default function BookPage() {
  const searchParams = useSearchParams()
  const classIdParam = searchParams?.get('classId') || null
  
  const [step, setStep] = useState(classIdParam ? 2 : 1)
  const [formData, setFormData] = useState({
    classId: classIdParam || '',
    membershipId: '',
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    voucherCode: '',
  })

  const [voucherValidation, setVoucherValidation] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingReference, setBookingReference] = useState('')



  const selectedMembership = memberships.find((m) => m.id === formData.membershipId)
  const selectedClass = formData.classId ? classes.find((c) => c.id === formData.classId) : null
  const selectedSession = formData.date && formData.time ? getSessionByDateAndTime(formData.date, formData.time) : null
  const selectedInstructor = selectedSession ? getInstructorForTime(formData.time) : null

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Reset voucher validation when amount changes
    if (name === 'membershipId') {
      setVoucherValidation(null)
      setFormData((prev) => ({ ...prev, voucherCode: '' }))
    }
  }

  const handleValidateVoucher = () => {
    if (!formData.voucherCode || !selectedMembership) return

    const validation = validateVoucher(formData.voucherCode, selectedMembership.priceNGN)
    setVoucherValidation(validation)
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const calculateTotals = () => {
    if (!selectedMembership) return { subtotal: 0, discount: 0, total: 0 }

    const subtotal = selectedMembership.priceNGN
    const discount = voucherValidation?.valid ? voucherValidation.discount : 0
    const total = subtotal - discount

    return { subtotal, discount, total }
  }

  const { subtotal, discount, total } = calculateTotals()

  const handleProceedToPayment = async () => {
    if (!selectedMembership || !selectedSession || !selectedInstructor) {
      alert('Please complete all required fields')
      return
    }

    setIsProcessing(true)

    try {
      const bookingData: BookingData = {
        id: '',
        personalInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        membership: {
          id: selectedMembership.id,
          name: selectedMembership.name,
          priceNGN: selectedMembership.priceNGN,
        },
        classSession: {
          classId: selectedSession.classId,
          className: selectedClass?.name || 'Unknown',
          instructorId: selectedInstructor.id,
          instructorName: selectedInstructor.name,
          date: formData.date,
          time: formData.time,
          duration: selectedClass?.duration || 50,
        },
        voucher: voucherValidation?.valid
          ? {
              code: formData.voucherCode,
              discount: voucherValidation.discount,
            }
          : undefined,
        subtotal,
        discount,
        totalAmount: total,
        timestamp: new Date().toISOString(),
      }

      // Call placeholder payment
      const paymentResponse = await onProceedToPayment(bookingData)

      if (paymentResponse.success && paymentResponse.bookingReference) {
        setBookingReference(paymentResponse.bookingReference)

        // Send confirmation email
        await sendBookingConfirmationEmail(bookingData, paymentResponse.bookingReference)

        setStep(6)
      } else {
        alert('Payment processing failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBookAnother = () => {
    setStep(classIdParam ? 2 : 1)
    setFormData({
      classId: classIdParam || '',
      membershipId: '',
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      voucherCode: '',
    })
    setVoucherValidation(null)
    setBookingReference('')
  }

  const availableTimes = formData.date ? getAvailableTimes(formData.date) : []

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <div className="w-full min-h-screen">
      {/* Hero */}
      <Hero
        title="Book Your Session"
        subtitle="Reserve your perfect pilates class in 7 simple steps"
        imageSrc="/images/hero-book.jpg"
        imageAlt="Book a pilates session"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="hero-text text-primary mb-4">Book Your Session</h1>
          <p className="body-text text-lg text-foreground/70">Follow 7 simple steps to reserve your perfect pilates session</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between mb-12 overflow-x-auto">
          {!classIdParam && (
            <div className="flex items-center flex-1 min-w-max md:min-w-0">
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-serif font-medium text-sm md:text-lg transition-all shrink-0 ${
                  1 <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {1 < step ? <Check className="w-5 h-5" /> : 1}
              </motion.div>
              <div
                className={`flex-1 h-1 mx-1 md:mx-2 transition-all hidden md:block ${1 < step ? 'bg-primary' : 'bg-muted'}`}
              />
            </div>
          )}
          {[2, 3, 4, 5, 6, 7].map((s) => (
            <div key={s} className="flex items-center flex-1 min-w-max md:min-w-0">
              <motion.div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-serif font-medium text-sm md:text-lg transition-all shrink-0 ${
                  s <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}
              >
                {s < step ? <Check className="w-5 h-5" /> : s}
              </motion.div>
              {s < 7 && (
                <div
                  className={`flex-1 h-1 mx-1 md:mx-2 transition-all hidden md:block ${s < step ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Step 1: Select Membership */}
        {!classIdParam && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : 20 }} className={step === 1 ? 'block' : 'hidden'}>
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Step 1: Select Membership / Package</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {memberships.map((membership) => (
                <motion.label
                  key={membership.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex flex-col ${
                    formData.membershipId === membership.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="membershipId"
                    value={membership.id}
                    onChange={handleInputChange}
                    className="mb-2"
                  />
                  <span className="font-medium text-primary">{membership.name}</span>
                  <span className="text-sm text-foreground/70">₦{membership.priceNGN.toLocaleString()}</span>
                  {membership.classLimit && <span className="text-xs text-foreground/50">{membership.classLimit} classes</span>}
                </motion.label>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.membershipId}
              className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
        )}

        {/* Step 2: Personal Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 2 ? 1 : 0, x: step === 2 ? 0 : 20 }}
          className={step === 2 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Step 2: Enter Personal Information</h2>

            {!classIdParam && (
            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <label className="block font-serif font-medium text-primary mb-2">Select a Class *</label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a class...</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.duration} min) - {cls.level}
                  </option>
                ))}
              </select>
              {formData.classId && (
                <p className="mt-2 text-sm text-foreground/70">
                  Selected: <span className="font-medium text-primary">{selectedClass?.name}</span> - {selectedClass?.description}
                </p>
              )}
            </div>
            )}

            <div className="space-y-4 mb-8">
              <div>
                <label className="block font-serif font-medium text-primary mb-2">Full Name *</label>
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
                  <label className="block font-serif font-medium text-primary mb-2">Email *</label>
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
                  <label className="block font-serif font-medium text-primary mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={classIdParam ? () => window.history.back() : handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.name || !formData.email || !formData.phone || (!classIdParam && !formData.classId)}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Select Date & Time */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 3 ? 1 : 0, x: step === 3 ? 0 : 20 }}
          className={step === 3 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Step 3: Select Date & Time</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block font-serif font-medium text-primary mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block font-serif font-medium text-primary mb-2">Time *</label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  disabled={!formData.date}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select a time</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.date || !formData.time}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 4: Review Booking */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 4 ? 1 : 0, x: step === 4 ? 0 : 20 }}
          className={step === 4 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Step 4: Review Booking</h2>

            <div className="space-y-6 mb-8">
              {/* Session Type */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-serif font-medium text-primary mb-3">Session Details</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-primary">Session Type:</span> {selectedMembership?.name}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Class:</span> {selectedClass?.name}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Instructor:</span> {selectedInstructor?.name || 'TBD'}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Date:</span>{' '}
                    {formData.date ? new Date(formData.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Time:</span> {formData.time}
                  </p>
                  <p>
                    <span className="font-medium text-primary">Duration:</span> {selectedClass?.duration || 50} minutes
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-serif font-medium text-primary mb-3">Price</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium text-primary">Base Price:</span> ₦{subtotal.toLocaleString()}
                  </p>
                  {discount > 0 && (
                    <p className="text-accent">
                      <span className="font-medium">Discount:</span> -₦{discount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Voucher */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h3 className="font-serif font-medium text-primary mb-3">Voucher Code (Optional)</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="voucherCode"
                    value={formData.voucherCode}
                    onChange={handleInputChange}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleValidateVoucher}
                    disabled={!formData.voucherCode}
                    className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {voucherValidation && (
                  <p className={`text-xs mt-2 ${voucherValidation.valid ? 'text-accent' : 'text-destructive'}`}>
                    {voucherValidation.message}
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary">
                <div className="flex justify-between items-center">
                  <span className="font-serif font-medium text-primary text-lg">Total Amount Due:</span>
                  <span className="font-serif text-2xl font-medium text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 5: Proceed to Payment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: step === 5 ? 1 : 0, x: step === 5 ? 0 : 20 }}
          className={step === 5 ? 'block' : 'hidden'}
        >
          <div className="glassmorphism p-8 mb-8">
            <h2 className="font-serif text-2xl font-medium text-primary mb-6">Step 5: Proceed to Payment</h2>

            <div className="bg-muted/30 p-6 rounded-lg mb-8">
              <p className="body-text text-foreground/70 mb-4">
                You&apos;re about to pay <span className="font-serif font-medium text-primary">₦{total.toLocaleString()}</span> to complete your booking.
              </p>
              <p className="body-text text-sm text-foreground/60">
                A confirmation email will be sent to <span className="font-medium">{formData.email}</span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePrevious}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? 'Processing...' : 'Proceed to Payment'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Step 6: Payment Success */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: step === 6 ? 1 : 0, scale: step === 6 ? 1 : 0.95 }}
          className={step === 6 ? 'block' : 'hidden'}
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

            <h2 className="font-serif text-3xl font-medium text-primary mb-3">Payment Successful!</h2>
            <p className="body-text text-lg text-foreground/70 mb-8">Your booking has been confirmed.</p>

            <div className="bg-muted/30 p-6 rounded-lg mb-8 text-left space-y-4">
              <div>
                <p className="text-sm text-foreground/60">Booking Reference</p>
                <p className="font-serif text-lg font-medium text-primary">{bookingReference}</p>
              </div>

              <div>
                <p className="text-sm text-foreground/60">Session Details</p>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Class:</span> {selectedClass?.name}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {formData.date ? new Date(formData.date).toLocaleDateString() : 'N/A'}
                  </p>
                  <p>
                    <span className="font-medium">Time:</span> {formData.time}
                  </p>
                  <p>
                    <span className="font-medium">Instructor:</span> {selectedInstructor?.name}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-foreground/60">Payment Status</p>
                <p className="font-serif font-medium text-accent">Confirmed</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  /* TODO: Implement download receipt */
                  alert('Receipt download coming soon!')
                }}
                className="flex-1 px-6 py-3 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-colors"
              >
                Download Receipt
              </button>
              <button
                onClick={handleBookAnother}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Book Another Session
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
