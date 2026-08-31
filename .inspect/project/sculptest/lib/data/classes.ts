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
    id: 'reformer-basics',
    name: 'Reformer Basics',
    duration: 50,
    level: 'Beginner',
    description: 'Perfect introduction to pilates on the reformer. Learn fundamental movements and build your foundation.',
    image: '/images/stock-reformer-1.jpg',
    features: ['Core Strengthening', 'Flexibility', 'Machine Basics'],
    color: 'from-primary/20 to-primary/5',
  },
  {
    id: 'mat-pilates',
    name: 'Mat Pilates Flow',
    duration: 50,
    level: 'Intermediate',
    description: 'Dynamic mat-based workout combining flowing movements with controlled breathing for full-body engagement.',
    image: '/images/stock-mat-cords.jpg',
    features: ['Full Body Workout', 'Flexibility', 'Endurance'],
    color: 'from-accent/20 to-accent/5',
  },
  {
    id: 'advanced-intensive',
    name: 'Advanced Intensive',
    duration: 50,
    level: 'Advanced',
    description: 'Challenge yourself with our expert-level sessions designed for experienced practitioners.',
    image: '/images/stock-reformer-modern.jpg',
    features: ['Power Training', 'Complex Sequences', 'Peak Performance'],
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    id: 'power-reformer',
    name: 'Power Reformer',
    duration: 50,
    level: 'Intermediate-Advanced',
    description: 'High-intensity reformer class focusing on strength building and muscle toning.',
    image: '/images/stock-reformer-class.jpg',
    features: ['Strength Building', 'Muscle Toning', 'Cardio Element'],
    color: 'from-primary/20 to-primary/5',
  },
  {
    id: 'hormone-harmony',
    name: 'Hormone Harmony',
    duration: 50,
    level: 'All Levels',
    description: 'A specialized movement class designed to support healthy hormone function through intentional exercise. By combining Pilates, strength training, mobility, and restorative movement, Hormone Harmony helps improve insulin sensitivity, reduce the effects of chronic stress, build lean muscle, support metabolic health, and enhance overall vitality.',
    image: '/images/stock-reformer-3.jpg',
    features: ['Hormone Support', 'Metabolic Health', 'Stress Reduction'],
    color: 'from-accent/20 to-accent/5',
  },
  {
    id: 'jumpboard-pilates',
    name: 'Jumpboard Pilates',
    duration: 50,
    level: 'Intermediate-Advanced',
    description: 'Dynamic cardio-pilates fusion using the jumpboard for explosive power, agility, and cardiovascular conditioning.',
    image: '/images/stock-reformer-1.jpg',
    features: ['Cardio Conditioning', 'Power & Agility', 'Strength'],
    color: 'from-secondary/20 to-secondary/5',
  },
  {
    id: 'therapeutic-pilates',
    name: 'Therapeutic Pilates',
    duration: 50,
    level: 'All Levels',
    description: 'Gentle restorative pilates designed for injury recovery and rehabilitation.',
    image: '/images/stock-reformer-stretch.jpg',
    features: ['Injury Recovery', 'Mobility', 'Flexibility'],
    color: 'from-secondary/20 to-secondary/5',
  },
]

export function getClassById(id: string): ClassType | undefined {
  return classes.find((cls) => cls.id === id)
}

export function getClassName(id: string): string {
  return getClassById(id)?.name || 'Unknown Class'
}
