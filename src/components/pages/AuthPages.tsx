'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthForm from '../AuthForm'
import { authApi } from '@/lib/api/auth'
export function RegisterPage() {
  const p = useSearchParams();

  return (
    <AuthShell>
      <AuthForm
        mode="register"
        email={p.get("email") || ""}
      
        reference={p.get("reference") || ""}
      />
    </AuthShell>
  );
}
export function LoginPage() { return <AuthShell><AuthForm mode="login"/></AuthShell> }
export function AuthShell({children}:{children:React.ReactNode}) { return <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">{children}</main> }
export function ForgotPasswordPage(){const [email,setEmail]=useState('');const [state,setState]=useState<'idle'|'busy'|'success'|'error'>('idle');const [message,setMessage]=useState('');async function submit(e:React.FormEvent){e.preventDefault();setState('busy');try{const r=await authApi.forgotPassword(email);setMessage(r.message||'If an account exists for that email, we sent a secure reset link.');setState('success')}catch(x){setMessage(x instanceof Error?x.message:'Unable to send reset email.');setState('error')}}return <AuthShell><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8"><p className="text-xs uppercase tracking-[0.22em] text-accent">Account recovery</p><h1 className="mt-2 font-serif text-4xl text-primary">Reset password</h1>{state==='success'?<div className="mt-6 text-sm leading-6"><p>{message}</p><Link href="/login" className="mt-4 block text-accent hover:underline">Back to log in</Link></div>:<><label className="mt-6 block text-sm">Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"/></label>{message&&<p role="alert" className="mt-3 text-sm text-destructive">{message}</p>}<button disabled={state==='busy'} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground">{state==='busy'?'Sending…':'Send reset link'}</button></>}</form></AuthShell>}
export function ResetPasswordPage(){const p=useSearchParams();const [password,setPassword]=useState('');const [confirm,setConfirm]=useState('');const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);async function submit(e:React.FormEvent){e.preventDefault();if(password!==confirm){setMessage('Passwords do not match.');return}setBusy(true);try{await authApi.resetPassword({token:p.get('token')||'',password,confirmPassword:confirm});setMessage('Your password has been updated. You can now log in.')}catch(x){setMessage(x instanceof Error?x.message:'This reset link is invalid or expired.')}finally{setBusy(false)}}return <AuthShell><form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-border bg-card p-8"><h1 className="font-serif text-4xl text-primary">Choose a new password</h1><label className="mt-6 block text-sm">New password<input required minLength={8} type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"/></label><label className="mt-4 block text-sm">Confirm password<input required minLength={8} type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-2 w-full rounded-lg border border-input bg-background px-4 py-3"/></label>{message&&<p className="mt-4 text-sm text-muted-foreground">{message}</p>}<button disabled={busy} className="mt-5 w-full rounded-lg bg-primary px-4 py-3 text-primary-foreground">{busy?'Updating…':'Update password'}</button></form></AuthShell>}
export function VerifyEmailPage(){const p=useSearchParams();const [state,setState]=useState('verifying');useEffect(()=>{const token=p.get('token');if(!token){setState('invalid');return}authApi.verifyEmail(token).then(()=>setState('success')).catch(()=>setState('invalid'))},[p]);return <AuthShell><div className="w-full max-w-md rounded-2xl border border-border bg-card p-8"><h1 className="font-serif text-4xl text-primary">Verify your email</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">{state==='verifying'?'We are confirming your email address…':state==='success'?'Your email is verified.':'This verification link is invalid or expired.'}</p>{state==='success'&&<Link href="/login" className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-primary-foreground">Go to log in</Link>}</div></AuthShell>}
