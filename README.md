# techNotes — MERN Stack Notes Manager

A full-stack ticket / notes management application built with **MongoDB, Express, React, and Node** (MERN), written end-to-end in **TypeScript**. It replaces a legacy sticky-note system with a role-based web app where employees, managers, and admins can create, assign, and resolve customer tickets.

---

## Features

- Public landing page with company contact info
- Employee login with **JWT access tokens** + httpOnly **refresh-token cookie** (persistent auth, weekly re-login)
- Role-based authorization: `Employee`, `Manager`, `Admin`
- Notes / tickets with auto-incremented ticket numbers, OPEN / COMPLETED status, and assignment to a specific user
- Employees see and edit only their own notes; Managers and Admins see, edit, and delete all notes
- User management (create, edit, deactivate) restricted to Managers and Admins
- Login rate-limiting, CORS allow-list, request logging, centralized error handling
- Responsive UI styled with Tailwind CSS — desktop-first, works on mobile
- Centralized client state with **Redux Toolkit** and data fetching / caching via **RTK Query** (normalized cache, automatic re-fetching, optimistic updates, prefetching for snappy navigation)

---

## Tech Stack

**Client** ([client/](client/))
- React 19 + TypeScript
- Vite
- **Redux Toolkit** — global store, `createSlice` for auth state
- **RTK Query** — API layer for `/users`, `/notes`, and `/auth` with tag-based cache invalidation, polling, and prefetching
- React Router v7
- Tailwind CSS v4
- jwt-decode, FontAwesome, react-spinners

**Server** ([server/](server/))
- Node.js + Express 5 (TypeScript, ESM)
- MongoDB + Mongoose
- `@typegoose/auto-increment` for ticket numbers
- jsonwebtoken, bcrypt, cookie-parser
- cors, express-rate-limit, dotenv
- `tsx` for dev, `tsc` for production build

---

## Project Structure

```
MERN-Technote/
├── client/                    # React + Vite frontend
│   └── src/
│       ├── app/               # Redux store
│       ├── components/        # Layouts, headers, public/welcome pages
│       ├── features/
│       │   ├── auth/          # Login, PersistLogin, RequireAuth
│       │   ├── notes/         # NotesList, Note, NewNote, EditNote
│       │   └── users/         # UsersList, User, NewUserForm, EditUser
│       ├── hooks/             # useAuth, useTitle, ...
│       ├── config/            # roles
│       └── ui/                # Reusable atoms / molecules (Button, Card, ...)
└── server/                    # Express + Mongoose backend
    └── src/
        ├── config/            # dbConnect, corsOptions, allowedOrigins
        ├── controllers/       # auth, user, note controllers
        ├── middlewares/       # logger, errorHandler, verifyJWT, requireRoles, loginLimiter
        ├── models/            # User, Note (Mongoose schemas)
        ├── routes/            # auth, users, notes, root
        └── server.ts          # Entry point
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A MongoDB connection string (Atlas or local)

### 1. Clone & install

```bash
git clone <repo-url>
cd MERN-Technote

# server
cd server
npm install

# client
cd ../client
npm install
```

### 2. Environment variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
ACCESS_TOKEN_SECRET=<random-long-string>
REFRESH_TOKEN_SECRET=<another-random-long-string>
```

Generate secrets quickly:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Run in development

In two terminals:

```bash
# terminal 1 — API on http://localhost:5000
cd server
npm run dev

# terminal 2 — UI on http://localhost:5173
cd client
npm run dev
```

The Vite dev origins `http://localhost:5173` and `http://localhost:5174` are pre-allowed in [server/src/config/allowedOrigins.ts](server/src/config/allowedOrigins.ts).

### 4. Production build

```bash
# server
cd server
npm run build && npm start

# client
cd client
npm run build && npm run preview
```

---

## Running with Docker

The whole stack — frontend (nginx), backend (Node), and MongoDB — can be brought up with a single command using Docker Compose. No local Node, no local Mongo, no Atlas needed.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac) or Docker Engine (Linux)

### 1. Project-root `.env`

Compose substitutes secrets from a `.env` file at the project root (next to `docker-compose.yml`). Create it:

```env
ACCESS_TOKEN_SECRET=<random-long-string>
REFRESH_TOKEN_SECRET=<another-random-long-string>
```

> ⚠️ This file is gitignored. Each environment generates its own secrets.

### 2. Bring up the stack

From the project root:

```bash
docker compose up --build
```

What this does:
- Builds the `api` image from [server/Dockerfile](server/Dockerfile) (multi-stage: TypeScript compile → tiny runtime).
- Builds the `web` image from [client/Dockerfile](client/Dockerfile) (Vite build → nginx serves the static output).
- Pulls `mongo:7` from Docker Hub (first run only).
- Starts all three containers on a private Docker network where they reach each other by service name (`mongo`, `api`, `web`).

