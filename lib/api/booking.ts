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
  capacity?: number
  bookedCount?: number
  availableSlots?: number
  isAvailable?: boolean
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
  accepted?: boolean
  declarationVersion?: string | null
  notes?: string | null
  acceptedAt?: string | null
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
  paymentMethod: 'PAYMISH' | 'OFFLINE'
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

  memberSchedules?: MemberSchedule[]
}

export interface CreateBookingResponse {
  success: boolean
  message?: string
  data?: {
    booking?: Booking
    authorizationUrl?: string | null
    authorization_url?: string | null
    bookingFlowToken?: string
  }
}

export interface HealthDeclarationRequest {
  bookingFlowToken: string
  accepted: boolean
  notes?: string
}

export interface HealthDeclarationResponse {
  accepted: boolean
  declarationVersion: string
  notes: string | null
  acceptedAt: string | null
}

export interface UpdateBookingScheduleRequest {
  bookingFlowToken: string
  scheduleId: string
}

export interface UpdateBookingStartDateRequest {
  bookingFlowToken: string
  startDate: string
}

export interface AttachBookingAccountRequest {
  bookingFlowToken: string
}

export interface BookingFlowResponse {
  booking: Booking
  healthDeclaration: HealthDeclarationResponse | null
  selectedSchedule: Schedule | null
  bookingFlowToken?: string
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://sculpt-backend-6flc.onrender.com'

type ApiEnvelope<T> = {
  success?: boolean
  message?: string
  data?: T
}

let refreshPromise: Promise<boolean> | null = null

async function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(
      `${API_BASE_URL}/api/auth/refresh`,
      {
        method: 'POST',
        credentials: 'include',
      }
    )
      .then(response => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

async function request<T>(
  path: string,
  init?: RequestInit,
  retry = true
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  if (
    response.status === 401 &&
    retry &&
    path !== '/api/auth/refresh' &&
    await refreshSession()
  ) {
    return request<T>(path, init, false)
  }

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      body.message || 'Unable to complete request.'
    )
  }

  return body.data ?? body
}

async function requestBooking(
  path: string,
  init?: RequestInit
): Promise<CreateBookingResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  const body = await response.json().catch(() => ({})) as
    ApiEnvelope<CreateBookingResponse['data']> &
    CreateBookingResponse['data']

  if (!response.ok) {
    throw new Error(
      body.message || 'Unable to initialize booking.'
    )
  }

  const payload = body.data ?? body

  const authorizationUrl =
    payload.authorizationUrl ??
    payload.authorization_url ??
    null

  return {
    success: body.success ?? true,
    message: body.message,
    data: payload.booking || authorizationUrl || payload.bookingFlowToken
      ? {
          ...payload,
          authorizationUrl,
        }
      : undefined,
  }
}

/* =========================================================
   MEMBER BOOKINGS
========================================================= */

export async function getMyBookings(): Promise<Booking[]> {
  const data = await request<unknown>(
    '/api/bookings/my'
  )

  const bookings =
    (data as { bookings?: Booking[] })?.bookings ??
    data

  return Array.isArray(bookings)
    ? bookings
    : []
}

/* =========================================================
   BOOKING FLOW
========================================================= */

/**
 * Create the initial booking.
 *
 * The backend returns a bookingFlowToken.
 * This token allows the customer to continue the
 * booking process before creating/logging into an account.
 */
