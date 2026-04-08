import { useState } from 'react'
import {
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithEmail,
  signUpWithEmail,
} from '../lib/auth'

type Mode = 'signin' | 'signup'

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)
  const [busy, setBusy]         = useState(false)

  function clearMessages() {
    setError(null)
    setSuccess(null)
  }

  async function handleGoogle() {
    clearMessages()
    setBusy(true)
    const { error } = await signInWithGoogle()
    if (error) setError(error.message)
    setBusy(false)
  }

  async function handleMicrosoft() {
    clearMessages()
    setBusy(true)
    const { error } = await signInWithMicrosoft()
    if (error) setError(error.message)
    setBusy(false)
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearMessages()
    setBusy(true)

    if (mode === 'signin') {
      const { error } = await signInWithEmail(email, password)
      if (error) setError(error.message)
    } else {
      if (password.length < 8) {
        setError('Password must be at least 8 characters.')
        setBusy(false)
        return
      }
      const { error } = await signUpWithEmail(email, password, fullName)
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }

    setBusy(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Header */}
        <div className="auth-header">
          <span className="auth-xoanon">XOANON</span>
          <span className="auth-nyx">NYX</span>
          <p className="auth-tagline">Your AI. Your workspace.</p>
        </div>

        {/* Mode toggle */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'signin' ? 'active' : ''}`}
            onClick={() => { setMode('signin'); clearMessages() }}
          >
            Sign in
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); clearMessages() }}
          >
            Sign up
          </button>
        </div>

        {/* Social buttons */}
        <div className="auth-socials">
          <button className="auth-social-btn" onClick={handleGoogle} disabled={busy}>
            {/* Google G icon */}
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C41.3 36.1 44 30.5 44 24c0-1.3-.1-2.7-.4-3.9z"/>
            </svg>
            Continue with Google
          </button>

          <button className="auth-social-btn" onClick={handleMicrosoft} disabled={busy}>
            {/* Microsoft 4-color grid */}
            <svg width="17" height="17" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
              <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
              <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
              <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
              <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
            </svg>
            Continue with Microsoft
          </button>
        </div>

        {/* Divider */}
        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or</span>
          <span className="auth-divider-line" />
        </div>

        {/* Email form */}
        <form className="auth-form" onSubmit={handleEmailSubmit}>
          {mode === 'signup' && (
            <input
              className="auth-input"
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          )}
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="auth-input"
            type="password"
            placeholder={mode === 'signup' ? 'Password (min 8 chars)' : 'Password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />

          {error   && <p className="auth-error">{error}</p>}
          {success && <p className="auth-success">{success}</p>}

          <button className="auth-submit" type="submit" disabled={busy}>
            {busy
              ? 'Please wait…'
              : mode === 'signin'
                ? 'Sign in'
                : 'Create account'
            }
          </button>
        </form>

        {/* Footer toggle */}
        <p className="auth-footer">
          {mode === 'signin' ? (
            <>Don't have an account?{' '}
              <button className="auth-link" onClick={() => { setMode('signup'); clearMessages() }}>
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button className="auth-link" onClick={() => { setMode('signin'); clearMessages() }}>
                Sign in
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  )
}
