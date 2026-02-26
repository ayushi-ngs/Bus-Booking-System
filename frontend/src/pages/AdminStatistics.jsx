import React, { useEffect, useMemo, useState } from 'react'
import { adminGetBookings, adminGetStatistics } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

function prettyMoney(v){ return `₹${Number(v || 0).toFixed(2)}` }
function dayKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
function monthKey(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }
function dateOnly(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function formatDayLabel(d, mode) {
  if (mode === 'week') return d.toLocaleString(undefined, { weekday: 'short' })
  return d.toLocaleString(undefined, { month: 'short' })
}
function createPath(points) {
  if (!points.length) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
}

const StatIconTotal = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8 9h8M8 12h5M8 15h6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

const StatIconConfirmed = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const StatIconCancelled = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 9l6 6M15 9l-6 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const StatIconRevenue = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="5" width="14" height="14" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 15v-5.5a2.5 2.5 0 0 1 5 0c0 1.4-1.1 2.2-2.5 2.2H11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default function AdminStatistics() {
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allBookings, setAllBookings] = useState([])

  const loadStats = async () => {
    setLoading(true)
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        adminGetStatistics(),
        adminGetBookings({})
      ])
      setStats(statsRes.data)

      const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : []
      setAllBookings(bookings)
    } catch (e) {
      setStats(null)
      setAllBookings([])
      toast.push(parseApiError(e), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats() }, []) // eslint-disable-line

  const totalBookings = Number(stats?.totalBookings || 0)
  const cancelledBookings = Number(stats?.cancelledBookings || 0)
  const confirmedBookings = Math.max(totalBookings - cancelledBookings, 0)
  const cancelPercent = totalBookings ? Math.round((cancelledBookings / totalBookings) * 100) : 0
  const confirmedPercent = totalBookings ? 100 - cancelPercent : 0
  const revenueValue = Number(stats?.revenue || 0)

  const revenueSlices = useMemo(() => {
    let confirmedRevenue = 0
    let cancelledRevenue = 0
    allBookings.forEach((b) => {
      const amount = Number(b?.totalPrice || 0)
      const status = String(b?.status || '').toUpperCase()
      if (status === 'CANCELLED') cancelledRevenue += amount
      else confirmedRevenue += amount
    })
    const total = Math.max(confirmedRevenue + cancelledRevenue, 1)
    const radius = 30
    const circumference = 2 * Math.PI * radius
    const confirmedLen = (confirmedRevenue / total) * circumference
    const cancelledLen = (cancelledRevenue / total) * circumference
    return { confirmedRevenue, cancelledRevenue, total, radius, circumference, confirmedLen, cancelledLen }
  }, [allBookings])

  const statusPie = useMemo(() => {
    const total = Math.max(totalBookings, 1)
    const radius = 30
    const circumference = 2 * Math.PI * radius
    const confirmedLen = (confirmedBookings / total) * circumference
    const cancelledLen = (cancelledBookings / total) * circumference
    return { radius, circumference, confirmedLen, cancelledLen }
  }, [totalBookings, confirmedBookings, cancelledBookings])

  return (
    <div className="admin-page admin-stats-page">
      {loading ? (
        <div className="muted">Loading statistics...</div>
      ) : !stats ? (
        <div className="muted">No stats available.</div>
      ) : (
        <div className="admin-section">
          <div className="admin-stat-cards">
            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-icon" aria-hidden="true"><StatIconTotal /></span>
                <span className="admin-stat-label admin-stat-label-main">Total bookings</span>
              </div>
              <div className="admin-stat-value">{totalBookings}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-icon" aria-hidden="true"><StatIconConfirmed /></span>
                <span className="admin-stat-label admin-stat-label-main">Confirmed</span>
              </div>
              <div className="admin-stat-value">{confirmedBookings}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-icon" aria-hidden="true"><StatIconCancelled /></span>
                <span className="admin-stat-label admin-stat-label-main">Cancelled</span>
              </div>
              <div className="admin-stat-value">{cancelledBookings}</div>
            </div>
            <div className="admin-stat-card">
              <div className="admin-stat-header">
                <span className="admin-stat-icon" aria-hidden="true"><StatIconRevenue /></span>
                <span className="admin-stat-label admin-stat-label-main">Revenue</span>
              </div>
              <div className="admin-stat-value">{prettyMoney(revenueValue)}</div>
            </div>
          </div>

          <div className="admin-visual-grid">
            <div className="card admin-visual-card">
              <h3>Booking Status</h3>
              <div className="admin-health-layout">
                <div>
                  <div className="admin-meter-row">
                    <span>Confirmed ({confirmedPercent}%)</span>
                    <div className="admin-meter-track">
                      <div className="admin-meter-fill ok" style={{ width: `${confirmedPercent}%` }} />
                    </div>
                  </div>
                  <div className="admin-meter-row">
                    <span>Cancelled ({cancelPercent}%)</span>
                    <div className="admin-meter-track">
                      <div className="admin-meter-fill danger" style={{ width: `${cancelPercent}%` }} />
                    </div>
                  </div>
                </div>
                <div className="admin-status-total small muted">Total bookings: {totalBookings}</div>
              </div>
            </div>

            <div className="card admin-visual-card">
              <h3>Revenue Trend</h3>
              <div className="admin-pie-layout">
                <div className="admin-pie-details">
                  <div className="admin-pie-row">
                    <span className="dot ok" />
                    <span>Confirmed revenue:</span>
                    <b>{prettyMoney(revenueSlices.confirmedRevenue)}</b>
                  </div>
                  <div className="admin-pie-row">
                    <span className="dot danger" />
                    <span>Cancelled value:</span>
                    <b>{prettyMoney(revenueSlices.cancelledRevenue)}</b>
                  </div>
                  <div className="admin-pie-row admin-pie-row-total">
                    <span />
                    <span>Total revenue:</span>
                    <b>{prettyMoney(revenueSlices.total)}</b>
                  </div>
                </div>
                <div className="admin-pie-wrap" aria-label="Revenue trend pie chart">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r={revenueSlices.radius} className="admin-pie-bg" />
                    <circle
                      cx="60"
                      cy="60"
                      r={revenueSlices.radius}
                      className="admin-pie-confirmed"
                      strokeDasharray={`${revenueSlices.confirmedLen} ${revenueSlices.circumference}`}
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={revenueSlices.radius}
                      className="admin-pie-cancelled"
                      strokeDasharray={`${revenueSlices.cancelledLen} ${revenueSlices.circumference}`}
                      strokeDashoffset={-revenueSlices.confirmedLen}
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="admin-actions-row">
        <button className="secondary" onClick={loadStats} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Statistics'}
        </button>
      </div>
    </div>
  )
}
