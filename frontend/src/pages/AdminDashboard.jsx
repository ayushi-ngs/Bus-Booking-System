import React, { useEffect, useMemo, useState } from 'react'
import { adminAddRoute, adminGetBookings, adminGetStatistics } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

function prettyMoney(v){ return `₹${Number(v || 0).toFixed(2)}` }
const PLACE_MAX_LENGTH = 40
const PLACE_NAME_REGEX = /^[A-Za-z ]+$/

export default function AdminDashboard() {
  const toast = useToast()
  const minDate = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [tab, setTab] = useState('dashboard') // dashboard | stats | bookings | addRoute

  // stats
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  // bookings
  const [filters, setFilters] = useState({ bookingId:'', date:'', passengerId:'' })
  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)

  // add route
  const [routeForm, setRouteForm] = useState({
    source:'',
    destination:'',
    departureTime:'09:00',
    arrivalTime:'12:00',
    dateOfJourney: minDate,
    totalSeats:'40',
    price:'500'
  })
  const [routeLoading, setRouteLoading] = useState(false)

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const res = await adminGetStatistics()
      setStats(res.data)
    } catch (e) {
      setStats(null)
      toast.push(parseApiError(e), 'error')
    } finally {
      setStatsLoading(false)
    }
  }

  const loadBookings = async () => {
    setBookingsLoading(true)
    try {
      const params = {}
      if (filters.bookingId.trim()) params.bookingId = filters.bookingId.trim()
      if (filters.date.trim()) params.date = filters.date.trim()
      if (filters.passengerId.trim()) params.passengerId = Number(filters.passengerId)
      const res = await adminGetBookings(params)
      setBookings(Array.isArray(res.data) ? res.data : [])
      toast.push('Bookings loaded', 'success')
    } catch (e) {
      setBookings([])
      toast.push(parseApiError(e), 'error')
    } finally {
      setBookingsLoading(false)
    }
  }

  useEffect(() => { loadStats() }, []) // eslint-disable-line

  const setR = (k, v) => setRouteForm(f => ({ ...f, [k]: v }))
  const sanitizePlaceName = (value) => value.replace(/[^A-Za-z ]/g, '').replace(/\s{2,}/g, ' ').slice(0, PLACE_MAX_LENGTH)

  const addRoute = async (e) => {
    e.preventDefault()
    if (!routeForm.source.trim() || !routeForm.destination.trim()) {
      toast.push('Source and Destination required', 'warn')
      return
    }
    if (!PLACE_NAME_REGEX.test(routeForm.source.trim()) || !PLACE_NAME_REGEX.test(routeForm.destination.trim())) {
      toast.push('Source and Destination must contain letters only', 'warn')
      return
    }
    setRouteLoading(true)
    try {
      const payload = {
        source: routeForm.source.trim(),
        destination: routeForm.destination.trim(),
        arrivalTime: routeForm.arrivalTime,
        departureTime: routeForm.departureTime,
        dateOfJourney: routeForm.dateOfJourney,
        totalSeats: Number(routeForm.totalSeats),
        price: Number(routeForm.price)
      }
      const res = await adminAddRoute(payload)
      toast.push(typeof res.data === 'string' ? res.data : 'Route added', 'success')
      // refresh stats (not required but useful)
      loadStats()
      setTab('bookings')
    } catch (e2) {
      toast.push(parseApiError(e2), 'error')
    } finally {
      setRouteLoading(false)
    }
  }

  const totalBookings = Number(stats?.totalBookings || 0)
  const cancelledBookings = Number(stats?.cancelledBookings || 0)
  const confirmedBookings = Math.max(totalBookings - cancelledBookings, 0)
  const cancelPercent = totalBookings ? Math.round((cancelledBookings / totalBookings) * 100) : 0
  const confirmedPercent = totalBookings ? 100 - cancelPercent : 0
  const revenueValue = Number(stats?.revenue || 0)
  const revenueBarPercent = Math.min(100, Math.round((revenueValue / 100000) * 100))
  const sectionTitle = tab === 'addRoute'
    ? 'Add Route'
    : tab === 'bookings'
      ? 'View All Bookings'
      : tab === 'stats'
        ? 'View Statistics'
        : 'Dashboard Overview'
  const sectionSubtitle = tab === 'addRoute'
    ? 'Create route with journey date, seat count and pricing.'
    : tab === 'bookings'
      ? 'Search and review all passenger bookings.'
      : tab === 'stats'
        ? 'Detailed statistics and health indicators.'
        : 'Track bookings, monitor revenue and manage routes in one place.'

  const goSection = (nextTab) => {
    setTab(nextTab)
    if (nextTab === 'bookings') loadBookings()
    if (nextTab === 'dashboard' || nextTab === 'stats') loadStats()
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <h3>Admin Menu</h3>
          <button className={tab === 'dashboard' ? 'admin-side-btn active' : 'admin-side-btn'} onClick={() => goSection('dashboard')}>Dashboard</button>
          <button className={tab === 'addRoute' ? 'admin-side-btn active' : 'admin-side-btn'} onClick={() => goSection('addRoute')}>Add Route</button>
          <button className={tab === 'stats' ? 'admin-side-btn active' : 'admin-side-btn'} onClick={() => goSection('stats')}>View Statistics</button>
          <button className={tab === 'bookings' ? 'admin-side-btn active' : 'admin-side-btn'} onClick={() => goSection('bookings')}>View All Bookings</button>
        </aside>

        <div className="admin-content">
          <div className="admin-header">
            <div>
              <h2>{sectionTitle}</h2>
              <p className="muted">{sectionSubtitle}</p>
            </div>
          </div>

          <div className="hr" />

          {(tab === 'dashboard' || tab === 'stats') && (
            <div className="admin-section">
              {statsLoading ? (
                <div className="muted">Loading dashboard metrics...</div>
              ) : !stats ? (
                <div className="muted">No stats available.</div>
              ) : (
                <>
                  <div className="admin-stat-cards">
                    <div className="admin-stat-card">
                      {/* <div className="admin-stat-icon">🧾</div> */}
                      <div className="admin-stat-label">Total bookings</div>
                      <div className="admin-stat-value">{totalBookings}</div>
                    </div>
                    <div className="admin-stat-card">
                      {/* <div className="admin-stat-icon">✅</div> */}
                      <div className="admin-stat-label">Confirmed</div>
                      <div className="admin-stat-value">{confirmedBookings}</div>
                    </div>
                    <div className="admin-stat-card">
                      {/* <div className="admin-stat-icon">❌</div> */}
                      <div className="admin-stat-label">Cancelled</div>
                      <div className="admin-stat-value">{cancelledBookings}</div>
                    </div>
                    <div className="admin-stat-card">
                      {/* <div className="admin-stat-icon">💰</div> */}
                      <div className="admin-stat-label">Revenue</div>
                      <div className="admin-stat-value">{prettyMoney(revenueValue)}</div>
                    </div>
                  </div>

                  <div className="admin-visual-grid">
                    <div className="card admin-visual-card">
                      <h3>Booking Health</h3>
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

                    <div className="card admin-visual-card">
                      <h3>Revenue Trend View</h3>
                      <div className="admin-revenue-wrap">
                        <div className="admin-revenue-amount">{prettyMoney(revenueValue)}</div>
                        <div className="admin-meter-track">
                          <div className="admin-meter-fill revenue" style={{ width: `${revenueBarPercent}%` }} />
                        </div>
                        <div className="small muted">Scale shown against ₹100000 for quick comparison.</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="admin-actions-row">
                <button className="secondary" onClick={loadStats} disabled={statsLoading}>
                  {statsLoading ? 'Refreshing...' : 'Refresh Statistics'}
                </button>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div className="admin-section">
              <div className="card admin-panel">
                <h3>Filter Bookings</h3>
                <div className="row" style={{ alignItems:'end' }}>
                  <div className="col">
                    <div className="small muted">Booking ID (optional)</div>
                    <input value={filters.bookingId} onChange={e=>setFilters(f=>({ ...f, bookingId: e.target.value }))} />
                  </div>
                  <div style={{ minWidth: 210 }}>
                    <div className="small muted">Date (optional)</div>
                    <input type="date" value={filters.date} onChange={e=>setFilters(f=>({ ...f, date: e.target.value }))} />
                  </div>
                  <div style={{ minWidth: 200 }}>
                    <div className="small muted">Passenger ID (optional)</div>
                    <input value={filters.passengerId} onChange={e=>setFilters(f=>({ ...f, passengerId: e.target.value }))} placeholder="e.g. 1" />
                  </div>
                  <div style={{ minWidth: 160 }}>
                    <button onClick={loadBookings} disabled={bookingsLoading}>
                      {bookingsLoading ? 'Loading...' : 'Apply Filters'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="hr" />

              {bookings.length === 0 ? (
                <div className="muted">{bookingsLoading ? 'Loading...' : 'No bookings found.'}</div>
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
          )}

          {tab === 'addRoute' && (
            <div className="row admin-section">
              <div className="col card">
                <h3>🚌 Add New Route</h3>
                <p className="muted small">Create route with journey date, seat count and pricing.</p>

                <form onSubmit={addRoute} className="grid2">
                  <div>
                    <div className="small muted">Source</div>
                    <input
                      value={routeForm.source}
                      maxLength={PLACE_MAX_LENGTH}
                      onChange={e=>setR('source', sanitizePlaceName(e.target.value))}
                      placeholder="Ahmedabad"
                    />
                  </div>
                  <div>
                    <div className="small muted">Destination</div>
                    <input
                      value={routeForm.destination}
                      maxLength={PLACE_MAX_LENGTH}
                      onChange={e=>setR('destination', sanitizePlaceName(e.target.value))}
                      placeholder="Surat"
                    />
                  </div>
                  <div>
                    <div className="small muted">Date of Journey</div>
                    <input type="date" value={routeForm.dateOfJourney} min={minDate} onChange={e=>setR('dateOfJourney', e.target.value)} />
                  </div>
                  <div>
                    <div className="small muted">Total Seats</div>
                    <input value={routeForm.totalSeats} onChange={e=>setR('totalSeats', e.target.value)} />
                  </div>
                  <div>
                    <div className="small muted">Departure Time</div>
                    <input type="time" value={routeForm.departureTime} onChange={e=>setR('departureTime', e.target.value)} />
                  </div>
                  <div>
                    <div className="small muted">Arrival Time</div>
                    <input type="time" value={routeForm.arrivalTime} onChange={e=>setR('arrivalTime', e.target.value)} />
                  </div>
                  <div>
                    <div className="small muted">Price per Seat</div>
                    <input value={routeForm.price} onChange={e=>setR('price', e.target.value)} />
                  </div>

                  <div style={{ gridColumn:'1/-1', display:'flex', justifyContent:'flex-end', gap:10, marginTop: 6 }}>
                    <button type="button" className="secondary" onClick={() => setRouteForm(f=>({ ...f, source:'', destination:'' }))}>Clear</button>
                    <button type="submit" disabled={routeLoading}>{routeLoading ? 'Saving...' : 'Add Route'}</button>
                  </div>
                </form>
              </div>

              <div className="col card">
                <h3>🧩 Payload Preview</h3>
                <div className="muted small">
                  <pre style={{ whiteSpace:'pre-wrap' }}>{`{
  "source": "Ahmedabad",
  "destination": "Surat",
  "arrivalTime": "12:00",
  "departureTime": "09:00",
  "dateOfJourney": "2026-02-18",
  "totalSeats": 40,
  "price": 500
}`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
