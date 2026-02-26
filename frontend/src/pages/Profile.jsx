import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'

export default function Profile() {
  const auth = useAuth()
  const navigate = useNavigate()

  if (auth.role === 'GUEST') {
    return (
      <div className="profile-page">
        <div className="profile-guest card">
          <h2>Profile</h2>
          <p className="muted">Please log in to view your profile.</p>
          <Link to="/login"><button style={{ marginTop: 16 }}>Login</button></Link>
        </div>
      </div>
    )
  }

  const name = auth.role === 'PASSENGER' ? auth.passenger?.name : 'Admin'
  const email = auth.role === 'PASSENGER' ? auth.passenger?.email : 'admin@swiftbus.com'
  const phone = auth.role === 'PASSENGER' ? auth.passenger?.phone : null
  const initial = (name || 'U').charAt(0).toUpperCase()
  const isAdmin = auth.role === 'ADMIN'

  return (
    <div className="profile-page">
      <div className="profile-card card">
        <div className="profile-header">
          <div className="profile-avatar-large">{initial}</div>
          <div className="profile-header-info">
            <h1>{name}</h1>
            <span className="profile-badge">{isAdmin ? 'Administrator' : 'Passenger'}</span>
          </div>
        </div>

        <div className="profile-details">
          <h3>Account Details</h3>
          <div className="profile-detail-row">
            <span className="profile-detail-label">Email</span>
            <span className="profile-detail-value">{email || '—'}</span>
          </div>
          {(phone != null && phone !== '') && (
            <div className="profile-detail-row">
              <span className="profile-detail-label">Phone</span>
              <span className="profile-detail-value">{phone}</span>
            </div>
          )}
          <div className="profile-detail-row">
            <span className="profile-detail-label">Account type</span>
            <span className="profile-detail-value">{isAdmin ? 'Admin' : 'Passenger'}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to={isAdmin ? '/admin' : '/my-bookings'}>
            <button>{isAdmin ? 'Dashboard' : 'My Bookings'}</button>
          </Link>
          <button className="secondary profile-actions-logout" onClick={() => { auth.logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