export async function createBooking(
  data: CreateBookingRequest
): Promise<CreateBookingResponse> {
  return requestBooking(
    '/api/bookings',
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
}

/**
 * Get a booking by ID.
 *
 * This endpoint is public and can be used while the
 * customer is still completing the booking flow.
 */
export async function getBooking(
  bookingId: string
): Promise<Booking> {
  return request<Booking>(
    `/api/bookings/${encodeURIComponent(bookingId)}`
  )
}

/** Retrieve a paid guest booking using its payment reference. */
export async function getBookingByReference(
  reference: string
): Promise<BookingFlowResponse> {
  return request<BookingFlowResponse>(
    `/api/bookings/confirmation/${encodeURIComponent(reference)}`
  )
}

export interface ContinueGuestBookingResponse {
  booking: Booking
  bookingFlowToken: string
}

export async function continueGuestBooking(
  reference: string
): Promise<ContinueGuestBookingResponse> {
  return request<ContinueGuestBookingResponse>(
    `/api/bookings/confirmation/${encodeURIComponent(
      reference
    )}/continue`
  )
}

/**
 * Save the simplified Health Declaration.
 *
 * This does NOT require authentication.
 */
export async function saveHealthDeclaration(
  bookingId: string,
  data: HealthDeclarationRequest
): Promise<HealthDeclarationResponse> {
  return request<HealthDeclarationResponse>(
    `/api/bookings/${encodeURIComponent(bookingId)}/health-declaration`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  )
}

/**
 * Select a specific recurring schedule.
 *
 * This does NOT require authentication.
 */
export async function updateBookingSchedule(
  bookingId: string,
  data: UpdateBookingScheduleRequest
): Promise<Booking> {
  return request<Booking>(
    `/api/bookings/${encodeURIComponent(bookingId)}/schedule`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  )
}

/**
 * Select the membership start date.
 *
 * This does NOT require authentication.
 */
export async function updateBookingStartDate(
  bookingId: string,
  data: UpdateBookingStartDateRequest
): Promise<Booking> {
  return request<Booking>(
    `/api/bookings/${encodeURIComponent(bookingId)}/start-date`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    }
  )
}

/**
 * Attach the in-progress booking to the customer's
 * authenticated account.
 */
