import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authLogin, passengerRegister } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useAuth } from '../state/AuthContext'
import { useToast } from '../state/ToastContext'

const NAME_MAX_LENGTH = 50
const PHONE_MAX_LENGTH = 10
const NAME_REGEX = /^[A-Za-z ]+$/
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_HAS_LOWER = /[a-z]/
const PASSWORD_HAS_UPPER = /[A-Z]/
const PASSWORD_HAS_NUMBER = /[0-9]/
const PASSWORD_HAS_SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/

function validatePassword(pwd) {
  if (!pwd || pwd.length < PASSWORD_MIN_LENGTH) return 'Password must be at least 8 characters.'
  if (!PASSWORD_HAS_LOWER.test(pwd)) return 'Password must include at least one lowercase letter.'
  if (!PASSWORD_HAS_UPPER.test(pwd)) return 'Password must include at least one uppercase letter.'
  if (!PASSWORD_HAS_NUMBER.test(pwd)) return 'Password must include at least one number.'
  if (!PASSWORD_HAS_SPECIAL.test(pwd)) return 'Password must include at least one special character (!@#$%^&* etc.).'
  return null
}

export default function PassengerRegister() {
  const nav = useNavigate()
  const toast = useToast()
  const auth = useAuth()
  const [form, setForm] = useState({ name:'', email:'', phone:'', gender:'MALE', password:'', confirmPassword:'' })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const sanitizeName = (value) => value.replace(/[^A-Za-z ]/g, '').replace(/\s{2,}/g, ' ').slice(0, NAME_MAX_LENGTH)
  const sanitizePhone = (value) => value.replace(/\D/g, '').slice(0, PHONE_MAX_LENGTH)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      toast.push('Name, Email, Phone and Password are required', 'warn')
      return
    }
    if (!NAME_REGEX.test(form.name.trim())) {
      toast.push('Name should contain letters only', 'warn')
      return
    }
    if (form.phone.length !== PHONE_MAX_LENGTH) {
      toast.push('Phone number must be 10 digits', 'warn')
      return
    }
    if (/^0+$/.test(form.phone) || Number(form.phone) <= 0) {
      toast.push('Phone number cannot be all zeroes or invalid', 'warn')
      return
    }
    const pwdError = validatePassword(form.password)
    if (pwdError) {
      toast.push(pwdError, 'warn')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.push('Password and Confirm Password do not match', 'warn')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: Number(form.phone),
        gender: form.gender || 'MALE',
        password: form.password
      }
      await passengerRegister(payload)
      try {
        const loginRes = await authLogin({ email: form.email.trim(), password: form.password })
        const data = loginRes.data || {}
        auth.setLoggedIn(data)
        if (data.role === 'PASSENGER') {
          toast.push('Account created. You are now logged in.', 'success')
        } else {
          toast.push('Registered', 'success')
        }
      } catch (_) {
        toast.push('Registered. Please log in to continue.', 'success')
      }
      nav('/')
    } catch (err) {
      toast.push(parseApiError(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  const IconPerson = () => (
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
  const IconPhone = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
  const IconLock = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )

  return (
    <section className="register-page" aria-label="Passenger registration">
      <div className="register-card card">
        <div className="register-head">
          <div className="register-head-circle">
            <IconPerson />
          </div>
        </div>
        <h2 className="register-title">Register Account</h2>
        <p className="register-subtitle muted">Create your SwiftBus account to book seats and manage your trips.</p>

        <form onSubmit={submit} className="register-form">
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconPerson /></span>
            <input
              id="reg-name"
              value={form.name}
              maxLength={NAME_MAX_LENGTH}
              onChange={e=>set('name', sanitizeName(e.target.value))}
              placeholder="Your Name"
              required
            />
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconPhone /></span>
            <input
              id="reg-phone"
              value={form.phone}
              maxLength={PHONE_MAX_LENGTH}
              inputMode="numeric"
              onChange={e=>set('phone', sanitizePhone(e.target.value))}
              placeholder="10-digit Phone"
              required
            />
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconPerson /></span>
            <select
              id="reg-gender"
              value={form.gender}
              onChange={e=>set('gender', e.target.value)}
              aria-label="Gender"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconEnvelope /></span>
            <input id="reg-email" type="email" value={form.email} onChange={e=>set('email', e.target.value)} placeholder="Your Email" required />
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconLock /></span>
            <input id="reg-password" type="password" value={form.password} onChange={e=>set('password', e.target.value)} placeholder="Password" minLength={PASSWORD_MIN_LENGTH} />
          </div>
          <div className="register-input-wrap">
            <span className="register-input-icon" aria-hidden="true"><IconLock /></span>
            <input id="reg-confirm" type="password" value={form.confirmPassword} onChange={e=>set('confirmPassword', e.target.value)} placeholder="Confirm Password" minLength={PASSWORD_MIN_LENGTH} />
          </div>
          {/* <p className="register-password-hint register-field-full muted">Min 8 characters, upper &amp; lower case, one number and one special character.</p> */}

          <div className="register-actions">
            <button type="submit" className="register-btn" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
          </div>
        </form>
      </div>
    </section>
  )
}
