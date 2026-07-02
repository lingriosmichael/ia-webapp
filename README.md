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
- Node.js v24.18.0
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
