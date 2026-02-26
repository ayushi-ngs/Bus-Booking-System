import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * Legacy page (kept so old links don’t break).
 * Single login page is now at /login.
 */
export default function AdminLogin() {
  return <Navigate to="/login" replace />
}