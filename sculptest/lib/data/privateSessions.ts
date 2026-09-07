export interface PrivateSessionPackage {
  id: string
  type: 'single' | 'duet'
  sessions: number
  priceNGN: number
  pricePerPersonNGN: number
  description: string
  savings?: string
  featured?: boolean
}

export const privateSessionPackages: PrivateSessionPackage[] = [
  {
    id: 'single-1',
    type: 'single',
    sessions: 1,
    priceNGN: 75000,
    pricePerPersonNGN: 75000,
    description: 'Single private session',
    featured: false,
  },
  {
    id: 'single-5',
    type: 'single',
    sessions: 5,
    priceNGN: 350000,
    pricePerPersonNGN: 70000,
    description: '5 private sessions - Save ₦25,000',
    savings: 'Save ₦25,000',
    featured: true,
  },
  {
    id: 'single-10',
    type: 'single',
    sessions: 10,
    priceNGN: 650000,
    pricePerPersonNGN: 65000,
    description: '10 private sessions - Save ₦100,000',
    savings: 'Save ₦100,000',
    featured: false,
  },
  {
    id: 'duet-1',
    type: 'duet',
    sessions: 1,
    priceNGN: 100000,
    pricePerPersonNGN: 50000,
    description: 'Single duet session (₦50,000 per person)',
    featured: false,
  },
  {
    id: 'duet-10',
    type: 'duet',
    sessions: 10,
    priceNGN: 900000,
    pricePerPersonNGN: 450000,
    description: '10 duet sessions - Save ₦100,000',
    savings: 'Save ₦100,000',
    featured: false,
  },
]

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(price)
}

export function getPrivateSessionPackagesByType(
  type: 'single' | 'duet'
): PrivateSessionPackage[] {
  return privateSessionPackages.filter((pkg) => pkg.type === type)
}
