# gr_webapp

Frontend for Impact Atlas. This app is built with React, Vite, and TanStack Start, and it talks to `gr_backend` over REST.

## Prerequisites

- Node.js 22 or current LTS
- npm
- `gr_backend` running locally on port `4000`

## Environment

Create a local env file in `gr_webapp`:

```bash
cp .env.example .env
```

Default local API configuration:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Start Development

Run all commands from the `gr_webapp` directory:

```bash
cd gr_webapp
npm install
nvm use 'lts/*'
npm run dev
```

The frontend dev server runs on `http://localhost:8080`.

If the backend is not running, pages that depend on API data or authentication will fail.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Local Development Flow

1. Start `gr_backend`.
2. In a separate terminal, start `gr_webapp` with `npm run dev`.
3. Open `http://localhost:8080`.
# ia-webapp
Frontend Infrastructure for a Impact Atlas
