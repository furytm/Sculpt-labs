'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

import { authApi } from '@/lib/api/auth'
import { useAuth } from '@/src/components/AuthProvider'
import { toast } from '@/hooks/use-toast'

export default function AuthForm({
  mode,
  email: initialEmail = '',
  reference = '',
}: {
  mode: 'login' | 'register'
  email?: string
  reference?: string
}) {
  const router = useRouter()
  const { reload } = useAuth()

  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')


 const [fullName, setFullName] = useState('')
const [phone, setPhone] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()

    setError('')
    setSuccess('')

    const cleanFullName = fullName.trim()
    const cleanEmail = email.trim()
    const cleanPhone = phone.trim()

    if (mode === 'register' && !cleanFullName) {
      setError('Please enter your full name.')
      return
    }

    if (mode === 'register' && !cleanPhone) {
      setError('Please enter your phone number.')
      return
    }

    if (
      mode === 'register' &&
      password !== confirmPassword
    ) {
      setError('Passwords do not match.')
      return
    }

 setBusy(true)

try {
  const registerPayload = {
    fullName: cleanFullName,
    email: cleanEmail,
    password,
    confirmPassword,
    phone: cleanPhone,
    bookingReference: reference.trim(),
  }

  // console.log(
  //   '🔥 REGISTER PAYLOAD BEFORE API:',
  //   registerPayload
  // )

  const result =
    mode === 'login'
      ? await authApi.login({
          email: cleanEmail,
          password,
        })
      : await authApi.register(registerPayload)
      if (mode === 'register') {
        toast({
          title: 'Account created',
          description:
            'Your account has been created successfully',
        })

        setSuccess(
          'Your account is ready. Check your email to verify it, then log in.'
        )
      } else {
        toast({
          title: 'Welcome back',
          description: 'You are now signed in.',
        })

        await reload()
        router.replace('/dashboard')
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to continue.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
    >
      {/* HEADER */}
      <div className="mb-7">
        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-accent">
          Sculpt LAB members
        </p>

        <h1 className="font-serif text-4xl text-primary">
          {mode === 'login'
            ? 'Welcome back'
            : 'Create your account'}
        </h1>

        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {mode === 'login'
            ? 'Access your memberships and upcoming sessions.'
            : 'Save your booking details and manage your studio experience.'}
        </p>
      </div>

      {/* SUCCESS MESSAGE */}
      {success ? (
        <div
          role="status"
          className="rounded-lg bg-accent/10 p-4 text-sm leading-6 text-foreground"
        >
          {success}

          <Link
            href="/login"
            className="mt-4 block font-medium text-accent hover:underline"
          >
            Continue to log in
          </Link>
        </div>
      ) : (
        <>
          {/* REGISTRATION FIELDS */}
          {mode === 'register' && (
            <>
              <label
                className="mb-4 block text-sm"
                htmlFor="fullName"
              >
                Full name

                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) =>
                    setFullName(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"
                />
              </label>

              <label className="mb-4 block text-sm">
                Phone

                <input
                  required
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"
                />
              </label>
            </>
          )}

          {/* EMAIL */}
          <label className="mb-4 block text-sm">
            Email

            <input
              required
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"
            />
          </label>

          {/* PASSWORD */}
          <label className="mb-2 block text-sm">
            Password

            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"
            />
          </label>

          {/* CONFIRM PASSWORD */}
          {mode === 'register' && (
            <label className="mb-4 block text-sm">
              Confirm password

              <input
                required
                minLength={8}
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"
              />
            </label>
          )}

          {/* LOGIN OPTIONS */}
          {mode === 'login' && (
            <>
              <Link
                href="/forgot-password"
                className="mb-5 block text-right text-sm text-accent hover:underline"
              >
                Forgot password?
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.location.href = `${
                    process.env.NEXT_PUBLIC_API_URL ||
                    'https://sculpt-backend-6flc.onrender.com'
                  }/api/auth/google`
                }}
                className="mb-4 w-full rounded-lg border border-primary px-4 py-3 text-primary"
              >
                Continue with Google
              </button>
            </>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          {/* SUBMIT */}
          <button
            disabled={busy}
            className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy
              ? 'Please wait…'
              : mode === 'login'
                ? 'Log in'
                : 'Create account'}
          </button>

          {/* SWITCH AUTH MODE */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                New to Sculpt LAB?{' '}
                <Link
                  className="text-accent hover:underline"
                  href="/register"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already a member?{' '}
                <Link
                  className="text-accent hover:underline"
                  href="/login"
                >
                  Log in
                </Link>
              </>
            )}
          </p>
        </>
      )}
    </motion.form>
  )
}
