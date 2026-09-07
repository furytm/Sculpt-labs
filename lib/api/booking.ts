export interface CreateBookingRequest {
  fullName: string
  email: string
  phone: string
  membershipId: string
  classId?: string
  scheduleId?: string
  bookingDate?: string
  paymentMethod: 'PAYMISH' | 'OFFLINE'
}

export interface Schedule {
  id: string
  className: string
  tutorName?: string | null
  code?: string | null
  dayOfWeek: string
  startTime: string
  endTime: string
  isActive: boolean
}

export interface MemberSchedule {
  id: string
  userId: string
  bookingId: string
  scheduleId: string
  classId: string
  startDate?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  schedule: Schedule
}

export interface Membership {
  id?: string
  name?: string
  type?: string
  price?: number
  priceNGN?: number
  duration?: number
  period?: string
  classLimit?: number | null
  status?: string
  startDate?: string | null
  endDate?: string | null
  expiryDate?: string | null
  autoRenew?: boolean
  features?: string[]
}

export interface HealthSafetyForm {
  id?: string
  submittedAt?: string | null
  createdAt?: string | null
}

export interface Booking {
  id: string
  fullName: string
  email: string
  phone: string
  classId: string | null
  scheduleId: string | null
  bookingDate: string | null
  amount: number
  paymentReference: string
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED'
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  membershipId: string
  userId: string | null
  createdAt: string
  updatedAt: string

  membership?: Membership | null
  schedule?: Schedule | null
  healthSafetyForm?: HealthSafetyForm | null

  preferredStartDate?: string | null
  availableDays?: string[]
  preferredTimes?: string[]

  // ADD THIS
  memberSchedules?: MemberSchedule[]
}
export interface CreateBookingResponse { success: boolean; message?: string; data?: { booking?: Booking; authorizationUrl?: string; authorization_url?: string } }
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sculpt-backend-6flc.onrender.com'

type ApiEnvelope<T> = { success?: boolean; message?: string; data?: T }

async function request<T>(path: string, init?: RequestInit): Promise<T> { const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, ...init }); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(body.message || 'Unable to complete request.'); return body.data ?? body }

async function requestBooking(path: string, init?: RequestInit): Promise<CreateBookingResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) }, ...init })
  const body = await response.json().catch(() => ({})) as ApiEnvelope<CreateBookingResponse['data']> & CreateBookingResponse['data']
  if (!response.ok) throw new Error(body.message || 'Unable to initialize payment.')

  const payload = body.data ?? body
  const authorizationUrl = payload.authorizationUrl ?? payload.authorization_url
  return {
    success: body.success ?? Boolean(authorizationUrl),
    message: body.message,
    data: payload.booking || authorizationUrl ? { ...payload, authorizationUrl } : undefined,
  }
}
export async function getMyBookings(): Promise<Booking[]> { const data = await request<unknown>('/api/bookings/my'); const bookings = (data as { bookings?: Booking[] })?.bookings ?? data; return Array.isArray(bookings) ? bookings : [] }
export async function getClassSchedules(classId: string): Promise<Schedule[]> { const data = await request<unknown>(`/api/schedules/class/${encodeURIComponent(classId)}`); const schedules = (data as { schedules?: Schedule[] })?.schedules ?? data; return Array.isArray(schedules) ? schedules.filter(item => item && item.isActive !== false) : [] }
export async function updateBookingPart(
  bookingId: string,
  part: 'class' | 'schedule' | 'start-date',
  body: Record<string, string>
) {
  return request(`/api/bookings/${bookingId}/${part}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
export async function saveHealthSafety(bookingId: string, body: Record<string, unknown>) { return request(`/api/bookings/${bookingId}/health-safety`, { method: 'PATCH', body: JSON.stringify(body) }) }

export async function assignBookingSchedules(
  bookingId: string
) {
  return request(
    `/api/bookings/${bookingId}/assign-schedules`,
    {
      method: 'POST',
    }
  )
}
export async function confirmBooking(bookingId: string) { return request(`/api/bookings/${bookingId}/confirm`, { method: 'POST' }) }
export async function createBooking(data: CreateBookingRequest): Promise<CreateBookingResponse> { return requestBooking('/api/bookings', { method: 'POST', body: JSON.stringify(data) }) }

export function formatTime(value?: string | null) { if (!value) return ''; const [hour, minute = '00'] = value.split(':'); const h = Number(hour); if (Number.isNaN(h)) return value; return `${h % 12 || 12}:${minute} ${h >= 12 ? 'PM' : 'AM'}` }
export function scheduleLabel(schedule?: Schedule | null) { return schedule ? `${schedule.dayOfWeek} · ${formatTime(schedule.startTime)} – ${formatTime(schedule.endTime)}${schedule.tutorName ? ` · ${schedule.tutorName}` : ''}` : 'Schedule not selected' }
export function formatDate(value?: string | null) { if (!value) return ''; const date = new Date(value); return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }

export function isUpcoming(booking: Booking) { if (!booking.bookingDate) return false; const date = new Date(booking.bookingDate); return !Number.isNaN(date.getTime()) && date >= new Date() && booking.bookingStatus === 'CONFIRMED' }
export function hasHealthSafety(booking: Booking) { return Boolean(booking.healthSafetyForm?.submittedAt || booking.healthSafetyForm?.createdAt || booking.healthSafetyForm?.id) }

export async function fetchMemberships(type = 'GROUP') { return request<Membership[]>(`/api/memberships?type=${encodeURIComponent(type)}`) }

export type BookingData = { id: string; personalInfo: { name: string; email: string; phone: string }; membership: { id: string; name: string; priceNGN: number }; classSession: { classId: string; className: string; instructorId: string; instructorName: string; date: string; time: string; duration: number }; voucher?: { code: string; discount: number }; subtotal: number; discount: number; totalAmount: number; timestamp: string }
// Keep these declarations for existing booking form consumers.
export type Answer = 'Yes' | 'No'
export type Health = Record<string, string | boolean | string[]>
