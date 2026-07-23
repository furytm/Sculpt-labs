import { classes } from './classes'
import { instructorSchedule } from './instructors'

export interface ClassSession {
  id: string
  classId: string
  date: string
  time: string
  instructorId: string
  availableSlots: number
  totalSlots: number
}

// Daily class times (same for all weekdays)
const dailyTimes = ['7:00', '9:30', '12:00', '14:30', '17:00', '19:00', '19:30']

// Class rotation for each time slot
const classRotation: Record<string, string[]> = {
  '7:00': ['reformer-basics', 'mat-pilates', 'hormone-harmony'],
  '9:30': ['power-reformer', 'advanced-intensive', 'jumpboard-pilates'],
  '12:00': ['mat-pilates', 'therapeutic-pilates', 'reformer-basics'],
  '14:30': ['hormone-harmony', 'power-reformer', 'mat-pilates'],
  '17:00': ['advanced-intensive', 'jumpboard-pilates', 'therapeutic-pilates'],
  '19:00': ['reformer-basics', 'hormone-harmony', 'power-reformer'],
  '19:30': ['mat-pilates', 'therapeutic-pilates', 'jumpboard-pilates'],
}

export function generateSchedule(startDate: string, days: number = 30): ClassSession[] {
  const schedule: ClassSession[] = []
  const date = new Date(startDate)
  let sessionId = 1

  for (let d = 0; d < days; d++) {
    // Skip Sundays if needed (optional)
    const dayOfWeek = (date.getDay() + d) % 7
    if (dayOfWeek === 0) continue // Skip Sundays

    const currentDate = new Date(date)
    currentDate.setDate(currentDate.getDate() + d)
    const dateStr = currentDate.toISOString().split('T')[0]

    for (const time of dailyTimes) {
      // Get class for this time slot (rotate through available classes)
      const classesForTime = classRotation[time] || ['reformer-basics']
      const classIdx = schedule.filter((s) => s.time === time).length % classesForTime.length
      const classId = classesForTime[classIdx]

      // Get instructor for this time
      const instructorId = instructorSchedule[time] || 'sarah'

      schedule.push({
        id: `session-${sessionId++}`,
        classId,
        date: dateStr,
        time,
        instructorId,
        availableSlots: 15,
        totalSlots: 15,
      })
    }
  }

  return schedule
}

// Generate initial schedule starting from today
export const upcomingSchedule = generateSchedule(new Date().toISOString().split('T')[0])

export function getScheduleForDate(date: string): ClassSession[] {
  return upcomingSchedule.filter((session) => session.date === date)
}

export function getAvailableTimes(date: string): string[] {
  const sessions = getScheduleForDate(date)
  return [...new Set(sessions.map((s) => s.time))]
}

export function getSessionByDateAndTime(date: string, time: string): ClassSession | undefined {
  return upcomingSchedule.find((s) => s.date === date && s.time === time)
}

export function getNextAvailableDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}
