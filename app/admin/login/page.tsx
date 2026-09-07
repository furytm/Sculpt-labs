'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, getUser } from '@/lib/api/auth'
import { useAuth } from '@/src/components/AuthProvider'

export default function AdminLoginPage() {
  const router = useRouter()
  const { reload } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const result = await authApi.login({
        email: email.trim(),
        password,
      })

      const user = getUser(result)

      if (String(user?.role || '').toUpperCase() !== 'ADMIN') {
        setError('This account does not have admin access.')
        return
      }

      await reload()
      router.replace('/admin')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in.'
      )
    } finally {
      setBusy(false)
    }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12"><div className="w-full max-w-md"><div className="mb-8 text-center"><p className="text-xs uppercase tracking-[0.24em] text-accent">Sculpt LAB · Private access</p><h1 className="mt-3 font-serif text-4xl text-primary">Admin sign in</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">Use an ADMIN account to access studio operations.</p></div><form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"><label className="mb-4 block text-sm">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent" /></label><label className="mb-2 block text-sm">Password<input required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-accent" /></label>{error && <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<button disabled={busy} className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">{busy ? 'Signing in…' : 'Sign in'}</button></form></div></main>
}
