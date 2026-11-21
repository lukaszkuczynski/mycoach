# mycoach

Smart activity coach using Garmin data.

```
React (frontend/) -> Express (backend/) -> Python service (garmin-service/) -> Garmin API
```

## Setup

```sh
npm install
cd garmin-service && python3 -m venv .venv && .venv/bin/pip install -e '.[dev]'
```

## Run (each in its own terminal)

| App            | Command                | URL                   |
| -------------- | ---------------------- | --------------------- |
| backend        | `npm run dev:backend`  | http://localhost:3000 |
| frontend       | `npm run dev:frontend` | http://localhost:5173 |
| garmin-service | `npm run dev:garmin`   | http://127.0.0.1:8001 |

## Scripts

`npm run lint`, `npm run format`, `npm run build`.
Python: `cd garmin-service && .venv/bin/ruff check .`

Secrets (`.env`, Garmin tokens) are git-ignored; never commit them.
