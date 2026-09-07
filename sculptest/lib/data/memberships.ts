export interface Membership {
  id: string
  name: string
  priceNGN: number // Price in Nigerian Naira
  period: string
  description: string
  classLimit: number | null // null = unlimited
  features: string[]
  highlighted?: boolean
  badge?: string
}

export const memberships: Membership[] = [
  {
    id: 'intro-week',
    name: '1 Week Unlimited - Intro Offer',
    priceNGN: 69999,
    period: '7 days',
    description: 'Perfect for first-time clients to experience our studio',
    classLimit: null,
    features: [
      'Unlimited classes for 7 days',
      'Access to all class types',
      'First-time clients only',
      'Start on any date',
    ],
    highlighted: false,
    badge: 'New Members',
  },
  {
    id: 'founding-member',
    name: 'Founding Member - Unlimited',
    priceNGN: 350000,
    period: '/month',
    description: 'Locked-in rate for founding members',
    classLimit: null,
    features: [
      'Unlimited classes',
      'Rate locked for life',
      'Limited to first 20 members',
      'Auto-renewal',
      'Priority booking',
      'Exclusive founding member events',
    ],
    highlighted: true,
    badge: 'First 20 members',
  },
  {
    id: 'single-class',
    name: 'Single Class Pass',
    priceNGN: 24999,
    period: 'per class',
    description: 'Try a class whenever you want',
    classLimit: 1,
    features: [
      '1 class pass',
      'Access to all class types',
      'Valid for 30 days',
      'No commitment',
    ],
    highlighted: false,
  },
  {
    id: 'monthly-5',
    name: '5 Classes/Month',
    priceNGN: 90000,
    period: '/month',
    description: 'Perfect for casual practitioners',
    classLimit: 5,
    features: [
      '5 classes per month',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      'Auto-renewal',
    ],
    highlighted: false,
  },
  {
    id: 'monthly-10',
    name: '10 Classes/Month',
    priceNGN: 177000,
    period: '/month',
    description: 'Best for regular practitioners',
    classLimit: 10,
    features: [
      '10 classes per month',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      '10% off private sessions',
      'Monthly wellness workshop',
      'Auto-renewal',
    ],
    highlighted: false,
  },
  {
    id: 'monthly-unlimited',
    name: 'Unlimited Monthly',
    priceNGN: 420000,
    period: '/month',
    description: 'For total commitment',
    classLimit: null,
    features: [
      'Unlimited classes',
      'Free private session (1/month)',
      'Priority booking',
      '20% off additional private sessions',
      'Monthly wellness workshop',
      'Exclusive member events',
      'Auto-renewal',
    ],
    highlighted: false,
  },
  {
    id: 'quarterly-5',
    name: '5 Classes - Quarterly',
    priceNGN: 109999,
    period: '3 months',
    description: 'Flexible quarterly package',
    classLimit: 5,
    features: [
      '5 classes in 3 months',
      'Access to all class types',
      'Unlimited class swaps',
      'Valid for 3 months',
    ],
    highlighted: false,
  },
  {
    id: 'quarterly-10',
    name: '10 Classes - Quarterly',
    priceNGN: 189999,
    period: '3 months',
    description: 'Great value for committed practitioners',
    classLimit: 10,
    features: [
      '10 classes in 3 months',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      'Valid for 3 months',
    ],
    highlighted: false,
  },
  {
    id: 'quarterly-20',
    name: '20 Classes - Quarterly',
    priceNGN: 360000,
    period: '3 months',
    description: 'Best quarterly value',
    classLimit: 20,
    features: [
      '20 classes in 3 months',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      'Monthly wellness workshop',
      'Valid for 3 months',
    ],
    highlighted: false,
  },
  {
    id: 'quarterly-48',
    name: '48 Classes - Quarterly (3x/week)',
    priceNGN: 840000,
    period: '3 months',
    description: 'Intensive program - ~3 classes per week',
    classLimit: 48,
    features: [
      '48 classes in 3 months (~3/week)',
      'Access to all class types',
      'Unlimited class swaps',
      'Priority booking',
      'Monthly wellness workshop',
      'Valid for 3 months',
    ],
    highlighted: false,
  },
  {
    id: 'annual-unlimited',
    name: 'Unlimited Annual',
    priceNGN: 2500000,
    period: '/year',
    description: 'Best value annual commitment',
    classLimit: null,
    features: [
      'Unlimited classes for 12 months',
      'Free private session (2/month)',
      'Priority booking',
      '20% off additional private sessions',
      'Monthly wellness workshop',
      'Exclusive member events',
      'Save over ₦500,000 vs monthly',
    ],
    highlighted: false,
    badge: 'Best Value',
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
