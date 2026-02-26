import React, { useEffect, useState } from 'react'
import { passengerMyBookings } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

export default function MyTicket() {
  const toast = useToast()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await passengerMyBookings({})
        const bookings = Array.isArray(res.data) ? res.data : []
        // Get the most recent confirmed booking
        const confirmed = bookings.filter(b => b.status === 'CONFIRMED')
        if (confirmed.length > 0) {
          setBooking(confirmed[0])
        } else if (bookings.length > 0) {
          setBooking(bookings[0])
        }
      } catch (e) {
        toast.push(parseApiError(e), 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  if (loading) {
    return (
      <div className="card">
        <h2>My Ticket</h2>
        <p className="muted">Loading...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="card">
        <h2>My Ticket</h2>
        <p className="muted">No active bookings found.</p>
      </div>
    )
  }

  return (
    <div className="ticket-page">
      <div className="ticket-card card">
        <div className="ticket-header">
          <h2>Your Ticket</h2>
          <span className={`ticket-status ${booking.status === 'CONFIRMED' ? 'confirmed' : 'cancelled'}`}>
            {booking.status}
          </span>
        </div>

        <div className="ticket-body">
          <div className="ticket-section">
            <div className="ticket-label">Booking ID</div>
            <div className="ticket-value">{booking.bookingId}</div>
          </div>

          <div className="ticket-section">
            <div className="ticket-label">Route</div>
            <div className="ticket-value">{booking.source} → {booking.destination}</div>
          </div>

          <div className="ticket-section">
            <div className="ticket-label">Date of Journey</div>
            <div className="ticket-value">{booking.dateOfJourney}</div>
          </div>

          <div className="ticket-section">
            <div className="ticket-label">Seat Numbers</div>
            <div className="ticket-value">{booking.seatNumbers}</div>
          </div>

          <div className="ticket-section">
            <div className="ticket-label">Total Price</div>
            <div className="ticket-value">₹{Number(booking.totalPrice).toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
