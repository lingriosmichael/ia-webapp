import "./lib/errorCapture";

import { timingSafeEqual } from "node:crypto";

import { consumeLastCapturedError } from "./lib/errorCapture";
import { renderErrorPage } from "./lib/errorPage";

type ServerEntry = {
  fetch: (
    request: Request,
    env: unknown,
    ctx: unknown,
  ) => Promise<Response> | Response;
};

// Pre-launch access gate: a single shared username/password pair, unrelated
// to the app's real per-user auth (see ia_webapp/CLAUDE.md "Auth"). Only
// enforced when both env vars are set, so local dev is never blocked and a
// deployment stays open until you deliberately lock it down.
const SITE_AUTH_USERNAME = process.env.SITE_AUTH_USERNAME;
const SITE_AUTH_PASSWORD = process.env.SITE_AUTH_PASSWORD;

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  // Hash both to a fixed length first so a length mismatch can't short-circuit
  // timingSafeEqual and leak how long the guess was.
  const paddedA = Buffer.concat([bufferA, Buffer.alloc(64)]).subarray(0, 64);
  const paddedB = Buffer.concat([bufferB, Buffer.alloc(64)]).subarray(0, 64);
  return (
    bufferA.length === bufferB.length && timingSafeEqual(paddedA, paddedB)
  );
}

function checkSiteAuth(request: Request): Response | null {
  if (!SITE_AUTH_USERNAME || !SITE_AUTH_PASSWORD) return null;

  const authHeader = request.headers.get("authorization") ?? "";
  if (authHeader.startsWith("Basic ")) {
    const decoded = Buffer.from(authHeader.slice(6), "base64").toString(
      "utf-8",
    );
    const separatorIndex = decoded.indexOf(":");
    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    if (
      timingSafeStringEqual(username, SITE_AUTH_USERNAME) &&
      timingSafeStringEqual(password, SITE_AUTH_PASSWORD)
    ) {
      return null;
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Impact Atlas", charset="UTF-8"',
    },
  });
}

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(
  response: Response,
  request: Request,
): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (
    !body.includes('"unhandled":true') ||
    !body.includes('"message":"HTTPError"')
  ) {
    return response;
  }

  console.error(
    consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`),
  );
  return new Response(renderErrorPage(request.headers.get("accept-language")), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const authChallenge = checkSiteAuth(request);
    if (authChallenge) return authChallenge;

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response, request);
    } catch (error) {
      console.error(error);
      return new Response(
        renderErrorPage(request.headers.get("accept-language")),
        {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        },
      );
    }
  },
};
