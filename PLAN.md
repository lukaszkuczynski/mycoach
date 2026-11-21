# PLAN: Minimal web app showing steps for the last 7 days

Each work item below is written to be saved as a GitHub issue (title = heading, body = the rest).

## Scope
A minimal web app that shows daily step counts for the last 7 days, using the Garmin personal API. No recommendations, auth UI or database yet.

## Architecture
The Garmin Python client is isolated in `garmin-service/`. Express is the only API the frontend talks to.

```
React (frontend/) -> Express (backend/) -> Python service (garmin-service/) -> Garmin API
```

Why a sidecar service rather than Express spawning a Python script: easy to test and mock, credentials live in one place, and it can later be swapped for a native TypeScript client without touching Express or the frontend.

Shared contract for steps data: `{ date: string (YYYY-MM-DD); steps: number; goal?: number }[]`

## Order
1 first. Then two tracks in parallel: Python (2, 3) and Express (4, 5), with the frontend (6, 7) alongside, since each side codes against the agreed contract. 8 last.

## Risks
- **Process management:** three processes complicate local dev and later deployment. Item 8 covers local dev; deployment is out of scope.
- **Garmin client limits:** item 2's scope depends on what the client exposes for daily steps. Check against the already-completed API spike.

---

## 1. Scaffold the monorepo
Labels: `chore`

- Create `backend/` (Express, TypeScript), `frontend/` (React, TypeScript, Vite) and `garmin-service/` (Python 3, `pyproject.toml`, venv).
- Add a root README, lint and format config, and a `.gitignore` excluding `.env`, `.venv` and Garmin tokens.
- Update `CLAUDE.md` to state Python is allowed for the Garmin adapter only.

**Done when:** all three apps start locally.

## 2. Python service: Garmin client wrapper
Labels: `garmin-service` · Depends on: 1

- Install the Garmin client (`garmin/connect-personal-api-python`); load credentials and tokens from env vars, with `.env.example`.
- Add a thin module wrapping the client that returns `[{ date, steps, goal? }]` for a date range. Check the client's actual method for daily steps first.
- Handle auth, rate-limit and network errors.
- Unit tests with the client mocked; reuse the spike's sample response as a fixture.

**Done when:** the wrapper returns correct data for a date range against the mock and, manually, against real Garmin.

## 3. Python service: HTTP API
Labels: `garmin-service` · Depends on: 2

- `GET /steps?from=&to=` and `GET /health` (FastAPI recommended for typed validation).
- Bind to localhost only; consistent JSON error shape.
- Endpoint tests.

**Done when:** `curl localhost:<port>/steps?from=...&to=...` returns the contract shape.

## 4. Express: Garmin service client
Labels: `backend` · Depends on: 1 (can use a mocked contract from 3)

- Typed `GarminServiceClient.getSteps(from, to)` calling the Python service.
- Service URL from config; timeouts; translate upstream errors into API errors.
- Unit tests with mocked HTTP.

## 5. Express: `GET /api/steps?days=7`
Labels: `backend` · Depends on: 4

- Default 7 days; validate `days` (1-30).
- Fill missing days with 0; sort ascending.
- Consistent error shape; CORS for the frontend dev origin; `/health` route.
- Endpoint tests.

**Done when:** the endpoint returns 7 entries, oldest first, for a default call.

## 6. Frontend: API client and data hook
Labels: `frontend` · Depends on: 1

- Typed `fetchSteps(days)` and a `useSteps()` hook with loading, error and data states.
- Dev proxy to Express.

## 7. Frontend: 7-day steps view
Labels: `frontend` · Depends on: 6

- Bar chart with weekday and date per bar (lightweight chart library or plain SVG).
- Table of the same numbers; highlight today.
- Loading, error-with-retry and empty states; responsive layout.
- Component tests.

**Done when:** opening the app shows the last 7 days of steps from real data.

## 8. Wire up, docs and CI
Labels: `chore` · Depends on: 3, 5, 7

- One root command (e.g. a `concurrently` script) that starts all three processes.
- README setup docs, including how to get Garmin credentials.
- Manual end-to-end check against real data.
- CI workflow: lint, test and build for backend and frontend; lint and test for the Python service.
