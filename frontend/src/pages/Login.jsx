import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authLogin } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'
import { useAuth } from '../state/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getLoginErrorMessage(err) {
  const raw = parseApiError(err)
  const msg = String(raw || '').toLowerCase()
  const status = err?.response?.status

  if (msg.includes('email') && msg.includes('password')) return 'Incorrect email and password'
  if (msg.includes('email') || msg.includes('user not found') || msg.includes('not found')) return 'Incorrect email'
  if (msg.includes('password')) return 'Incorrect password'
  if (msg.includes('invalid credentials') || msg.includes('bad credentials') || status === 401 || status === 403) {
    return 'Incorrect email or password'
  }
  return raw
}

export default function Login() {
  const nav = useNavigate()
  const toast = useToast()
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const emailValue = email.trim()
    const passwordValue = password.trim()

    if (!emailValue && !passwordValue) {
      toast.push('Email and password are required', 'warn')
      return
    }
    if (!emailValue) {
      toast.push('Email is required', 'warn')
      return
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      toast.push('Please enter a valid email address', 'warn')
      return
    }
    if (!passwordValue) {
      toast.push('Password is required', 'warn')
      return
    }

    setLoading(true)
    try {
      // Backend decides role (ADMIN or PASSENGER)
      const res = await authLogin({ email: emailValue, password })
      const data = res.data || {}
      auth.setLoggedIn(data)

      if (data.role === 'ADMIN') {
        toast.push('Admin login successful', 'success')
        nav('/admin')
      } else if (data.role === 'PASSENGER') {
        toast.push('Passenger login successful', 'success')
        nav('/search')
      } else {
        toast.push('Login failed (unexpected response)', 'error')
      }
    } catch (err) {
      toast.push(getLoginErrorMessage(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  const IconUser = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.5 3.13-6 7-6s7 2.5 7 6" />
    </svg>
  )
  const IconEnvelope = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
  const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )

  return (
    <section className="register-page" aria-label="Login">
      <div className="register-card card">
        <div className="register-head">
          <div className="register-head-circle">
            <IconUser />
          </div>
        </div>
        <h2 className="register-title">Login</h2>
        <p className="register-subtitle muted">
          Use your Passenger or Admin credentials. The system will log you in accordingly.
        </p>

        <form onSubmit={submit} className="register-form login-form">
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconEnvelope /></span>
            <input id="login-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your Email" required />
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconLock /></span>
            <input id="login-password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" required />
          </div>

          <div className="register-actions">
            <button type="submit" className="register-btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}