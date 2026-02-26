import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import logo from '../assets/logo.png'

const features = [
  {
    icon: '🔍',
    title: 'Search Routes',
    desc: 'Find the perfect bus route between any two cities with real-time availability.',
  },
  {
    icon: '💺',
    title: 'Book Seats',
    desc: 'Choose your preferred seats and book them instantly with a seamless flow.',
  },
  {
    icon: '📱',
    title: 'Manage Bookings',
    desc: 'View all your bookings in one place. Cancel anytime with zero hassle.',
  },
  {
    icon: '🛡️',
    title: 'Admin Dashboard',
    desc: 'Manage routes, view statistics, and oversee all bookings from one panel.',
  },
]

export default function Home() {
  const auth = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero">
        <img src={logo} alt="SwiftBus" className="hero-bus" />
        <h1 className="hero-title">Travel Smarter, Book Faster</h1>
        <p className="hero-subtitle">
          Your one-stop platform for searching bus routes, booking seats, and
          managing your journeys — all in one beautiful interface.
        </p>

        {auth.role === 'GUEST' && (
          <div className="hero-actions">
            <button onClick={() => navigate('/login')}>Get Started</button>
          </div>
        )}

        {auth.role === 'PASSENGER' && (
          <div className="hero-actions">
            <Link to="/search"><button>Search Buses</button></Link>
            <Link to="/my-bookings"><button className="secondary">My Bookings</button></Link>
          </div>
        )}

        {auth.role === 'ADMIN' && (
          <div className="hero-actions">
            <Link to="/admin"><button>Open Dashboard</button></Link>
          </div>
        )}
      </section>

      <div className="divider" />

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <h2>Why Choose Us</h2>
        <p className="features-subtitle">
          Everything you need for a smooth bus booking experience
        </p>
        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p className="muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}