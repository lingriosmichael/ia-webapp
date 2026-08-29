## ia_webapp — Frontend

Stack: React, Vite, TanStack Start (file-based routing). TanStack Query is
the recommended way to handle server state against ia_backend.

## Structure

- `src/routes/` — TanStack Start routes
- `src/components/` — shared UI and page components
- `src/components/ui/` — reusable primitive UI components
- `src/hooks/` — custom hooks
- `src/lib/` — framework-agnostic frontend utilities
- `src/services/` — backend-facing API and storage services
- `src/locales/` — translation dictionaries

## Key feature documentation

For the activity-analysis feature (upload → privacy review → interpretation
→ `ActivityAnalystV2`), see `CURRENT_ANALYSIS_PIPELINE.md` in
`ia_backend/documentation/` — it lists the canonical frontend files for
that flow plus the cross-service data flow. The older
`activity.aiKnowledgeSnapshot`-based
summary is legacy; new work should read/write only the `analysis-v2` routes
and hooks.

As of 2026-08-18, the dedicated activity analysis page
(`activityAnalyticsPage.tsx`) and its panel (`activityAnalysisV2Panel.tsx`)
were deleted — `routes/projects/$projectId/activities/$activityId/analysis.tsx`,
`.../analytics.tsx`, and `.../insights.tsx` are now all thin
`LegacyRedirect` routes that forward to the project-level
`/projects/$projectId/analytics` page. The V2 run UI (triggering a run,
rendering goal cards, answering clarification questions) now lives entirely
inside `routes/projects/$projectId/interpretation.tsx`, via its local
`AnalysisOpenDialog` component — that route, not a standalone page, is the
canonical place to look for `ActivityAnalystV2` frontend behavior.

`/projects/$projectId/analytics` itself no longer renders the old
configurable analytics dashboard (`configurableAnalyticsDashboard.tsx` and
`projectAnalyticsPage.tsx` were deleted in the same 2026-08-18 change). It
now renders `components/impactStory/projectImpactStoryPage.tsx`, the
**Project Impact Story** feature: a project-level narrative and chart plan.
This is a separate feature from the `ActivityAnalystV2` pipeline, not part
of it, but it isn't purely a downstream consumer of human-confirmed
`OutcomeEvidenceLink` records either — activity cards and the chart-plan
catalog read `ActivityAnalystV2` run output directly, gated only by V2's
own grounding; only the narrative text is restricted to confirmed links.
Canonical doc: `CURRENT_ANALYTICS_PIPELINE.md` in `ia_backend/documentation/`
— read it, not just this paragraph, before non-trivial changes here. The
separate "Wirkungsaussagen" tab
(`routes/projects/$projectId/outcome-statements.tsx`) that used to produce
those `OutcomeEvidenceLink` records was removed 2026-08-27 — that review
surface now lives inside `routes/projects/$projectId/interpretation.tsx`
(`outcomeEvidenceRecommendationPanel.tsx`), scoped to the merged
`"outcome_evidence"` system activity. Canonical doc:
`OUTCOME_EVIDENCE_MERGE_PLAN.md` in `ia_backend/documentation/`.
The two small orphan files this section used to flag under
`src/components/analytics/` (`analyticsEmptyState.tsx`, `analyticsFormat.ts`)
have since been deleted outright in the same working tree as the
outcome-evidence merge above — confirmed gone, not just unreferenced.

## Naming standard

- Use `camelCase` for all multi-word frontend source filenames outside the route system.
- This applies to components, hooks, services, lib files, and locale files.
- Keep React component symbols in `PascalCase`, but keep the file name itself in `camelCase`, for example `workspaceShell.tsx`.
- TanStack route files are the only exception:
  - use `__root.tsx` for the root route,
  - use `route.tsx` for layout routes,
  - use `index.tsx` for index routes,
  - prefer route folders over dotted flat filenames for nested routes,
  - keep URL segment folders lower-case and use `$param` for dynamic segments.
- Do not introduce kebab-case frontend source filenames unless a third-party generator requires it and that exception is documented.

## Data fetching

Use TanStack Query for anything that hits ia_backend. Don't hand-roll
useEffect + fetch + manual loading state — Query gives you caching,
retries, and loading/error states for free, and keeps that logic
consistent across the app.
Centralize the actual HTTP client (e.g. `src/services/apiClient.ts`) so auth headers,
base URL, and error handling live in one place instead of being repeated
per call site.

## Routing

Follow TanStack Start's file-based convention. Keep route files thin —
data loading via loaders/Query, rendering via components — push real
logic into components/ and hooks/ so routes stay easy to scan.
Prefer folder-based nesting such as `routes/onboarding/invite.tsx` over dotted filenames such as `onboarding.invite.tsx`.

## Components

Function components only, typed props (no implicit any).
One component per file; colocate a component's own styles/tests next to
it rather than in a parallel directory tree.

## Styling

Tailwind v4 (`@tailwindcss/vite`) is already committed, with a full
CSS-custom-property token system in `src/styles.css` (`--primary`, `--card`,
`--shadow-elevated`, etc., wired into Tailwind via `@theme inline`). Use
those semantic tokens (`bg-primary`, `text-muted-foreground`,
`shadow-elevated`, ...) rather than raw Tailwind palette classes
(`bg-blue-600`) — that's what keeps a color/shadow/radius change a one-file
edit instead of a codebase-wide find-and-replace. `tw-animate-css` and Radix
UI primitives (`@radix-ui/react-*`) are already dependencies too — build on
them before reaching for a new one.

