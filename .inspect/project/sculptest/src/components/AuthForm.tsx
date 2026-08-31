'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { authApi, saveAuthSession } from '../../lib/api/auth'

export default function AuthForm({ mode, email: initialEmail = '', reference = '' }: { mode: 'login' | 'register'; email?: string; reference?: string }) {
  const router = useRouter(); const [email, setEmail] = useState(initialEmail); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError(''); try { const result = mode === 'login' ? await authApi.login({ email, password }) : await authApi.register({ name, email, password, bookingReference: reference || undefined }); saveAuthSession(result); router.push('/dashboard') } catch (e) { setError(e instanceof Error ? e.message : 'Unable to continue.') } finally { setBusy(false) } }
  return <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
    <div className="mb-7"><p className="mb-2 text-xs uppercase tracking-[0.22em] text-accent">Sculpt LAB members</p><h1 className="font-serif text-4xl text-primary">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{mode === 'login' ? 'Access your memberships and upcoming sessions.' : 'Save your booking details and manage your studio experience.'}</p></div>
    {mode === 'register' && <label className="mb-4 block text-sm">Full name<input required value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3" /></label>}
    <label className="mb-4 block text-sm">Email<input required type="email" value={email} readOnly={Boolean(initialEmail)} onChange={e => setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3" /></label>
    <label className="mb-2 block text-sm">Password<input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3" /></label>
    {mode === 'login' && <Link href="/forgot-password" className="mb-5 block text-right text-sm text-accent hover:underline">Forgot password?</Link>}
    {error && <p role="alert" className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60">{busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}</button>
    <p className="mt-6 text-center text-sm text-muted-foreground">{mode === 'login' ? <>New to Sculpt LAB? <Link className="text-accent hover:underline" href="/register">Create an account</Link></> : <>Already a member? <Link className="text-accent hover:underline" href="/login">Log in</Link></>}</p>
  </motion.form>
}
