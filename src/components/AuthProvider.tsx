'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, AuthUser, getUser } from '@/lib/api/auth'

type AuthContextValue = { user: AuthUser | null; loading: boolean; authenticated: boolean; reload: () => Promise<void>; logout: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const load = useCallback(async () => {
    try { setUser(getUser(await authApi.me()) || null) } catch { setUser(null) } finally { setLoading(false) }
  }, [])
  useEffect(() => { void load() }, [load])
  const logout = useCallback(async () => { try { await authApi.logout() } finally { setUser(null) } }, [])
  const value = useMemo(() => ({ user, loading, authenticated: Boolean(user), reload: load, logout }), [user, loading, load, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error('useAuth must be used inside AuthProvider'); return value }

export function useRequireAuth() {
  const auth = useAuth(); const router = useRouter()
  useEffect(() => { if (!auth.loading && !auth.user) router.replace('/login') }, [auth.loading, auth.user, router])
  return auth
}
