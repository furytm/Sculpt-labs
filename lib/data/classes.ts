export interface ClassType {
  id: string
  name: string
  duration: number // in minutes
  level: string
  description: string
  image: string
  features: string[]
  color: string
}

export const classes: ClassType[] = [
  {
    id: 'Beginner',
    name: 'Beginner',
    duration: 50,
    level: 'Beginner',
    description:
      'A welcoming introduction to Pilates, focusing on fundamental movements, proper technique, core control, and building confidence.',
    image: '/images/stock-mat-cords.jpg',
    features: ['Core Strengthening', 'Mobility', 'Foundation'],
    color: 'from-primary/20 to-primary/5',
  },

  {
    id: 'Intermediate',
    name: 'Intermediate',
    duration: 50,
    level: 'Intermediate',
    description:
      'Build strength, control, flexibility, and endurance through more challenging Pilates movements and sequences.',
    image: '/images/stock-reformer-1.jpg',
    features: ['Full Body Workout', 'Strength', 'Endurance'],
    color: 'from-accent/20 to-accent/5',
  },

  {
    id: 'Reformer Stretch',
    name: 'Reformer Stretch',
    duration: 50,
    level: 'All Levels',
    description:
      'A focused reformer-based session combining controlled movement, stretching, mobility, and mindful breathing.',
    image: '/images/stock-reformer-stretch.jpg',
    features: ['Flexibility', 'Mobility', 'Restorative Movement'],
    color: 'from-secondary/20 to-secondary/5',
  },

  {
    id: 'Pilates + Strength',
    name: 'Pilates + Strength',
    duration: 50,
    level: 'Intermediate',
    description:
      'Combine Pilates principles with strength-focused movements to build stability, muscular endurance, and full-body strength.',
    image: '/images/stock-reformer-class.jpg',
    features: ['Strength Building', 'Core Strength', 'Full Body Workout'],
    color: 'from-primary/20 to-primary/5',
  },
]

export function getClassById(id: string): ClassType | undefined {
  return classes.find((cls) => cls.id === id)
}

export function getClassName(id: string | null): string {
  if (!id) return 'Choose a Class'

  return getClassById(id)?.name || id
}