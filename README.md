![CI](https://github.com/ihanmx/MERN-techNotes-website/actions/workflows/ci.yml/badge.svg)

# techNotes — MERN Stack Notes Manager

A full-stack ticket / notes management application built with **MongoDB, Express, React, and Node** (MERN), written end-to-end in **TypeScript**. It replaces a legacy sticky-note system with a role-based web app where employees, managers, and admins can create, assign, and resolve customer tickets.

The application is also a hands-on exploration of modern deployment — it ships through **three different production pipelines** (PaaS, Docker, self-hosted VPS), wired together by **GitHub Actions CI/CD**, and polished with production-grade observability, security, and monitoring.

---

## 🚀 Live deployments

| Layer     | URL                                                   | Hosted on        |
| --------- | ----------------------------------------------------- | ---------------- |
| Frontend  | https://technoteshanan.netlify.app                    | Netlify          |
| Backend   | https://mern-technotes-website.onrender.com           | Render           |
| Database  | (Atlas-managed)                                       | MongoDB Atlas    |
| Mirror    | http://178.105.138.179                                | Hetzner VPS      |

Every push to `main` automatically lints, builds, and deploys to all three production targets in parallel.

---

## ✨ Highlights

### Application

- Public landing page with company contact info
- Employee login with **JWT access tokens** + httpOnly **refresh-token cookie** (persistent auth, weekly re-login)
- Role-based authorization: `Employee`, `Manager`, `Admin`
- Notes / tickets with auto-incremented ticket numbers, OPEN / COMPLETED status, and assignment to a specific user
- Employees see and edit only their own notes; Managers and Admins see, edit, and delete all notes
- User management (create, edit, deactivate) restricted to Managers and Admins
- Responsive UI styled with Tailwind CSS — desktop-first, works on mobile
- Centralized client state with **Redux Toolkit** and data fetching / caching via **RTK Query** (normalized cache, automatic re-fetching, optimistic updates, prefetching)

### DevOps & production posture

- **Multi-target CI/CD** via GitHub Actions: lint → build → parallel deploy to Netlify, Render, and a self-hosted Hetzner VPS via SSH
- **Multi-stage Docker images** for backend (Node) and frontend (nginx-served Vite build), plus a `docker-compose.yml` that orchestrates the full stack with a persistent MongoDB volume
- **nginx as a reverse proxy** on the VPS, fronting `pm2`-managed Node with zero-downtime reloads and systemd boot persistence
- **Branch protection on `main`** — no PR merges without green CI; every PR gets a **Netlify deploy preview** URL
- **Helmet** security headers (A-grade on securityheaders.com)
- **Secure cross-origin cookies** — `httpOnly` + `secure` + `sameSite: "none"` for Netlify ↔ Render auth
- **Sentry** for production error tracking with full stack traces and request context
- **Structured JSON logging** with `pino` + `pino-http`, redacting sensitive fields, pino-pretty in dev
- **`/health` endpoint** + **UptimeRobot** monitoring (also keeps Render free tier from sleeping)
- **Dedicated SSH deploy key** stored as a GitHub secret — principle of least privilege for CI deploys

---

## 🏗 Architecture

### Production pipeline

```
                        ┌─────────────────┐
                        │  GitHub repo    │
                        │  push to main   │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  CI: lint+build │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
   ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
   │   Netlify CLI  │ │  Render deploy │ │ appleboy/ssh   │
   │   netlify CLI  │ │      hook      │ │   on VPS       │
   └────────┬───────┘ └────────┬───────┘ └────────┬───────┘
            │                  │                  │
            ▼                  ▼                  ▼
       Netlify CDN         Render Web         Hetzner VPS
       (frontend)          Service             (nginx +
                           (backend)           pm2 + Node)
                                                 │
                                                 │ (also)
                                                 ▼
                                          MongoDB Atlas
```

### Runtime (Phase-1 production)

```
        ┌───────────────┐
Browser │  Netlify CDN  │  ◄── static React build (Vite dist/)
        │   (frontend)  │
        └──────┬────────┘
               │ fetch /auth, /users, /notes
               │ Authorization: Bearer + refresh cookie
               ▼
        ┌───────────────┐
        │     Render    │  ◄── Node + Express + Mongoose
        │   (backend)   │       Helmet • pino • Sentry • /health
        └──────┬────────┘
               │ mongodb+srv://
               ▼
        ┌───────────────┐
        │ MongoDB Atlas │  ◄── managed M0 cluster
        └───────────────┘
```

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
- MongoDB + Mongoose, `@typegoose/auto-increment` for ticket numbers
- jsonwebtoken, bcrypt, cookie-parser
- cors, express-rate-limit, dotenv
- **helmet** — HTTP security headers
- **pino + pino-http + pino-pretty** — structured JSON logging
- **@sentry/node** — error tracking
- `tsx` for dev (with `--import` Sentry pre-instrumentation), `tsc` for production build

**Infrastructure** ([Dockerfile](server/Dockerfile), [docker-compose.yml](docker-compose.yml), [.github/workflows/ci.yml](.github/workflows/ci.yml))

- Docker multi-stage builds (Node runtime ~150 MB)
- nginx (static-serve in containerized frontend; reverse-proxy on VPS)
- docker-compose (api + web + mongo with persistent volume)
- GitHub Actions CI/CD (lint, build, Netlify CLI, Render deploy hook, `appleboy/ssh-action`)
- pm2 process management on the VPS
- UptimeRobot for external monitoring

---

## Project Structure

```
MERN-Technote/
├── .github/
│   └── workflows/
│       └── ci.yml             # lint + build + 3-target deploy
├── client/                    # React + Vite frontend
│   ├── public/
│   │   └── _redirects         # Netlify SPA fallback
│   ├── Dockerfile             # Vite build → nginx serve
│   ├── nginx.conf             # SPA-friendly nginx config
│   └── src/
│       ├── app/               # Redux store
│       ├── components/        # Layouts, headers, public/welcome pages
│       ├── features/
│       │   ├── auth/          # Login, PersistLogin, RequireAuth
│       │   ├── notes/         # NotesList, Note, NewNote, EditNote
│       │   └── users/         # UsersList, User, NewUserForm, EditUser
│       ├── hooks/             # useAuth, useTitle, ...
│       ├── config/            # roles
│       └── ui/                # Reusable atoms / molecules
├── server/                    # Express + Mongoose backend
│   ├── Dockerfile             # multi-stage: build → tiny runtime
│   └── src/
│       ├── config/            # dbConnect, corsOptions, allowedOrigins
│       ├── controllers/       # auth, user, note controllers
│       ├── lib/               # logger (pino)
│       ├── middlewares/       # errorHandler, verifyJWT, requireRoles, loginLimiter
│       ├── models/            # User, Note (Mongoose schemas)
│       ├── routes/            # auth, users, notes, root (with /health)
│       ├── scripts/           # seedAdmin
│       ├── instrument.ts      # Sentry init (loaded via --import)
│       └── server.ts          # Entry point
├── docs/
│   ├── DEPLOYMENT_GUIDE.md    # full 5-phase walkthrough
│   └── DOCKER_GUIDE.md        # focused Docker reference
└── docker-compose.yml         # api + web + mongo
```

---

## Getting Started (local dev)

### Prerequisites

- Node.js 22+
- A MongoDB connection string (Atlas or local)

### 1. Clone & install

```bash
git clone https://github.com/ihanmx/MERN-techNotes-website.git
cd MERN-techNotes-website

# server
cd server
npm ci

# client
cd ../client
npm ci
```

### 2. Environment variables

Create `server/.env`:

```env
NODE_ENV=development
PORT=5000
DATABASE_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>
ACCESS_TOKEN_SECRET=<random-long-string>
REFRESH_TOKEN_SECRET=<another-random-long-string>
SENTRY_DSN=                          # optional in dev; leave empty to disable Sentry
```

Generate secrets quickly:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Create `client/.env.development`:

```env
VITE_API_URL=http://localhost:5000
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

### 4. Production build (local)

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

The full stack — frontend (nginx), backend (Node), and MongoDB — runs with one command.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (Windows/Mac) or Docker Engine (Linux)

### 1. Project-root `.env`

Compose substitutes secrets from a root-level `.env` (next to `docker-compose.yml`):

```env
ACCESS_TOKEN_SECRET=<random-long-string>
REFRESH_TOKEN_SECRET=<another-random-long-string>
```

> ⚠️ This file is gitignored. Each environment generates its own secrets.

### 2. Bring up the stack

```bash
docker compose up --build
```

What this does:

- Builds the `api` image from [server/Dockerfile](server/Dockerfile) (multi-stage: TypeScript compile → tiny runtime).
- Builds the `web` image from [client/Dockerfile](client/Dockerfile) (Vite build → nginx serves the static output).
- Pulls `mongo:7` from Docker Hub (first run only).
- Starts all three containers on a private Docker network where they reach each other by service name (`mongo`, `api`, `web`).

Once you see `Connected to MongoDB` and `Server started`, the stack is up.

### 3. Access the app

| URL                       | Service                             |
| ------------------------- | ----------------------------------- |
| http://localhost:8080     | Frontend (nginx)                    |
| http://localhost:5000     | Backend API                         |
| http://localhost:5000/health | Health check JSON                |
| mongodb://localhost:27017 | Local Mongo (for Compass / mongosh) |

### 4. Seed an admin user

User-creation endpoints are role-protected, so you can't register the first admin via the UI. Run the seed script:

```bash
docker compose exec api node dist/scripts/seedAdmin.js admin yourPassword123
```

Then log in at http://localhost:8080.

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

### Compose architecture

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

---

## ⚙️ Production & DevOps

This project's production posture is documented in detail in [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) (~2000 lines, 5 phases). Quick summary:

### CI/CD pipeline

[.github/workflows/ci.yml](.github/workflows/ci.yml) has five jobs:

| Job | Trigger | What it does |
| --- | ------- | ------------ |
| `client` — lint + build | every push | ESLint + Vite build |
| `server` — TypeScript build | every push | `tsc` compile |
| `deploy-client` | push to `main` | Build with prod `VITE_API_URL`, deploy via Netlify CLI |
| `deploy-server` | push to `main` | POST to Render deploy hook |
| `deploy-vps` | push to `main` | SSH into VPS, `git pull` → `npm ci` → `npm run build` → `pm2 reload` |

Plus: branch protection on `main` requires both build jobs to be green before merge; every PR gets an auto-generated Netlify deploy preview URL.

### Multi-stage Docker

- `server/Dockerfile`: Stage 1 compiles TypeScript with dev deps (~400 MB); Stage 2 copies only `dist/` into a fresh image with prod-only deps (~150 MB).
- `client/Dockerfile`: Stage 1 runs `vite build`; Stage 2 is `nginx:alpine` serving the `dist/` folder with a SPA-fallback config.
- `docker-compose.yml`: orchestrates both plus `mongo:7` with a named volume for persistence.

### VPS hosting (Hetzner CX22 / Ubuntu 24.04)

- Non-root user (`hanan`) with sudo; ufw firewall allowing only 22/80/443.
- `pm2 start npm --name technote-api -- start` keeps Node alive, restarts on crash, persists across reboot.
- nginx as reverse proxy: `:80` → `localhost:5000`. Node never directly faces the internet.
- Dedicated CI deploy SSH key (`technote_deploy`) — separate from personal key.

### Observability

| Concern | Implementation |
| ------- | -------------- |
| Liveness | `/health` returns JSON with `status`, `uptime`, `db`, `timestamp` |
| Uptime monitoring | UptimeRobot pings `/health` every 5 min |
| Errors | Sentry captures uncaught errors with stack + request context |
| Logs | pino structured JSON to stdout, pino-pretty for dev, `redact` for sensitive fields |
| Access logs | pino-http auto-logs every request with method, URL, status, response time |

### Security

| Concern | Implementation |
| ------- | -------------- |
| HTTP headers | Helmet (~12 headers — CSP, HSTS, X-Frame-Options, etc.) |
| Refresh-token cookie | `httpOnly`, `secure` in prod, `sameSite: "none"` for cross-origin |
| Login brute force | `express-rate-limit` |
| CORS | Explicit allow-list of origins, `credentials: true` |
| Server identity | Express's `x-powered-by` removed by Helmet |
| Secrets | `.env` files gitignored; production secrets in platform secret stores; VPS `.env` has `chmod 600` |
| Auth keys | Dedicated CI deploy SSH key (not personal key); regenerated JWT secrets after any exposure |

### Deferred / future improvements

- HTTPS on the VPS — requires a domain + Let's Encrypt (Step 3.6 in [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md))
- Automated database backups via scheduled GitHub Actions workflow (Step 5.7)
- Cloudflare in front of the VPS for CDN + DDoS + origin hiding (Step 5.9)
- Container registry (GHCR) + image-based VPS deploys (Step 5.8)
- Terraform-managed infrastructure (Step 5.10)

---

## API Overview

Base URL: `http://localhost:5000` (dev) · `https://mern-technotes-website.onrender.com` (prod)

| Method | Endpoint        | Auth                  | Description                                        |
| ------ | --------------- | --------------------- | -------------------------------------------------- |
| GET    | `/health`       | public                | JSON health probe (200 ok / 503 degraded)          |
| POST   | `/auth`         | public (rate-limited) | Login — returns access token + sets refresh cookie |
| GET    | `/auth/refresh` | refresh cookie        | Issues a new access token                          |
| POST   | `/auth/logout`  | public                | Clears refresh cookie                              |
| GET    | `/users`        | any role              | List all users                                     |
| POST   | `/users`        | Manager/Admin         | Create a user                                      |
| PATCH  | `/users`        | Manager/Admin         | Update a user (role, active flag, password)        |
| DELETE | `/users`        | Manager/Admin         | Delete a user                                      |
| GET    | `/notes`        | any role              | List all notes (employees scoped to own)           |
| POST   | `/notes`        | any role              | Create a note                                      |
| PATCH  | `/notes`        | any role \*           | Update a note (\* employees only their own)        |
| DELETE | `/notes`        | Manager/Admin         | Delete a note                                      |

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
| -------- | ---------- | ---------- | ------------ | ------------- |
| Employee | own only   | own only   | —            | —             |
| Manager  | all        | all        | yes          | yes           |
| Admin    | all        | all        | yes          | yes           |

---

## Scripts

**Server**

- `npm run dev` — `tsx watch --import ./src/instrument.ts src/server.ts` (Sentry pre-instrumentation + hot reload)
- `npm run build` — `tsc`
- `npm start` — `node --import ./dist/instrument.js dist/server.js` (Sentry pre-instrumentation in production)
- `npm run seed:admin -- <username> <password>` — seed an admin user (requires `npm run build` first; reads `DATABASE_URI` from `.env`)
- `npm run seed:admin:dev -- <username> <password>` — same, but runs the TypeScript directly via `tsx`

**Client**

- `npm run dev` — Vite dev server
- `npm run build` — type-check + production bundle
- `npm run lint` — ESLint
- `npm run preview` — preview the production build

---

## 📚 Further reading

- [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) — full Phase 1-5 deployment walkthrough with every command explained
- [docs/DOCKER_GUIDE.md](docs/DOCKER_GUIDE.md) — focused Docker reference (Dockerfile breakdown, daily compose routine, core commands)

---

## License

ISC
