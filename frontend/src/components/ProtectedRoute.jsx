import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function ProtectedRoute({ allow = ['PASSENGER', 'ADMIN'], children }) {
  const auth = useAuth()
  if (!allow.includes(auth.role)) {
    return <Navigate to="/login" replace />
  }
  return children
}