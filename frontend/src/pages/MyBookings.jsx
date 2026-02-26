import React, { useEffect, useState } from 'react'
import { passengerCancelBooking, passengerMyBookings } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

const BOOKING_ID_MAX_LENGTH = 36

export default function MyBookings() {
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState({ bookingId: '' })

  const load = async (override) => {
    setLoading(true)
    try {
      const qq = override ?? q
      const params = {}
      if (qq.bookingId?.trim()) params.bookingId = qq.bookingId.trim()
      const res = await passengerMyBookings(params)
      setItems(Array.isArray(res.data) ? res.data : [])
    } catch (e) {
      setItems([])
      toast.push(parseApiError(e), 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) 

  const cancel = async (bookingId) => {
    if (!confirm(`Cancel booking ${bookingId}?`)) return
    try {
      const res = await passengerCancelBooking(bookingId)
      toast.push(typeof res.data === 'string' ? res.data : 'Cancelled', 'success')
      load(q)
    } catch (e) {
      toast.push(parseApiError(e), 'error')
    }
  }

  return (
    <div className="card">
      <h2>My Bookings</h2>

      <div className="bookings-filter row" style={{ alignItems:'center' }}>
        <label className="bookings-filter-label">
          <span className="bookings-filter-text muted">Search by filter</span>
          <input
            value={q.bookingId}
            maxLength={BOOKING_ID_MAX_LENGTH}
            onChange={e=>setQ({ bookingId: e.target.value.slice(0, BOOKING_ID_MAX_LENGTH) })}
            placeholder="Booking ID (optional)"
          />
        </label>
        <div className="bookings-filter-actions">
          <button type="button" onClick={() => load(q)} disabled={loading}>{loading ? 'Loading...' : 'Search'}</button>
          <button type="button" className="secondary" onClick={() => { setQ({ bookingId: '' }); load({ bookingId: '' }); }}>Clear filter</button>
        </div>
      </div>

      <div className="hr" />

      {items.length === 0 ? (
        <div className="muted">{loading ? 'Loading...' : 'No bookings found.'}</div>
      ) : (
        <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Route</th>
              <th>Date</th>
              <th>Seats</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(b => (
              <tr key={b.bookingId}>
                <td style={{ maxWidth: 260, wordBreak:'break-word' }}>{b.bookingId}</td>
                <td>#{b.routeId} • {b.source} → {b.destination}</td>
                <td>{b.dateOfJourney}</td>
                <td>{b.seatNumbers}</td>
                <td>₹{Number(b.totalPrice).toFixed(2)}</td>
                <td>
                  <span className={`badge ${b.status === 'CANCELLED' ? 'badge-cancelled' : 'badge-confirmed'}`}>
                    {b.status}
                  </span>
                </td>
                <td style={{ textAlign:'right' }}>
                  <button
                    className="danger"
                    disabled={b.status !== 'CONFIRMED'}
                    onClick={() => cancel(b.bookingId)}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  )
}
