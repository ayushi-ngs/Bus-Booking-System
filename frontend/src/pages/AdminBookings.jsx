import React, { useEffect, useMemo, useState } from 'react'
import { adminGetBookings } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

function prettyMoney(v){ return `₹${Number(v || 0).toFixed(2)}` }
const BOOKING_ID_MAX_LENGTH = 36
const PASSENGER_ID_MAX_LENGTH = 10

export default function AdminBookings() {
  const toast = useToast()
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [filters, setFilters] = useState({ bookingId:'', date:'', passengerId:'' })
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const loadBookings = async (overrideFilters) => {
    setLoading(true)
    try {
      const activeFilters = overrideFilters && typeof overrideFilters === 'object' && 'bookingId' in overrideFilters
        ? overrideFilters
        : filters
      const params = {}
      if (activeFilters.bookingId.trim()) params.bookingId = activeFilters.bookingId.trim()
      if (activeFilters.date.trim()) {
        if (activeFilters.date < today) {
          toast.push('Please select today or a future date', 'warn')
          setLoading(false)
          return
        }
        params.date = activeFilters.date.trim()
      }
      if (activeFilters.passengerId.trim()) params.passengerId = Number(activeFilters.passengerId)
      const res = await adminGetBookings(params)
      setBookings(Array.isArray(res.data) ? res.data : [])
      toast.push('Bookings loaded', 'success')
    } catch (e) {
      setBookings([])
      toast.push(parseApiError(e), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBookings() }, []) // eslint-disable-line

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="card admin-panel">
          <h3>Filter Bookings</h3>
          <div className="row admin-filter-row" style={{ alignItems:'end' }}>
            <div className="admin-filter-field">
              <div className="small muted">Booking ID (optional)</div>
              <input
                value={filters.bookingId}
                maxLength={BOOKING_ID_MAX_LENGTH}
                onChange={e=>setFilters(f=>({ ...f, bookingId: e.target.value.slice(0, BOOKING_ID_MAX_LENGTH) }))}
              />
            </div>
            <div className="admin-filter-field" style={{ minWidth: 210 }}>
              <div className="small muted">Date (optional)</div>
              <input type="date" min={today} value={filters.date} onChange={e=>setFilters(f=>({ ...f, date: e.target.value }))} />
            </div>
            <div className="admin-filter-field" style={{ minWidth: 200 }}>
              <div className="small muted">Passenger ID (optional)</div>
              <input
                value={filters.passengerId}
                inputMode="numeric"
                maxLength={PASSENGER_ID_MAX_LENGTH}
                onChange={e=>setFilters(f=>({ ...f, passengerId: e.target.value.replace(/\D/g, '').slice(0, PASSENGER_ID_MAX_LENGTH) }))}
                placeholder="e.g. 1"
              />
            </div>
            <div className="admin-filter-actions">
              <button onClick={() => loadBookings()} disabled={loading}>
                {loading ? 'Loading...' : 'Apply Filters'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  const emptyFilters = { bookingId:'', date:'', passengerId:'' }
                  setFilters(emptyFilters)
                  loadBookings(emptyFilters)
                }}
                disabled={loading}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="hr admin-compact-hr" />

        {bookings.length === 0 ? (
          <div className="muted">{loading ? 'Loading...' : 'No bookings found.'}</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Passenger</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.bookingId}>
                    <td style={{ maxWidth: 260, wordBreak:'break-word' }}>{b.bookingId}</td>
                    <td>{b.passengerId}</td>
                    <td>#{b.routeId} • {b.source} → {b.destination}</td>
                    <td>{b.dateOfJourney}</td>
                    <td>{b.seatNumbers}</td>
                    <td>{prettyMoney(b.totalPrice)}</td>
                    <td>
                      <span className={`badge ${b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
