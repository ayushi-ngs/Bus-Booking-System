import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { passengerBookRoute } from '../api/busApi'
import { parseApiError } from '../api/http'
import { useToast } from '../state/ToastContext'

function prettyTime(t) {
  if (!t) return '-'
  return String(t).slice(0,5)
}

const emptyPassenger = () => ({ name:'', age:'', gender:'MALE' })

function sanitizeName(value) {
  return value.replace(/[^A-Za-z ]/g, '').replace(/\s{2,}/g, ' ').trimStart()
}

function sanitizeAge(value) {
  return value.replace(/\D/g, '').slice(0, 2)
}

export default function BookSeats() {
  const { routeId } = useParams()
  const { state } = useLocation()
  const nav = useNavigate()
  const toast = useToast()

  const route = state?.route || null

  const [passengers, setPassengers] = useState([emptyPassenger()])
  const [loading, setLoading] = useState(false)

  const maxSeats = useMemo(() => {
    const a = route?.availableSeats
    return typeof a === 'number' ? a : Number(a || 0)
  }, [route])

  const addRow = () => {
    if (route && passengers.length >= maxSeats) {
      toast.push(`Only ${maxSeats} seat(s) available`, 'warn')
      return
    }
    setPassengers(p => [...p, emptyPassenger()])
  }

  const removeRow = (idx) => {
    setPassengers(p => p.filter((_, i) => i !== idx))
  }

  const setP = (idx, k, v) => {
    setPassengers(p => p.map((x, i) => i === idx ? ({ ...x, [k]: v }) : x))
  }

  const validate = () => {
    if (passengers.length <= 0) return 'Add at least 1 passenger'
    for (let i=0;i<passengers.length;i++){
      const p = passengers[i]
      if (!p.name.trim()) return `Passenger ${i+1}: name required`
      const age = Number(p.age)
      if (!age || age <= 0) return `Passenger ${i+1}: valid age required`
      if (!p.gender) return `Passenger ${i+1}: gender required`
    }
    return null
  }

  const submit = async () => {
    const err = validate()
    if (err) { toast.push(err, 'warn'); return }
    setLoading(true)
    try {
      const payload = {
        passengers: passengers.map(p => ({ name: p.name.trim(), age: Number(p.age), gender: p.gender }))
      }
      const res = await passengerBookRoute(routeId, payload)
      toast.push(`Booked! Booking ID: ${res.data.bookingId}`, 'success')
      nav('/my-bookings')
    } catch (e) {
      toast.push(parseApiError(e), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h2>Book Seats</h2>

      {!route ? (
        <div className="card" style={{ marginTop: 10 }}>
          <b>Route details not found.</b>
          <div className="muted small">Go back to Search and click Book again so the route can be passed to this page.</div>
          <div style={{ marginTop: 12 }}>
            <button className="secondary" onClick={() => nav('/search')}>Back to Search</button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <button type="button" onClick={addRow}>+ Add Passenger</button>
            <button type="button" className="secondary" onClick={() => setPassengers([emptyPassenger()])}>Reset</button>
          </div>
          <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th style={{ width:120 }}>Age</th>
                <th style={{ width:160 }}>Gender</th>
                <th style={{ width:120 }}></th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((p, idx) => (
                <tr key={idx}>
                  <td>{idx+1}</td>
                  <td>
                    <input
                      value={p.name}
                      onChange={e=>setP(idx,'name', sanitizeName(e.target.value))}
                      placeholder="Passenger name"
                      style={{ width:'100%' }}
                      maxLength={50}
                    />
                  </td>
                  <td>
                    <input
                      value={p.age}
                      onChange={e=>setP(idx,'age', sanitizeAge(e.target.value))}
                      placeholder="Age"
                      inputMode="numeric"
                      maxLength={2}
                    />
                  </td>
                  <td>
                    <select value={p.gender} onChange={e=>setP(idx,'gender',e.target.value)}>
                      <option value="MALE">MALE</option>
                      <option value="FEMALE">FEMALE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </td>
                  <td style={{ textAlign:'right' }}>
                    <button className="danger" type="button" onClick={() => removeRow(idx)} disabled={passengers.length === 1}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div className="book-seats-footer" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12, flexWrap:'wrap', gap:10 }}>
            <div className="muted small">
              Total seats: <b>{passengers.length}</b> | Total: <b>₹{(Number(route.price) * passengers.length).toFixed(2)}</b>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="secondary" onClick={() => nav('/search')}>Back</button>
              <button onClick={submit} disabled={loading}>{loading ? 'Booking...' : 'Confirm Booking'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
