'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Users, Calendar, ArrowRight } from 'lucide-react'
import Hero from '../Hero'
import { classes } from '@/lib/data/classes'
import { upcomingSchedule, getScheduleForDate, getNextAvailableDate } from '@/lib/data/schedule'
import { getInstructorById, getInstructorForTime } from '@/lib/data/instructors'
import { getClassById } from '@/lib/data/classes'

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<string>(getNextAvailableDate())
  const [displayWeek, setDisplayWeek] = useState<number>(0)

  // Get unique dates for the week starting from selected date
  const getWeekDates = () => {
    const dates: string[] = []
    const startDate = new Date(selectedDate)
    startDate.setDate(startDate.getDate() + displayWeek * 7)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      if (upcomingSchedule.some((s) => s.date === dateStr)) {
        dates.push(dateStr)
      }
    }
    return dates
  }

  const weekDates = getWeekDates()
  const scheduleForDate = getScheduleForDate(selectedDate)

  // Group sessions by time
  const sessionsByTime = scheduleForDate.reduce(
    (acc: any, session) => {
      if (!acc[session.time]) {
        acc[session.time] = []
      }
      acc[session.time].push(session)
      return acc
    },
    {}
  )

  const sortedTimes = Object.keys(sessionsByTime).sort((a, b) => a.localeCompare(b))

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const getDayName = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <Hero
        title="Class Schedule"
        subtitle="Browse our daily classes and find the perfect time for your session"
        imageSrc="/images/schedule-hero-pilates.png"
        imageAlt="Weekly class schedule with pilates instructors"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Week Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-medium text-primary">Weekly Schedule</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setDisplayWeek(Math.max(0, displayWeek - 1))}
                disabled={displayWeek === 0}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                Previous Week
              </button>
              <button
                onClick={() => setDisplayWeek(displayWeek + 1)}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Next Week
              </button>
            </div>
          </div>

          {/* Day Selector */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date) => (
              <motion.button
                key={date}
                onClick={() => setSelectedDate(date)}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg transition-all text-center ${
                  selectedDate === date ? 'bg-primary text-primary-foreground' : 'glassmorphism hover:border-primary'
                }`}
              >
                <div className="text-xs font-medium">{getDayName(date)}</div>
                <div className="text-sm font-serif">{new Date(date).getDate()}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Schedule Grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h3 className="font-serif text-xl font-medium text-primary mb-6">
            Schedule for {formatDate(selectedDate)}
          </h3>

          {sortedTimes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/70">No classes available for this date</p>
            </div>
          ) : (
            sortedTimes.map((time) => (
              <motion.div
                key={time}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism p-6 rounded-lg"
              >
                <h4 className="font-serif text-lg font-medium text-primary mb-4">{time}</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sessionsByTime[time].map((session, idx) => {
                    const classInfo = getClassById(session.classId)
                    const instructor = getInstructorForTime(time)

                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-muted/30 p-4 rounded-lg border border-border hover:border-primary transition-all"
                      >
                        {/* Class Image Thumbnail */}
                        {classInfo && (
                          <div className="relative h-28 mb-3 rounded-lg overflow-hidden">
                            <Image
                              src={classInfo.image}
                              alt={classInfo.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Class Details */}
                        <h5 className="font-serif font-medium text-primary mb-3">{classInfo?.name || 'Unknown Class'}</h5>

                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex items-center gap-2 text-foreground/70">
                            <Users className="w-4 h-4" />
                            <span>{instructor?.name || 'TBD'}</span>
                          </div>

                          <div className="flex items-center gap-2 text-foreground/70">
                            <Clock className="w-4 h-4" />
                            <span>{classInfo?.duration || 50} minutes</span>
                          </div>

                          <div className="flex items-center gap-2 text-foreground/70">
                            <Users className="w-4 h-4" />
                            <span>{session.availableSlots} slots available</span>
                          </div>
                        </div>

                        {/* Level Badge */}
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                            {classInfo?.level}
                          </span>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href={`/book?date=${selectedDate}&time=${time}&class=${session.classId}`}
                          className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Book Now
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Quick Book Section */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glassmorphism p-12 text-center rounded-xl"
          >
            <h2 className="font-serif text-3xl font-medium text-primary mb-4">Ready to Book?</h2>
            <p className="body-text text-lg text-foreground/70 mb-8">
              Select a class above or start from the beginning to choose your perfect session
            </p>
            <Link
              href="/book"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Book Your Session <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
