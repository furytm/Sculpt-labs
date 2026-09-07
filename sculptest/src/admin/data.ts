import { getAdminResource, type AdminResource } from './types'
import { getMyBookings, fetchMemberships, type Booking, type Membership } from '@/lib/api/booking'

export async function loadBookings(): Promise<AdminResource<Booking[]>> { try { const data = await getMyBookings(); return { state: data.length ? 'ready' : 'empty', data } } catch (error) { return { state: 'error', message: error instanceof Error ? error.message : 'Unable to load bookings.' } } }
export async function loadMemberships(): Promise<AdminResource<Membership[]>> { try { const data = await fetchMemberships(); return { state: data.length ? 'ready' : 'empty', data } } catch (error) { return { state: 'error', message: error instanceof Error ? error.message : 'Unable to load memberships.' } } }
export async function loadAdmin(path: string) { return getAdminResource<unknown[]>(path) }
export function unavailableAdmin() { return { state: 'unavailable' as const, message: 'This admin endpoint is not available yet. No data or action has been inferred.' } }
