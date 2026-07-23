# Impact Atlas Web App

This service is the frontend for Impact Atlas. It is a React application built with Vite and TanStack Start. It talks to the backend API over HTTP and provides the user interface for managing organizations, projects, and activities.

## What this service does

- Renders the web application UI
- Connects to the backend API
- Supports authentication, organization switching, project management, and activity workflows
- Runs locally on port 8080 by default

## Prerequisites

Before you start, install the following:

- Git
- Node.js 22.12.0 up to (but not including) 25.0.0 — matches Vercel's currently supported build runtimes and the `engines.node` range in `package.json`
- npm (this comes with Node.js)
- A running backend service on port 4000
- Docker Desktop is only required if you also need the backend MongoDB container
- A terminal app and VS Code are recommended

### macOS setup example

If you are on macOS and do not already have Node.js installed, use:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node@22
echo 'export PATH="/opt/homebrew/opt/node@22/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Then confirm the installation:

```bash
node --version
npm --version
```

## Clone the repository

```bash
git clone <your-repo-url>
cd Impact_Atlas/ia_webapp
```

## Install dependencies

```bash
npm install
```

## Create the environment file

```bash
cp .env.example .env
```

The default environment file points the app at the local backend:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Start the backend first

The web app depends on the backend being available locally. If you have not started it yet, follow the backend README instructions first.

In short:

```bash
cd (go to where the file is located)
npm  install
cp .env.example .env
docker compose up -d mongo
npm run dev
```

Leave that terminal running.

## Start the frontend locally

Open a second terminal and run:

```bash
cd Impact_Atlas/ia_webapp
nvm use 'lts/*'
npm run dev
```

The app should open at:

- http://localhost:8080

## Useful commands

```bash
npm run dev      # start the development server
npm run build    # build the production app
npm run preview  # preview the built app locally
npm run lint     # run ESLint
npm run typecheck # run TypeScript type checking
```

## Vercel Deployment

This frontend is intended to run on Vercel in the recommended MVP setup.
This repository now includes [vercel.json](vercel.json) so Vercel treats the app as `tanstack-start`.

Set these production environment variables in Vercel:

```env
VITE_API_BASE_URL=/api
BACKEND_PROXY_URL=https://your-backend.onrender.com
```

Notes:

- this app uses TanStack Start SSR, so it is not just a static asset upload
- Vercel should build it with the TanStack Start/Nitro runtime
- `src/server.ts` proxies `/api/*` to `BACKEND_PROXY_URL`, which keeps auth
  same-origin at the browser level and avoids third-party-cookie login failures
  when Vercel and Render are on different domains
- the backend should still allow the frontend origin via `CORS_ORIGIN` for any
  direct calls or future integrations, but day-to-day browser auth should go
  through the proxy path above

## How authentication works

The backend issues an httpOnly session cookie on login — this app never
sees or stores the actual credential. Every request from `apiClient.ts`
sends `credentials: "include"` so the browser attaches that cookie
automatically. Two consequences worth knowing before debugging an auth
issue:

- In production, prefer `VITE_API_BASE_URL=/api` plus `BACKEND_PROXY_URL`
  so the browser only talks to the Vercel origin. That keeps the session
  cookie first-party from the browser's perspective and avoids third-party
  cookie blocking. If you bypass the proxy and call Render directly from the
  browser, `ia_backend`'s `CORS_ORIGIN` must match this app's origin exactly
  and `AUTH_COOKIE_SAME_SITE` must be `none`, or login will appear to succeed
  while every subsequent request comes back unauthenticated.
- `localStorage` in this app (see `src/services/authStorage.ts`) never
  holds the real credential — only a "session present" boolean marker and
  the active organization id, both just UI hints. "Login succeeds but the
  app treats me as logged out" is therefore a cookie problem (see above),
  not a storage problem.

## Common troubleshooting

- If the app shows API errors, confirm the backend is running at http://localhost:4000.
- If the frontend does not load, confirm you used the correct Node.js version.
- If you see a blank page, check the terminal output for build or runtime errors.
- If the backend is not running, authentication and data-driven pages will fail.

## Local development flow

1. Start the backend service.
2. Start the frontend in a separate terminal.
3. Open http://localhost:8080 in your browser.
4. If you need to stop the local servers, press Ctrl+C in each terminal.
