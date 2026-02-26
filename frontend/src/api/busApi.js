import { http } from './http'

// Single auth (ADMIN or PASSENGER)
export const authLogin = (payload) => http.post('/auth/login', payload)
export const authLogout = () => http.post('/auth/logout')

// Passenger auth
export const passengerRegister = (payload) => http.post('/passengers/register', payload)

// Passenger features
export const passengerSearchRoutes = (params) => http.get('/passengers/routes/search', { params })
export const passengerBookRoute = (routeId, payload) => http.post(`/passengers/routes/${routeId}/book`, payload)
export const passengerMyBookings = (params) => http.get('/passengers/bookings', { params })
export const passengerCancelBooking = (bookingId) => http.post(`/passengers/bookings/${bookingId}/cancel`)

// Public routes search (same result, no login)
export const publicSearchRoutes = (params) => http.get('/routes/search', { params })

// Admin features
export const adminGetBookings = (params) => http.get('/admin/bookings', { params })
export const adminGetStatistics = () => http.get('/admin/statistics')
export const adminAddRoute = (payload) => http.post('/routes', payload) // RouteController POST /api/routes