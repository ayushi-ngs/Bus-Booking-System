import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { publicSearchRoutes } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'
import { useAuth } from '../state/AuthContext'

function prettyTime(t) {
  if (!t) return '-'
  // backend LocalTime usually comes as "HH:MM:SS"
  return String(t).slice(0,5)
}

const PLACE_MAX_LENGTH = 40
const PLACE_NAME_REGEX = /^[A-Za-z ]+$/

export default function SearchRoutes() {
  const toast = useToast()
  const auth = useAuth()
  const nav = useNavigate()
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])
  const minDate = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [q, setQ] = useState({ source:'', destination:'', date: today })
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setQ(s => ({ ...s, [k]: v }))
  const sanitizePlaceName = (value) => {
    const cleaned = value.replace(/[^A-Za-z ]/g, '').replace(/\s{2,}/g, ' ').slice(0, PLACE_MAX_LENGTH)
    return cleaned
  }

  const search = async (e) => {
    e.preventDefault()
    if (!q.source.trim() || !q.destination.trim() || !q.date) {
      toast.push('Source, Destination and Date are required', 'warn')
      return
    }
    if (!PLACE_NAME_REGEX.test(q.source.trim()) || !PLACE_NAME_REGEX.test(q.destination.trim())) {
      toast.push('Source and Destination must contain letters only', 'warn')
      return
    }
    if (q.date < minDate) {
      toast.push('Please select today or a future date for journey', 'warn')
      return
    }
    setLoading(true)
    try {
      const res = await publicSearchRoutes({
        source: q.source.trim(),
        destination: q.destination.trim(),
        date: q.date
      })
      setRoutes(Array.isArray(res.data) ? res.data : [])
      toast.push(`Found ${Array.isArray(res.data) ? res.data.length : 0} route(s)`, 'success')
    } catch (err) {
      setRoutes([])
      toast.push(parseApiError(err), 'error')
    } finally {
      setLoading(false)
    }
  }

  const goBook = (route) => {
    if (auth.role !== 'PASSENGER') {
      toast.push('Please login as passenger to book seats', 'warn')
      nav('/login')
      return
    }
    nav(`/book/${route.routeId}`, { state: { route } })
  }

  return (
    <div className="card search-card">
      <h2>Search Available Buses</h2>

      <form onSubmit={search} className="search-form row" style={{ alignItems:'end' }}>
        <div className="col">
          <div className="small muted">Source</div>
          <input
            value={q.source}
            maxLength={PLACE_MAX_LENGTH}
            onChange={e=>set('source', sanitizePlaceName(e.target.value))}
            placeholder="Ahmedabad"
          />
        </div>
        <div className="col">
          <div className="small muted">Destination</div>
          <input
            value={q.destination}
            maxLength={PLACE_MAX_LENGTH}
            onChange={e=>set('destination', sanitizePlaceName(e.target.value))}
            placeholder="Surat"
          />
        </div>
        <div style={{ minWidth: 210 }}>
          <div className="small muted">Date</div>
          <input type="date" value={q.date} min={minDate} onChange={e=>set('date', e.target.value)} />
        </div>
        <div style={{ minWidth: 160 }}>
          <button type="submit" disabled={loading}>{loading ? 'Searching...' : 'Search'}</button>
        </div>
      </form>

      <div className="hr" />

      {routes.length === 0 ? (
        <div className="muted">No routes to show. Search above.</div>
      ) : (
        <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Route ID</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Depart</th>
              <th>Arrive</th>
              <th>Total</th>
              <th>Available</th>
              <th>Price/Seat</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {routes.map(r => (
              <tr key={r.routeId}>
                <td>{r.routeId}</td>
                <td>{r.source}</td>
                <td>{r.destination}</td>
                <td>{r.dateOfJourney}</td>
                <td>{prettyTime(r.departureTime)}</td>
                <td>{prettyTime(r.arrivalTime)}</td>
                <td>{r.totalSeats}</td>
                <td>{r.availableSeats}</td>
                <td>₹{Number(r.price).toFixed(2)}</td>
                <td style={{ textAlign:'right' }}>
                  <button onClick={() => goBook(r)} disabled={Number(r.availableSeats) <= 0}>
                    {Number(r.availableSeats) <= 0 ? 'Sold out' : 'Book'}
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
