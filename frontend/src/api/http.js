import axios from 'axios'

/**
 * Axios instance:
 * - baseURL is same-origin in dev because of Vite proxy (/api -> backend).
 * - withCredentials keeps JSESSIONID session cookies working.
 */
export const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000
})

export function parseApiError(err) {
  if (!err) return 'Unknown error'
  // Spring can return plain string or JSON; axios provides response
  const r = err.response
  if (!r) return err.message || 'Network error'
  const data = r.data
  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.error) return data.error
  return `Request failed (${r.status})`
}