Once you see `Connected to MongoDB` and `Server is running on port 5000`, the stack is up.

### 3. Access the app

| URL                          | Service |
| ---------------------------- | ------- |
| http://localhost:8080        | Frontend (nginx) |
| http://localhost:5000        | Backend API |
| mongodb://localhost:27017    | Local Mongo (for Compass / mongosh) |

### 4. Seed an admin user (local Mongo is empty)

User-creation endpoints are role-protected, so you can't register the first admin via the UI. Run the seed script:

```bash
docker compose exec api node dist/scripts/seedAdmin.js admin yourPassword123
```

Then log in at http://localhost:8080 with those credentials.

### 5. Useful Compose commands

```bash
docker compose up                  # start (foreground, logs visible)
docker compose up -d               # start detached (background)
docker compose up -d --build api   # rebuild only one service after a code change
docker compose stop                # stop without deleting containers
docker compose down                # stop AND delete containers (volumes survive)
docker compose down -v             # ⚠️ delete containers AND volumes (data wipe)
docker compose logs -f api         # tail one service's logs
docker compose ps                  # list running services
docker compose exec api sh         # shell into a running container
```

### Architecture

```
┌──────────────────────────────────────────┐
│ Docker Compose private network            │
│                                          │
│  ┌──────────┐    ┌─────────┐   ┌──────┐  │
│  │  web     │    │  api    │   │ mongo│  │
│  │ (nginx)  │    │ (Node)  │   │      │  │
│  │ :80      │    │ :5000   │   │:27017│  │
│  └─────▲────┘    └────▲────┘   └───▲──┘  │
│        │              │ mongodb://mongo  │
└────────┼──────────────┼──────────────────┘
         │              │
   port 8080       port 5000
         │              │
   ┌─────┴──────────────┴─────┐
   │   Browser / Postman      │
   └──────────────────────────┘
```

### Why ports differ

The frontend container internally listens on **port 80** (nginx default) but is mapped to **8080** on the host to avoid clashing with anything else on port 80. The backend listens on **5000** internally and externally. Inter-container traffic uses service hostnames (`mongo`, `api`); browser → container traffic uses the host port mappings.

---

## API Overview

Base URL: `http://localhost:5000`

| Method | Endpoint        | Auth          | Description                                  |
|--------|-----------------|---------------|----------------------------------------------|
| POST   | `/auth`         | public (rate-limited) | Login — returns access token + sets refresh cookie |
| GET    | `/auth/refresh` | refresh cookie | Issues a new access token                   |
| POST   | `/auth/logout`  | public        | Clears refresh cookie                        |
| GET    | `/users`        | any role      | List all users                               |
| POST   | `/users`        | Manager/Admin | Create a user                                |
| PATCH  | `/users`        | Manager/Admin | Update a user (role, active flag, password)  |
| DELETE | `/users`        | Manager/Admin | Delete a user                                |
| GET    | `/notes`        | any role      | List all notes (employees scoped to own)     |
| POST   | `/notes`        | any role      | Create a note                                |
| PATCH  | `/notes`        | any role *    | Update a note (* employees only their own)   |
| DELETE | `/notes`        | Manager/Admin | Delete a note                                |

Access tokens are sent as `Authorization: Bearer <token>`; refresh tokens live in an httpOnly cookie.

---

## Data Models

**User** — [server/src/models/User.ts](server/src/models/User.ts)
- `username` (unique, lowercased), `password` (bcrypt-hashed), `roles` (string[]), `active` (boolean)

**Note** — [server/src/models/Note.ts](server/src/models/Note.ts)
- `user` (ref User), `title`, `text`, `completed`, `ticket` (auto-increment from 500), timestamps

---

## Roles & Authorization

Defined in [client/src/config/roles.ts](client/src/config/roles.ts) and enforced server-side via [requireRoles](server/src/middlewares/requireRoles.ts).

| Role     | View notes | Edit notes | Delete notes | User settings |
|----------|------------|------------|--------------|---------------|
| Employee | own only   | own only   | —            | —             |
| Manager  | all        | all        | yes          | yes           |
| Admin    | all        | all        | yes          | yes           |

---

## Scripts

**Server**
- `npm run dev` — `tsx watch src/server.ts`
- `npm run build` — `tsc`
- `npm start` — `node dist/server.js`
- `npm run seed:admin -- <username> <password>` — seed an admin user (requires `npm run build` first; reads `DATABASE_URI` from `.env`)
- `npm run seed:admin:dev -- <username> <password>` — same, but runs the TypeScript directly via `tsx` (no build step)

**Client**
- `npm run dev` — Vite dev server
- `npm run build` — type-check + production bundle
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

---

## License

ISC
