import React, { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useTheme } from '../state/ThemeContext'
import AdminFooter from './AdminFooter'

const IconDashboard = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="3" width="18" height="14" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M7 14l3-3 2 2 4-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="7" cy="15" r="0.8" fill="currentColor" />
    <circle cx="10" cy="12" r="0.8" fill="currentColor" />
    <circle cx="12" cy="14" r="0.8" fill="currentColor" />
    <circle cx="16" cy="9" r="0.8" fill="currentColor" />
  </svg>
)

const IconAddRoute = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="3" ry="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v8M8 12h8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const IconBookings = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="5" y="4" width="14" height="16" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

export default function AdminShell() {
  const auth = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pageTitle = location.pathname === '/admin/add-route'
    ? 'Add Route'
    : location.pathname === '/admin/bookings'
      ? 'All Bookings'
      : 'Statistics Overview'

  return (
    <section className="admin-dashboard">
      <div className="admin-layout">
        <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
          <h3>Admin Menu</h3>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => (isActive ? 'admin-side-link active' : 'admin-side-link')}
            onClick={() => setMobileOpen(false)}
          >
            <span className="admin-side-link-icon" aria-hidden="true">
              <IconDashboard />
            </span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/add-route"
            className={({ isActive }) => (isActive ? 'admin-side-link active' : 'admin-side-link')}
            onClick={() => setMobileOpen(false)}
          >
            <span className="admin-side-link-icon" aria-hidden="true">
              <IconAddRoute />
            </span>
            <span>Add Route</span>
          </NavLink>
          <NavLink
            to="/admin/bookings"
            className={({ isActive }) => (isActive ? 'admin-side-link active' : 'admin-side-link')}
            onClick={() => setMobileOpen(false)}
          >
            <span className="admin-side-link-icon" aria-hidden="true">
              <IconBookings />
            </span>
            <span>View All Bookings</span>
          </NavLink>

          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-side-btn secondary"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
            <button
              type="button"
              className="admin-side-btn"
              onClick={async () => {
                setMobileOpen(false)
                await auth.logout()
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="admin-content">
          <div className="admin-shell-header">
            <button
              type="button"
              className="admin-mobile-menu-btn"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close admin sidebar' : 'Open admin sidebar'}
              aria-expanded={mobileOpen}
            >
              ☰
            </button>
            <h2>{pageTitle}</h2>
          </div>
          <div className="hr admin-shell-hr" />
          <Outlet />
          <AdminFooter />
        </main>
      </div>
    </section>
  )
}
