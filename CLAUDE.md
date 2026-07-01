## gr_webapp — Frontend

Stack: React, Vite, TanStack Start (file-based routing). TanStack Query is
the recommended way to handle server state against gr_backend.

## Structure
app/routes/ — TanStack Start file-based routes
app/components/ — shared UI components
app/lib/ — API client, shared utilities
app/hooks/ — custom hooks

## Data fetching
Use TanStack Query for anything that hits gr_backend. Don't hand-roll
useEffect + fetch + manual loading state — Query gives you caching,
retries, and loading/error states for free, and keeps that logic
consistent across the app.
Centralize the actual HTTP client (e.g. app/lib/api.ts) so auth headers,
base URL, and error handling live in one place instead of being repeated
per call site.

## Routing
Follow TanStack Start's file-based convention. Keep route files thin —
data loading via loaders/Query, rendering via components — push real
logic into components/ and hooks/ so routes stay easy to scan.

## Components
Function components only, typed props (no implicit any).
One component per file; colocate a component's own styles/tests next to
it rather than in a parallel directory tree.

## Styling
Pick one approach and use it everywhere (Tailwind is a common fit with this
stack if you haven't committed to something else yet). Mixing CSS
approaches across a solo codebase costs you more than it saves.

## Auth
Prefer an httpOnly cookie over localStorage for the JWT if your backend
setup allows it — reduces XSS blast radius. If you do need
localStorage/in-memory storage for now, treat it as a known tradeoff,
not a long-term default.
All auth logic (attaching the token, handling 401s) belongs in the
centralized API client, not scattered across components.


## UX baseline
Every data-fetching view handles loading, error, and empty states
explicitly — a failed fetch should never just render a blank screen.
Semantic HTML first; reach for ARIA attributes only when semantic HTML
genuinely can't express the interaction.
Forms: visible labels (not placeholder-as-label), full keyboard
navigability, clear inline error messages.


## Testing
Light, by design — no coverage mandate. If you do add tests later, Vitest +
React Testing Library is the natural fit for this stack.

## Environment
API base URL comes from an env var (VITE_API_URL or similar) — never
hardcode localhost:4000 in source, since it'll silently break in
staging/prod.

## Solo-dev notes
Lean on TanStack Start / TanStack Query conventions rather than building
custom abstractions on top of them — less for future-you to relearn after a
few months away. Hold off adding a global state library or component kit
until you can point to actual pain without one.

## React philosophy
Components should render.
Hooks should orchestrate.
Services should communicate.
Never mix those responsibilities.