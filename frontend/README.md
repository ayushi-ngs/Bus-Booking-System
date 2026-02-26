# Bus Booking Platform – React Frontend (for your Spring Boot backend)

This frontend is built by reading your backend controllers and DTOs.
It uses **Spring Session (JSESSIONID cookie)**, so you must run it with the provided **Vite proxy** to avoid CORS and to keep cookies working.

## 1) Run backend
From your backend project:

```bash
mvn spring-boot:run
```

Backend should be on: `http://localhost:8080`

## 2) Run frontend
In this folder:

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Backend endpoints used

### Passenger
- `POST /api/passengers/register`
- `POST /api/passengers/login`
- `POST /api/passengers/logout`
- `GET  /api/routes/search` (public search)
- `POST /api/passengers/routes/{routeId}/book`
- `GET  /api/passengers/bookings`
- `POST /api/passengers/bookings/{bookingId}/cancel`

### Admin
- `POST /api/admin/login` (hardcoded: admin@gmail.com / 12345)
- `POST /api/admin/logout`
- `GET  /api/admin/bookings`
- `GET  /api/admin/statistics`
- `POST /api/routes` (add route)

## Notes
- When you login, backend sets `JSESSIONID` cookie. Because we proxy `/api` in Vite, the cookie is stored and reused automatically.
- If you later deploy, use the same origin (serve React build from Spring Boot) OR configure CORS + credentials on backend.
