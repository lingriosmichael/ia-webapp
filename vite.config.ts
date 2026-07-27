// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const vercelNitroConfig = {
  preset: "vercel",
  // Nitro's current nf3-based externals tracer breaks on Vercel because nf3
  // imports a CommonJS-only @vercel/nft entry as a named ESM export. Bundle
  // runtime dependencies into the server output instead of tracing them.
  noExternals: true,
} as const;

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // MVP hosting target is Vercel, not the wrapper's cloudflare-module default —
  // without this, `npm run build` emits a Cloudflare Workers artifact (wrangler.json)
  // that Vercel cannot deploy.
  // The wrapper package's TypeScript type lags Nitro's actual runtime config
  // shape; keep the valid Nitro option while preserving local typecheck.
  nitro: vercelNitroConfig as never,
});
