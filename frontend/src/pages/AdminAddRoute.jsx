import React, { useMemo, useState } from 'react'
import { adminAddRoute } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

const PLACE_MAX_LENGTH = 40
const PLACE_NAME_REGEX = /^[A-Za-z ]+$/
const SEATS_MAX_LENGTH = 3
const PRICE_MAX_LENGTH = 6

function sanitizePlaceName(value) {
  return value.replace(/[^A-Za-z ]/g, '').replace(/\s{2,}/g, ' ').slice(0, PLACE_MAX_LENGTH)
}

function sanitizeNumeric(value, maxLen) {
  return value.replace(/\D/g, '').slice(0, maxLen)
}

function time24To12(time24) {
  if (!time24 || !time24.includes(':')) return { hour: 9, minute: 0, period: 'AM' }
  const [h, m] = time24.split(':').map(Number)
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  const period = h < 12 ? 'AM' : 'PM'
  return { hour: hour12, minute: isNaN(m) ? 0 : Math.min(59, Math.max(0, m)), period }
}

function time12To24(hour12, minute, period) {
  let h = Number(hour12) || 1
  if (period === 'AM') h = h === 12 ? 0 : h
  else h = h === 12 ? 12 : h + 12
  const m = Math.min(59, Math.max(0, Number(minute) || 0))
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export default function AdminAddRoute() {
  const toast = useToast()
  const minDate = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [routeForm, setRouteForm] = useState({
    source: '',
    destination: '',
    departureTime: '09:00',
    arrivalTime: '12:00',
    dateOfJourney: minDate,
    totalSeats: '40',
    price: '500'
  })
  const [loading, setLoading] = useState(false)

  const setR = (k, v) => setRouteForm(f => ({ ...f, [k]: v }))

  const addRoute = async (e) => {
    e.preventDefault()

    if (!routeForm.source.trim() || !routeForm.destination.trim()) {
      toast.push('Source and Destination are required', 'warn')
      return
    }
    if (!PLACE_NAME_REGEX.test(routeForm.source.trim()) || !PLACE_NAME_REGEX.test(routeForm.destination.trim())) {
      toast.push('Source and Destination must contain letters only', 'warn')
      return
    }

    const journeyDate = routeForm.dateOfJourney
    if (!journeyDate || journeyDate < minDate) {
      toast.push('Date of Journey must be today or a future date', 'warn')
      return
    }

    const dep = routeForm.departureTime
    const arr = routeForm.arrivalTime
    if (!dep || !arr) {
      toast.push('Departure and Arrival times are required', 'warn')
      return
    }
    if (dep >= arr) {
      toast.push('Arrival time must be after departure time', 'warn')
      return
    }

    const seats = Number(routeForm.totalSeats)
    const price = Number(routeForm.price)
    if (!seats || seats <= 0) {
      toast.push('Total seats must be greater than 0', 'warn')
      return
    }
    if (!price || price <= 0) {
      toast.push('Price must be greater than 0', 'warn')
      return
    }

    setLoading(true)
    try {
      const payload = {
        source: routeForm.source.trim(),
        destination: routeForm.destination.trim(),
        arrivalTime: routeForm.arrivalTime,
        departureTime: routeForm.departureTime,
        dateOfJourney: routeForm.dateOfJourney,
        totalSeats: seats,
        price
      }
      const res = await adminAddRoute(payload)
      toast.push(typeof res.data === 'string' ? res.data : 'Route added', 'success')
      setRouteForm(f => ({
        ...f,
        source: '',
        destination: '',
        dateOfJourney: minDate,
        totalSeats: '40',
        price: '500'
      }))
    } catch (e2) {
      toast.push(parseApiError(e2), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page admin-add-route-page">
      <div className="admin-add-route-card card">
        {/* <h3>Add New Route</h3>
        <p className="admin-add-route-subtitle muted">Fill in the route details below. All fields are required.</p> */}
        <form onSubmit={addRoute} className="admin-add-route-form">
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Source</label>
            <input
              value={routeForm.source}
              maxLength={PLACE_MAX_LENGTH}
              onChange={e => setR('source', sanitizePlaceName(e.target.value))}
              placeholder="e.g. Ahmedabad"
              required
            />
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Destination</label>
            <input
              value={routeForm.destination}
              maxLength={PLACE_MAX_LENGTH}
              onChange={e => setR('destination', sanitizePlaceName(e.target.value))}
              placeholder="e.g. Surat"
              required
            />
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Date of Journey</label>
            <input
              type="date"
              value={routeForm.dateOfJourney}
              min={minDate}
              onChange={e => setR('dateOfJourney', e.target.value)}
              required
            />
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Total Seats</label>
            <input
              value={routeForm.totalSeats}
              onChange={e => setR('totalSeats', sanitizeNumeric(e.target.value, SEATS_MAX_LENGTH))}
              placeholder="e.g. 40"
              inputMode="numeric"
              maxLength={SEATS_MAX_LENGTH}
              required
            />
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Departure Time</label>
            <div className="admin-time-row">
              <select
                value={time24To12(routeForm.departureTime).hour}
                onChange={e => setR('departureTime', time12To24(Number(e.target.value), time24To12(routeForm.departureTime).minute, time24To12(routeForm.departureTime).period))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="admin-time-sep">:</span>
              <select
                value={time24To12(routeForm.departureTime).minute}
                onChange={e => setR('departureTime', time12To24(time24To12(routeForm.departureTime).hour, Number(e.target.value), time24To12(routeForm.departureTime).period))}
              >
                {Array.from({ length: 60 }, (_, i) => i).map(n => (
                  <option key={n} value={n}>{String(n).padStart(2, '0')}</option>
                ))}
              </select>
              <select
                value={time24To12(routeForm.departureTime).period}
                onChange={e => setR('departureTime', time12To24(time24To12(routeForm.departureTime).hour, time24To12(routeForm.departureTime).minute, e.target.value))}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Arrival Time</label>
            <div className="admin-time-row">
              <select
                value={time24To12(routeForm.arrivalTime).hour}
                onChange={e => setR('arrivalTime', time12To24(Number(e.target.value), time24To12(routeForm.arrivalTime).minute, time24To12(routeForm.arrivalTime).period))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="admin-time-sep">:</span>
              <select
                value={time24To12(routeForm.arrivalTime).minute}
                onChange={e => setR('arrivalTime', time12To24(time24To12(routeForm.arrivalTime).hour, Number(e.target.value), time24To12(routeForm.arrivalTime).period))}
              >
                {Array.from({ length: 60 }, (_, i) => i).map(n => (
                  <option key={n} value={n}>{String(n).padStart(2, '0')}</option>
                ))}
              </select>
              <select
                value={time24To12(routeForm.arrivalTime).period}
                onChange={e => setR('arrivalTime', time12To24(time24To12(routeForm.arrivalTime).hour, time24To12(routeForm.arrivalTime).minute, e.target.value))}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="admin-add-route-field">
            <label className="admin-add-route-label">Price per Seat (₹)</label>
            <input
              value={routeForm.price}
              onChange={e => setR('price', sanitizeNumeric(e.target.value, PRICE_MAX_LENGTH))}
              placeholder="e.g. 500"
              inputMode="numeric"
              maxLength={PRICE_MAX_LENGTH}
              required
            />
          </div>
          <div className="admin-add-route-actions">
            <button type="button" className="secondary" onClick={() => setRouteForm({
              source: '',
              destination: '',
              departureTime: '09:00',
              arrivalTime: '12:00',
              dateOfJourney: minDate,
              totalSeats: '40',
              price: '500'
            })}>
              Clear
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Route'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
