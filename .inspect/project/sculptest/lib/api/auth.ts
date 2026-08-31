const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sculpt-backend-6flc.onrender.com'

type AuthResponse = { success?: boolean; message?: string; data?: any; user?: any; accessToken?: string; refreshToken?: string }

async function request(path: string, options: RequestInit = {}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  const body = await response.text()
  let data: AuthResponse
  try { data = JSON.parse(body) } catch { throw new Error(`Account API returned ${response.status} instead of JSON.`) }
  if (!response.ok) throw new Error(data.message || 'Unable to complete account request.')
  return data
}

export const authApi = {
  register: (payload: Record<string, unknown>) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload: Record<string, unknown>) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  forgotPassword: (email: string) => request('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (payload: Record<string, unknown>) => request('/api/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) }),
  verifyEmail: (token: string) => request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),
  me: (token: string) => request('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
}

export function saveAuthSession(data: AuthResponse) {
  if (typeof window === 'undefined') return
  const token = data.accessToken || data.data?.accessToken
  const refresh = data.refreshToken || data.data?.refreshToken
  if (token) sessionStorage.setItem('sculpt_access_token', token)
  if (refresh) sessionStorage.setItem('sculpt_refresh_token', refresh)
}

export function getAccessToken() { return typeof window === 'undefined' ? null : sessionStorage.getItem('sculpt_access_token') }
export function clearAuthSession() { if (typeof window !== 'undefined') { sessionStorage.removeItem('sculpt_access_token'); sessionStorage.removeItem('sculpt_refresh_token') } }
export { API_BASE_URL }
