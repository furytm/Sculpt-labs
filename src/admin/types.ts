export type AdminView = 'dashboard' | 'members' | 'bookings' | 'schedule' | 'memberships' | 'payments' | 'health-safety'
export type AdminResourceState = 'loading' | 'ready' | 'empty' | 'unavailable' | 'error'
export type AdminResource<T> = { state: AdminResourceState; data?: T; message?: string }

export const adminLabels: Record<AdminView, string> = { dashboard: 'Dashboard', members: 'Members', bookings: 'Bookings', schedule: 'Schedule', memberships: 'Memberships', payments: 'Payments', 'health-safety': 'Health & Safety' }
export const adminRoutes: Record<AdminView, string> = { dashboard: '/admin', members: '/admin/members', bookings: '/admin/bookings', schedule: '/admin/schedule', memberships: '/admin/memberships', payments: '/admin/payments', 'health-safety': '/admin/health-safety' }
export const unavailableMessage = 'This admin endpoint is not available yet. No data or action has been inferred.'
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sculpt-backend-6flc.onrender.com'

export function isAdminRole(role: unknown) { return String(role || '').toUpperCase() === 'ADMIN' }
export function adminDisplayName(user: unknown) { const value = user && typeof user === 'object' ? user as Record<string, unknown> : {}; return String(value.fullName || value.email || 'Administrator') }
export function initials(user: unknown) { return adminDisplayName(user).split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() }
export function formatAdminDate(value: unknown) { if (!value) return 'Not available'; const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
export function displayValue(value: unknown) { return value === null || value === undefined || value === '' ? 'Not available' : String(value) }
export function money(value: unknown) { return typeof value !== 'number' || !Number.isFinite(value) ? 'Not available' : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value) }
export function classNameFor(value: unknown) { return String(value || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()) || 'Not available' }
export function pick(source: unknown, ...keys: string[]) { const record = source && typeof source === 'object' ? source as Record<string, unknown> : {}; return keys.map((key) => record[key]).find((value) => value !== undefined && value !== null && value !== '') }
export function fullName(source: unknown) { return String(pick(source, 'fullName', 'name', 'memberName') || 'Not available') }
export function email(source: unknown) { return String(pick(source, 'email', 'memberEmail') || 'Not available') }
export function phone(source: unknown) { return String(pick(source, 'phone', 'phoneNumber') || 'Not available') }
export function membershipName(source: unknown) { return String(pick(source, 'membershipName', 'membership', 'name') || 'Not available') }
export function reference(source: unknown) { return String(pick(source, 'paymentReference', 'reference', 'bookingReference', 'id') || 'Not available') }
export function statusValue(source: unknown, ...keys: string[]) { return String(pick(source, ...keys) || 'Not available') }
export function asRecords(value: unknown): Record<string, unknown>[] { if (!Array.isArray(value)) return []; return value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object')) }
export function statusTone(value: unknown) { const status = String(value || '').toUpperCase(); return ['PAID', 'CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(status) ? 'positive' : ['FAILED', 'CANCELLED', 'REJECTED'].includes(status) ? 'negative' : 'pending' }
export function isUnavailableError(error: unknown) { return Boolean(error && typeof error === 'object' && [404, 405].includes(Number((error as { status?: number }).status))) }

export async function adminRequest<T>(path: string): Promise<T> { const response = await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json' } }); const body = await response.json().catch(() => ({})); if (!response.ok) { const error = new Error(body.message || 'Unable to load this resource.') as Error & { status?: number }; error.status = response.status; throw error } return body.data ?? body }
export async function getAdminResource<T>(path: string): Promise<AdminResource<T>> { try { const data = await adminRequest<T>(path); return { state: Array.isArray(data) && data.length === 0 ? 'empty' : 'ready', data } } catch (error) { return isUnavailableError(error) ? { state: 'unavailable', message: unavailableMessage } : { state: 'error', message: error instanceof Error ? error.message : 'Unable to load this resource.' } } }
export function navViews(): AdminView[] { return ['dashboard', 'members', 'bookings', 'memberships', 'payments', 'health-safety'] }
export function adminNavigation() { return navViews().map((view) => ({ view, label: adminLabels[view], href: adminRoutes[view] })) }
