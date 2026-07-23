export interface Membership {
  id: string
  name: string
  priceNGN: number // Price in Nigerian Naira
  period: string
  description: string
  classLimit: number | null // null = unlimited
  features: string[]
  highlighted?: boolean
}

export const memberships: Membership[] = [
  {
    id: 'single-class',
    name: 'Single Class Pass',
    priceNGN: 25000,
    period: 'per class',
    description: 'Perfect for trying a single class',
    classLimit: 1,
    features: [
      '1 class pass',
      'Access to all class types',
      'Valid for 30 days',
      'Email support',
    ],
    highlighted: false,
  },
  {
    id: 'three-month',
    name: '3-Month Membership',
    priceNGN: 320000,
    period: '3 months',
    description: 'Best value for committed practitioners',
    classLimit: 20,
    features: [
      '20 classes over 3 months',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      'Monthly wellness workshop',
      'Priority support',
    ],
    highlighted: true,
  },
  {
    id: 'starter',
    name: 'Starter',
    priceNGN: 35000,
    period: '/month',
    description: 'Perfect for exploring pilates',
    classLimit: 4,
    features: [
      '4 classes per month',
      'Access to all class types',
      'Member community',
      'Email support',
    ],
    highlighted: false,
  },
  {
    id: 'practitioner',
    name: 'Practitioner',
    priceNGN: 60000,
    period: '/month',
    description: 'For committed practitioners',
    classLimit: 8,
    features: [
      '8 classes per month',
      'Unlimited class swaps',
      'Priority booking',
      '10% off private sessions',
      'Monthly wellness workshop',
      'Priority support',
    ],
    highlighted: false,
  },
  {
    id: 'unlimited',
    name: 'Unlimited',
    priceNGN: 85000,
    period: '/month',
    description: 'Total transformation',
    classLimit: null,
    features: [
      'Unlimited classes',
      'Free private sessions (1/month)',
      'Priority booking',
      '20% off additional private sessions',
      'Monthly wellness workshop',
      'Exclusive member events',
      '24/7 studio access',
      'Dedicated support',
    ],
    highlighted: false,
  },
]

export function getMembershipById(id: string): Membership | undefined {
  return memberships.find((m) => m.id === id)
}

export function getMembershipName(id: string): string {
  return getMembershipById(id)?.name || 'Unknown Membership'
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price)
}
