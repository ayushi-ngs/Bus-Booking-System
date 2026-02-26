import React, { createContext, useContext, useMemo, useState } from 'react'
import { authLogout } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from './ToastContext'

const AuthCtx = createContext(null)

const LS_KEY = 'bus_auth_state_v1'

function safeLoad() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function save(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state))
}

export function AuthProvider({ children }) {
  const toast = useToast()
  const [state, setState] = useState(() => safeLoad() || { role: 'GUEST', passenger: null })

  const api = useMemo(() => ({
    role: state.role,
    passenger: state.passenger,

    /**
     * Save auth state from backend /api/auth/login response.
     * Expected shape:
     *  { role: 'ADMIN', passenger: null }
     *  { role: 'PASSENGER', passenger: { id,name,email,phone } }
     */
    setLoggedIn: (payload) => {
      const role = payload?.role
      const passenger = payload?.passenger || null
      const next = {
        role: role === 'ADMIN' || role === 'PASSENGER' ? role : 'GUEST',
        passenger: role === 'PASSENGER' ? passenger : null
      }
      setState(next); save(next)
    },

    clearAuth: () => {
      const next = { role: 'GUEST', passenger: null }
      setState(next); save(next)
    },

    logout: async () => {
      try {
        if (state.role !== 'GUEST') await authLogout()
      } catch (e) {
        // even if backend fails, clear local state
        toast.push(parseApiError(e), 'warn')
      } finally {
        const next = { role: 'GUEST', passenger: null }
        setState(next); save(next)
        toast.push('Logged out', 'success')
      }
    }
  }), [state, toast])

  return <AuthCtx.Provider value={api}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}