## Brand & Visual Design

Source of truth: `brand_assets/brand_guidelines.png`. Check it before designing
anything customer-facing — use its exact values, never invent or approximate.

- **Colors** — `#2563EB` (primary blue), `#A5B4FC` (periwinkle), `#FB923C`
  (orange), `#0F172A` (ink), `#C7E0C0` (sage green), `#F7F6F3`
  (background/off-white).
- **Typography** — GT Haptik for both headings (Bold/Semibold) and body
  (Regular/Medium). One typeface, no serif/display pairing.
- **Iconography** — simple line icons via `lucide-react` (already a project
  dependency — don't add a second icon set).
- **Graphic elements** — organic blob shapes and subtle dot-grid patterns for
  decorative depth, not gradients or grain textures.

**Known gap:** `src/styles.css`'s current tokens (`--signal: #2f6690`,
`--apricot: #c6912f`, `--ink: #212536`, `--pistachio: #e9f3ec`,
`--warm-stone: #f6f4ef`) diverge from the values above — a muted variant
that predates or drifted from the brand guidelines. `--font-sans: "Inter"`
is also the live body font, not GT Haptik. (There's also a
`--font-editorial` serif stack, actively used in the Project Impact Story
feature's headline components — `impactStoryNarrativeBanner.tsx` and
`impactStoryHeadlineKpiRow.tsx` — not dead code; it's unclear whether that's
a deliberate editorial accent for that narrative feature specifically or
its own drift from brand, so don't assume either way.) Treat
`brand_guidelines.png` as canonical going forward, but do **not** repaint
`styles.css` or existing components as a side effect of unrelated work —
that's a deliberate, repo-wide, user-visible change. Surface the mismatch
and get explicit sign-off before touching shared tokens.

## Reference-Image Design Workflow

When given a reference image (Figma export, screenshot, mock) for a new
screen or component:

- Match layout, spacing, typography, and color exactly. Don't add sections,
  features, or "improvements" beyond what's shown in the reference.
- Build it as real React component(s) under `src/components/` (or the
  relevant route), following this repo's naming and typing conventions — not
  a disposable static HTML file.
- Run the app locally (`npm run dev` → `http://localhost:8080`; see
  "Environment" below for the required env var) and visually compare your
  build against the reference. Do at least two comparison passes, fixing
  mismatches between each. Be specific about deltas: "heading is 32px,
  reference shows ~24px."
- No screenshot/browser-automation tooling (Puppeteer, Playwright) is
  currently installed in this repo. If you want repeatable automated visual
  QA, propose adding Playwright as a devDependency and ask before installing
  — don't assume scripts that don't exist.
- If no reference image is given, design from scratch using the guardrails
  below, at high craft.

## Anti-Generic Guardrails

- **Shadows** — never flat `shadow-md`; use layered, color-tinted shadows at
  low opacity (see `--shadow-soft` / `--shadow-elevated` / `--shadow-glow` in
  `styles.css` for the existing pattern to extend).
- **Typography** — tight tracking (`-0.03em`) on large headings, generous
  line-height (`1.7`) on body copy.
- **Animations** — only animate `transform` and `opacity`; never
  `transition-all`; prefer spring-style easing.
- **Interactive states** — every clickable element needs hover,
  focus-visible, and active states. No exceptions.
- **Images** — gradient overlay (`bg-gradient-to-t from-black/60`) plus a
  `mix-blend-multiply` color treatment layer where photography is used.
- **Spacing** — use consistent, intentional spacing tokens, not arbitrary
  Tailwind steps.
- **Depth** — layer surfaces (base → elevated → floating) rather than a flat
  z-plane.

## Auth

This is implemented, not just a recommendation: `ia_backend` sets the
session as an httpOnly cookie, and `apiClient.ts` calls every request with
`credentials: "include"` so the browser attaches it automatically — the
JWT itself never touches client-side JavaScript or localStorage.
`authStorage.ts` only stores two non-sensitive, client-side hints: a
"session present" boolean marker (`useAuth.ts` reads it to skip an
unnecessary session check) and the active organization id. Neither is a
credential; losing or corrupting either just degrades to "ask the backend
again" or "pick an organization again," never an auth bypass.

`useAuth.ts`'s `useSessionQuery`/`useRequireAuth` gate every authenticated
query off `typeof window !== "undefined"` — see the comment on
`useSessionQuery` for why this is a real safety property (it's what keeps
this app safe from an SSR cookie-forwarding bug) and not just a hydration
nicety. Do not remove that gate, and do not add a route `loader` or
`createServerFn` that fetches an authenticated endpoint without reading
that comment first.

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

API base URL comes from the `VITE_API_BASE_URL` env var — never hardcode
localhost:4000 in source, since it'll silently break in staging/prod.
`apiClient.ts` throws at startup if it's unset rather than falling back to
a default, so a missing value fails loudly instead of quietly pointing at
the wrong backend.

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
