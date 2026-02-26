import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useTheme } from '../state/ThemeContext'
import logo from '../assets/logo.png'

export default function NavBar() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const menuRef = useRef(null)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  const profileInitial = auth.role === 'PASSENGER'
    ? (auth.passenger?.name || 'P').charAt(0).toUpperCase()
    : auth.role === 'ADMIN'
      ? 'A'
      : null

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) && !e.target.closest('.hamburger-btn')) {
        setMenuOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(e.target) && !e.target.closest('.profile-trigger')) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const goTo = (path) => {
    setMenuOpen(false)
    setProfileOpen(false)
    navigate(path)
  }

  return (
    <div className="nav">
      <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <img src={logo} alt="SwiftBus Logo" className="brand-logo-img" />
        <span className="brand-name">SwiftBus</span>
      </NavLink>

      <div className={`navlinks ${menuOpen ? 'open' : ''}`} ref={menuRef}>
        {auth.role !== 'ADMIN' && (
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Home</NavLink>
        )}

        {auth.role !== 'ADMIN' && (
          <NavLink to="/search" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Search</NavLink>
        )}

        {auth.role === 'PASSENGER' && (
          <NavLink to="/my-bookings" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
        )}

        {auth.role === 'ADMIN' && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
        )}

        {auth.role === 'GUEST' && (
          <>
            <NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Register</NavLink>
            <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>Login</NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        <button
          type="button"
          className="hamburger-btn"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>

        {auth.role === 'PASSENGER' && profileInitial && (
          <div className="profile-dropdown" ref={profileRef}>
            <button
              type="button"
              className="profile-trigger"
              onClick={() => setProfileOpen(o => !o)}
              aria-label="Profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="true"
            >
              <span className="profile-avatar">{profileInitial}</span>
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <button className="profile-menu-item" onClick={() => goTo('/profile')}>
                  View profile
                </button>
                <button className="profile-menu-item" onClick={() => goTo('/my-bookings')}>
                  View my bookings
                </button>
                <button
                  className="profile-menu-item"
                  onClick={() => { setMenuOpen(false); setProfileOpen(false); auth.logout(); }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  )
}