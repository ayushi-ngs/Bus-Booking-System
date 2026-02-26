# Bus Booking System (Frontend + Backend)

A full-stack **Bus Booking System** with a **React + Vite frontend** and **Spring Boot + MySQL backend**. The project supports **single login** for both **Admin** and **Passenger**, route search, seat booking, ticket viewing, booking management, and admin statistics.

---

## Repository Structure (Monorepo)

```text
bus-booking-system/
├── Bus_Booking_System/              # Spring Boot backend (Java + Maven + MySQL)
└── bus-booking-frontend-react/      # React frontend (Vite + Axios + React Router)
```

> ✅ Yes, keeping both frontend and backend in a **single GitHub repository** is a good setup for this project.

---

## Features

### Passenger Features
- **Single login** endpoint (same login form for Admin/Passenger)
- Passenger registration
- Search bus routes (source, destination, date)
- Book seats for a route
- View **My Bookings**
- View **My Ticket**
- Cancel booking
- Profile page

### Admin Features
- Login using admin credentials (via the same login API)
- Admin dashboard
- View booking list with filters (booking ID / date / passenger ID)
- View statistics (booking-related summary)
- Add new bus route

### Technical Features
- **Session-based authentication** (JSESSIONID cookie)
- Vite dev proxy (`/api -> http://localhost:8080`) to avoid CORS issues during local development
- Axios API layer with centralized error parsing
- Protected routes in frontend for `ADMIN` and `PASSENGER`
- MySQL-backed backend with Spring Boot + JPA repositories

---

## Tech Stack

### Frontend (`bus-booking-frontend-react`)
- React 18
- Vite
- React Router DOM
- Axios
- CSS (custom styles)

### Backend (`Bus_Booking_System`)
- Java 8
- Spring Boot 2.7.x
- Spring Web
- Spring Data JPA
- MySQL (mysql-connector-java 8.x)
- Maven

### Database
- MySQL (`bus` database)

---

## Important Notes Before Running

- Backend uses:
  - `server.port = 8080`
  - MySQL database: `bus`
- Frontend dev server runs on:
  - `http://localhost:5173`
- Frontend is configured to proxy `/api` requests to backend (`http://localhost:8080`) using Vite.

### Security Note (Very Important)
If your `application.yml` contains a **hardcoded DB password**, do **not** push it to GitHub.
Use environment variables instead.

Example (`application.yml`):

```yaml
spring:
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/bus}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:}
```

---

## Prerequisites

Make sure you have installed:

- **Java 8** (or compatible version for this backend)
- **Maven**
- **MySQL Server**
- **Node.js** + **npm**

Recommended:
- Git
- IntelliJ IDEA / VS Code

---

## Backend Setup (Spring Boot)

### 1) Go to backend folder

```bash
cd Bus_Booking_System
```

### 2) Configure database
Update `src/main/resources/application.yml` (or env variables) with your MySQL credentials.

Make sure the database exists:

```sql
CREATE DATABASE bus;
```

> The backend config currently uses `ddl-auto: none`, so it expects tables to already exist.
> If your schema is not created yet, create/import the required tables before running.

### 3) Run backend

```bash
mvn spring-boot:run
```

Backend should start on:
- `http://localhost:8080`

---

## Frontend Setup (React + Vite)

### 1) Go to frontend folder

```bash
cd bus-booking-frontend-react
```

### 2) Install dependencies

```bash
npm install
```

### 3) Run frontend

```bash
npm run dev
```

Frontend should start on:
- `http://localhost:5173`

---

## Login Flow (Single Login)

The frontend uses a **single login page** and sends credentials to:

- `POST /api/auth/login`

Backend logic:
1. Checks admin credentials first
2. If not admin, checks passenger credentials
3. Creates session and returns role-based response

Roles used in frontend:
- `ADMIN`
- `PASSENGER`
- `GUEST`

---

## API Overview (High Level)

### Auth
- `POST /api/auth/login` — single login (admin/passenger)
- `POST /api/auth/logout` — logout

### Passenger Auth
- `POST /api/passengers/register` — register passenger

### Public / Route Search
- `GET /api/routes/search` — public search for routes
- `GET /api/passengers/routes/search` — route search (passenger endpoints)

### Passenger Booking
- `POST /api/passengers/routes/{routeId}/book` — book seats on route
- `GET /api/passengers/bookings` — my bookings
- `POST /api/passengers/bookings/{bookingId}/cancel` — cancel booking

### Admin
- `GET /api/admin/bookings` — list/filter bookings
- `GET /api/admin/statistics` — dashboard stats
- `POST /api/routes` — add route (admin only)

---

## Frontend Pages (Major)

### Public / Passenger UI
- Home
- Login
- Passenger Register
- Search Routes
- Book Seats
- My Bookings
- My Ticket
- Profile

### Admin UI
- Admin Dashboard / Statistics
- Admin Bookings
- Admin Add Route

---

## Suggested `.gitignore` Notes (for this Monorepo)

Make sure these are ignored before pushing to GitHub:

- `node_modules/`
- `dist/`
- `target/`
- `.idea/`, `.vscode/`
- `*.log`
- local env files (`.env`, `.env.*`)
- local secrets in backend config

Also ensure **`node_modules`** and **`target`** are not already staged in Git.

---

## Future Improvements (Optional)

- Password hashing (BCrypt)
- Spring Security integration
- JWT authentication (if moving away from session-based auth)
- Seat map UI improvements
- Email/SMS booking confirmation
- Docker setup for backend + frontend + MySQL
- Deployment (Render / Railway / VPS / AWS)
- Test coverage (frontend and backend)

---

## Author

**Aaditya Shah**  
B.Tech CSE | Full-Stack Development | React + Spring Boot

---

## License

This project is for learning / academic / portfolio use.

