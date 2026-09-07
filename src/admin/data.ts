import { getMyBookings, fetchMemberships, type Booking, type Membership } from '@/lib/api/booking'
import { API_BASE_URL, type AdminResource } from './types'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, credentials: 'include', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) { const error = new Error(body.message || 'Unable to load this resource.') as Error & { status?: number }; error.status = response.status; throw error }
  return (body.data ?? body) as T
}

export type DashboardData = { stats: { totalMembers: number; activeMemberships: number; pendingBookings: number; confirmedBookings: number; paidBookings: number; pendingPayments: number; offlinePayments: number }; recentBookings: Record<string, unknown>[]; upcomingSchedule: Record<string, unknown>[] }
export type PaymentRecord = Record<string, unknown>

export async function loadDashboard() { return request<DashboardData>('/api/admin/dashboard') }
export async function loadPendingPayments() { return request<PaymentRecord[]>('/api/admin/payments/pending') }
export async function loadPayment(bookingId: string) { return request<PaymentRecord>(`/api/admin/payments/${encodeURIComponent(bookingId)}`) }
export async function updatePayment(bookingId: string, action: 'confirm' | 'reject') { return request<PaymentRecord>(`/api/admin/payments/${encodeURIComponent(bookingId)}/${action}`, { method: 'POST' }) }
export async function updateAdminUser(userId: string, payload: Record<string, string>) { return request<Record<string, unknown>>(`/api/admin/users/${encodeURIComponent(userId)}`, { method: 'PATCH', body: JSON.stringify(payload) }) }
export async function updateProfile(payload: { fullName: string; phone: string; avatar: string }) { return request<Record<string, unknown>>('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(payload) }) }
export async function loadBookings(): Promise<AdminResource<Booking[]>> { try { const data = await getMyBookings(); return { state: data.length ? 'ready' : 'empty', data } } catch (error) { return { state: 'error', message: error instanceof Error ? error.message : 'Unable to load bookings.' } } }
export async function loadMemberships(): Promise<AdminResource<Membership[]>> { try { const data = await fetchMemberships(); return { state: data.length ? 'ready' : 'empty', data } } catch (error) { return { state: 'error', message: error instanceof Error ? error.message : 'Unable to load memberships.' } } }
export function unavailableAdmin() { return { state: 'unavailable' as const, message: 'This admin endpoint is not available yet. No data or action has been inferred.' } }
export function isUnavailable(error: unknown) { return [404, 405].includes(Number((error as { status?: number })?.status)) }
export async function loadAdmin(path: string) { try { const data = await request<unknown[]>(path); return { state: Array.isArray(data) && data.length === 0 ? 'empty' as const : 'ready' as const, data } } catch (error) { return isUnavailable(error) ? unavailableAdmin() : { state: 'error' as const, message: error instanceof Error ? error.message : 'Unable to load this resource.' } } }
export { request as adminRequest }

export type { Booking, Membership }

export function createResource<T>(promise: Promise<T>): Promise<AdminResource<T>> { return promise.then(data => ({ state: Array.isArray(data) && data.length === 0 ? 'empty' as const : 'ready' as const, data })).catch(error => isUnavailable(error) ? unavailableAdmin() : ({ state: 'error' as const, message: error instanceof Error ? error.message : 'Unable to load this resource.' })) }

export function formatValue(value: unknown) { return value === null || value === undefined || value === '' ? 'Not available' : String(value) }
export function formatDateValue(value: unknown) { if (!value) return 'Not available'; const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
export function moneyValue(value: unknown) { return typeof value === 'number' ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value) : formatValue(value) }
export function pickValue(source: unknown, ...keys: string[]) { const record = source && typeof source === 'object' ? source as Record<string, unknown> : {}; return keys.map(key => record[key]).find(value => value !== undefined && value !== null && value !== '') }
export function recordName(source: unknown) { return formatValue(pickValue(source, 'fullName', 'name', 'memberName', 'email')) }
export function recordId(source: unknown) { return formatValue(pickValue(source, 'id', 'bookingId', '_id')) }
export function recordStatus(source: unknown) { return formatValue(pickValue(source, 'status', 'paymentStatus', 'bookingStatus')) }
export function recordDate(source: unknown) { return formatDateValue(pickValue(source, 'createdAt', 'bookingDate', 'date')) }
export function recordClass(source: unknown) { return formatValue(pickValue(source, 'className', 'classId', 'name')) }