export async function attachBookingAccount(
  bookingId: string,
  data: AttachBookingAccountRequest
): Promise<Booking> {
  return request<Booking>(
    `/api/bookings/${encodeURIComponent(bookingId)}/attach-account`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
}

/**
 * Get the complete state of a booking flow.
 */
export async function getBookingFlow(
  bookingId: string,
  bookingFlowToken?: string
): Promise<BookingFlowResponse> {
  const query = bookingFlowToken
    ? `?bookingFlowToken=${encodeURIComponent(bookingFlowToken)}`
    : ''

  return request<BookingFlowResponse>(
    `/api/bookings/${encodeURIComponent(bookingId)}${query}`
  )
}

/**
 * Confirm the booking.
 *
 * This requires authentication because the account must
 * already be attached at this point.
 */
export async function confirmBooking(
  bookingId: string,
  bookingFlowToken?: string
) {
  return request(
    `/api/bookings/${encodeURIComponent(bookingId)}/confirm`,
    {
      method: 'POST',
      body: JSON.stringify(
        bookingFlowToken
          ? { bookingFlowToken }
          : {}
      ),
    }
  )
}

/* =========================================================
   SCHEDULES
========================================================= */

export async function getClassSchedules(
  classId: string
): Promise<Schedule[]> {
  const data = await request<unknown>(
    `/api/schedules/class/${encodeURIComponent(classId)}`
  )

  const schedules =
    (data as { schedules?: Schedule[] })?.schedules ??
    data

  return Array.isArray(schedules)
    ? schedules.filter(
        item => item && item.isActive !== false
      )
    : []
}

/* =========================================================
   LEGACY BOOKING METHODS
   Keep these temporarily for existing frontend consumers.
========================================================= */

export async function updateBookingPart(
  bookingId: string,
  part: 'class' | 'schedule' | 'start-date',
  body: Record<string, string>
) {
  return request(
    `/api/bookings/${encodeURIComponent(bookingId)}/${part}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    }
  )
}

export async function saveHealthSafety(
  bookingId: string,
  body: Record<string, unknown>
) {
  return request(
    `/api/bookings/${encodeURIComponent(bookingId)}/health-safety`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    }
  )
}

export async function assignBookingSchedules(
  bookingId: string
) {
  return request(
    `/api/bookings/${encodeURIComponent(bookingId)}/assign-schedules`,
    {
      method: 'POST',
    }
  )
}

/* =========================================================
   FORMATTING
========================================================= */

export function formatTime(
  value?: string | null
) {
  if (!value) return ''

  const [hour, minute = '00'] =
    value.split(':')

  const h = Number(hour)

  if (Number.isNaN(h)) {
    return value
  }

  return `${h % 12 || 12}:${minute} ${
    h >= 12 ? 'PM' : 'AM'
  }`
}

export function scheduleLabel(
  schedule?: Schedule | null
) {
  if (!schedule) {
    return 'Schedule not selected'
  }

  return `${schedule.dayOfWeek} · ${formatTime(
    schedule.startTime
  )} – ${formatTime(schedule.endTime)}${
    schedule.tutorName
      ? ` · ${schedule.tutorName}`
      : ''
  }`
}

export function formatDate(
  value?: string | null
) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  )
}

export function isUpcoming(
  booking: Booking
) {
  if (!booking.bookingDate) {
    return false
  }

  const date = new Date(
    booking.bookingDate
  )

  return (
    !Number.isNaN(date.getTime()) &&
    date >= new Date() &&
    booking.bookingStatus === 'CONFIRMED'
  )
}

export function hasHealthSafety(
  booking: Booking
) {
  return Boolean(
    booking.healthSafetyForm?.accepted ||
    booking.healthSafetyForm?.submittedAt ||
    booking.healthSafetyForm?.createdAt ||
    booking.healthSafetyForm?.id
  )
}

/* =========================================================
   MEMBERSHIPS
========================================================= */

export async function fetchMemberships(
  type = 'GROUP'
) {
  return request<Membership[]>(
    `/api/memberships?type=${encodeURIComponent(type)}`
  )
}

/* =========================================================
   ADMIN
========================================================= */

export interface AdminDashboardStats {
  totalMembers: number
  activeMemberships: number
  pendingBookings: number
  confirmedBookings: number
  paidBookings: number
  pendingPayments: number
  offlinePayments: number
}

export interface UpcomingScheduleItem {
  dayOfWeek: string
  startTime: string
  endTime: string
  className?: string | null
  tutorName?: string | null
}

export interface AdminRecentBooking
  extends Booking {
  membership?: Membership | null
  memberSchedules?: MemberSchedule[]
}

export interface AdminDashboardData {
  stats: AdminDashboardStats
  recentBookings: AdminRecentBooking[]
  upcomingSchedule: UpcomingScheduleItem[]
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const data =
    await request<AdminDashboardData>(
      '/api/admin/dashboard'
    )

  return {
    stats: (data?.stats ?? {}) as AdminDashboardStats,
    recentBookings:
      Array.isArray(data?.recentBookings)
        ? data.recentBookings
        : [],
    upcomingSchedule:
      Array.isArray(data?.upcomingSchedule)
        ? data.upcomingSchedule
        : [],
  }
}

export async function getAdminBookings(): Promise<
  AdminRecentBooking[]
> {
  const data = await request<unknown>(
    '/api/admin/bookings'
  )

  const bookings =
    (data as {
      bookings?: AdminRecentBooking[]
    })?.bookings ?? data

  return Array.isArray(bookings)
    ? bookings
    : []
}

export async function confirmOfflinePayment(
  bookingId: string
) {
  return request(
    `/api/admin/payments/${encodeURIComponent(
      bookingId
    )}/confirm`,
    {
      method: 'POST',
    }
  )
}

export async function rejectOfflinePayment(
  bookingId: string
) {
  return request(
    `/api/admin/payments/${encodeURIComponent(
      bookingId
    )}/reject`,
    {
      method: 'POST',
    }
  )
}

/* =========================================================
   LEGACY FORM TYPES
========================================================= */

export type BookingData = {
  id: string
  personalInfo: {
    name: string
    email: string
    phone: string
  }
  membership: {
    id: string
    name: string
    priceNGN: number
  }
  classSession: {
    classId: string
    className: string
    instructorId: string
    instructorName: string
    date: string
    time: string
    duration: number
  }
  voucher?: {
    code: string
    discount: number
  }
  subtotal: number
  discount: number
  totalAmount: number
  timestamp: string
}

export type Answer = 'Yes' | 'No'

export type Health = Record<
  string,
  string | boolean | string[]
>
