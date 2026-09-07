export interface Voucher {
  id: string
  code: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  maxUses: number
  usedCount: number
  expiryDate: string // ISO date string
  minPurchaseAmount: number
  description: string
}

export const vouchers: Voucher[] = [
  {
    id: 'welcome20',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    maxUses: 999,
    usedCount: 45,
    expiryDate: '2024-12-31',
    minPurchaseAmount: 50000,
    description: '20% off first membership',
  },
  {
    id: 'summer10',
    code: 'SUMMER10',
    discountType: 'percentage',
    discountValue: 10,
    maxUses: 500,
    usedCount: 120,
    expiryDate: '2024-09-30',
    minPurchaseAmount: 25000,
    description: 'Summer special - 10% off',
  },
  {
    id: 'friend5k',
    code: 'FRIEND5K',
    discountType: 'fixed',
    discountValue: 5000,
    maxUses: 200,
    usedCount: 87,
    expiryDate: '2024-08-31',
    minPurchaseAmount: 25000,
    description: 'Refer a friend - 5k NGN off',
  },
  {
    id: 'loyalty15',
    code: 'LOYALTY15',
    discountType: 'percentage',
    discountValue: 15,
    maxUses: 100,
    usedCount: 12,
    expiryDate: '2024-11-30',
    minPurchaseAmount: 100000,
    description: 'Loyalty members - 15% off',
  },
]

export function validateVoucher(code: string, purchaseAmount: number): { valid: boolean; discount: number; message: string } {
  const voucher = vouchers.find((v) => v.code.toUpperCase() === code.toUpperCase())

  if (!voucher) {
    return { valid: false, discount: 0, message: 'Voucher code not found' }
  }

  const now = new Date()
  const expiry = new Date(voucher.expiryDate)
  if (now > expiry) {
    return { valid: false, discount: 0, message: 'Voucher has expired' }
  }

  if (voucher.usedCount >= voucher.maxUses) {
    return { valid: false, discount: 0, message: 'Voucher code limit reached' }
  }

  if (purchaseAmount < voucher.minPurchaseAmount) {
    return { valid: false, discount: 0, message: `Minimum purchase amount is ₦${voucher.minPurchaseAmount}` }
  }

  let discount = 0
  if (voucher.discountType === 'percentage') {
    discount = Math.floor((purchaseAmount * voucher.discountValue) / 100)
  } else {
    discount = voucher.discountValue
  }

  return { valid: true, discount, message: 'Voucher applied successfully' }
}

export function getVoucherById(id: string): Voucher | undefined {
  return vouchers.find((v) => v.id === id)
}

export function getVoucherByCode(code: string): Voucher | undefined {
  return vouchers.find((v) => v.code.toUpperCase() === code.toUpperCase())
}
