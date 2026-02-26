import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import PassengerRegister from './pages/PassengerRegister.jsx'
import SearchRoutes from './pages/SearchRoutes.jsx'
import BookSeats from './pages/BookSeats.jsx'
import MyBookings from './pages/MyBookings.jsx'
import MyTicket from './pages/MyTicket.jsx'
import Profile from './pages/Profile.jsx'
import AdminShell from './components/AdminShell.jsx'
import AdminStatistics from './pages/AdminStatistics.jsx'
import AdminBookings from './pages/AdminBookings.jsx'
import AdminAddRoute from './pages/AdminAddRoute.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useAuth } from './state/AuthContext'

export default function App() {
  const auth = useAuth()
  const location = useLocation()
  const isAdminScreen = /^\/admin(\/|$)/.test(location.pathname)

  const appRoutes = (
    <Routes>
      <Route path="/" element={auth.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<PassengerRegister />} />
      <Route path="/search" element={<SearchRoutes />} />
      <Route path="/book/:routeId" element={<ProtectedRoute allow={['PASSENGER']}><BookSeats /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute allow={['PASSENGER']}><MyBookings /></ProtectedRoute>} />
      <Route path="/my-ticket" element={<ProtectedRoute allow={['PASSENGER']}><MyTicket /></ProtectedRoute>} />
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />
      <Route path="/profile" element={<ProtectedRoute allow={['PASSENGER', 'ADMIN']}><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allow={['ADMIN']}><AdminShell /></ProtectedRoute>}>
        <Route index element={<AdminStatistics />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="add-route" element={<AdminAddRoute />} />
      </Route>
      <Route path="*" element={auth.role === 'ADMIN' ? <Navigate to="/admin" replace /> : <Home />} />
    </Routes>
  )

  return (
    <>
      {!isAdminScreen ? (
        <div className="app-layout">
          <NavBar />
          <div className="container container-main">
            {appRoutes}
          </div>
          <Footer />
        </div>
      ) : (
        <div className="container admin-container">
          {appRoutes}
        </div>
      )}
    </>
  )
}