export interface Instructor {
  id: string
  name: string
  specialties: string[]
  bio: string
  image: string
}

export const instructors: Instructor[] = [
  {
    id: 'sarah',
    name: 'Sarah Mitchell',
    specialties: ['Reformer Basics', 'Mat Pilates Flow', 'Therapeutic Pilates'],
    bio: 'Certified Pilates instructor with 8+ years of experience specializing in foundational techniques.',
    image: '/images/instructor-1.jpg',
  },
  {
    id: 'emma',
    name: 'Emma Rodriguez',
    specialties: ['Power Reformer', 'Jumpboard Pilates', 'Advanced Intensive'],
    bio: 'Expert in high-intensity pilates and conditioning. Former professional athlete.',
    image: '/images/instructor-2.jpg',
  },
  {
    id: 'james',
    name: 'James Chen',
    specialties: ['Hormone Harmony', 'Therapeutic Pilates', 'Mat Pilates Flow'],
    bio: 'Specialist in therapeutic pilates and holistic wellness. Certified in somatic education.',
    image: '/images/instructor-3.jpg',
  },
  {
    id: 'lisa',
    name: 'Lisa Thompson',
    specialties: ['Advanced Intensive', 'Power Reformer', 'Reformer Basics'],
    bio: 'Professional pilates instructor with a passion for pushing boundaries and building strength.',
    image: '/images/instructor-4.jpg',
  },
]

// Assign instructors to specific time slots
export const instructorSchedule: Record<string, string> = {
  '7:00': 'sarah',
  '9:30': 'emma',
  '12:00': 'james',
  '14:30': 'lisa',
  '17:00': 'sarah',
  '19:00': 'emma',
  '19:30': 'james',
}

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((inst) => inst.id === id)
}

export function getInstructorForTime(time: string): Instructor | undefined {
  const instructorId = instructorSchedule[time]
  return instructorId ? getInstructorById(instructorId) : undefined
}

export function getInstructorName(id: string): string {
  return getInstructorById(id)?.name || 'TBD'
}
