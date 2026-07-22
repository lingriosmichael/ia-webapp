import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { resolveActiveOrganizationId } from "@/lib/organizationSelection";
import {
  ApiError,
  apiClient,
  type AuthResponse,
  type SessionResponse,
} from "@/services/apiClient";
import {
  clearSessionMarker,
  clearActiveOrganizationId,
  getSessionMarker,
  setSessionMarker,
  setActiveOrganizationId,
} from "@/services/authStorage";

export const sessionQueryKey = ["session"] as const;

function persistAuth(response: AuthResponse) {
  setSessionMarker();
  const activeOrganizationId = resolveActiveOrganizationId(
    response.organizations,
  );

  if (activeOrganizationId) {
    setActiveOrganizationId(activeOrganizationId);
  }
}

export function useSessionQuery() {
  // This `enabled` gate is the reason this app is safe from an SSR
  // cookie-forwarding bug, not incidental. apiClient's `credentials:
  // "include"` only makes a *browser* fetch auto-attach the httpOnly
  // session cookie — a fetch made by a TanStack Start server function
  // during SSR runs in Node, with no ambient browser cookie jar, so it
  // would need the incoming request's Cookie header forwarded explicitly
  // (e.g. via `getWebRequest()`/`getRequestHeader("cookie")`) to
  // authenticate. Nothing here does that. Gating this query (and every
  // `enabled: Boolean(auth.token)` query downstream, via useRequireAuth's
  // `token`) off `hasWindow` means the session query — and therefore every
  // authenticated query in the app — simply never runs server-side; it
  // always waits for client-side hydration, where the real cookie exists.
  // If you ever add a route `loader` or `createServerFn` that fetches an
  // authenticated endpoint directly, this safety property does not extend
  // to it — you must forward the cookie yourself or it will silently
  // behave as logged-out server-side.
  const hasWindow = typeof window !== "undefined";

  return useQuery<SessionResponse, ApiError>({
    queryKey: sessionQueryKey,
    queryFn: () => apiClient.getSession(),
    enabled: hasWindow,
    retry: false,
  });
}

export function useRequireAuth() {
  const navigate = useNavigate();
  const sessionQuery = useSessionQuery();
  const sessionMarker = getSessionMarker();
  const token = sessionMarker || (sessionQuery.data ? "session" : null);

  useEffect(() => {
    if (sessionQuery.data && !sessionMarker) {
      setSessionMarker();
    }
  }, [sessionMarker, sessionQuery.data]);

  useEffect(() => {
    if (typeof window === "undefined" || sessionQuery.isLoading) {
      return;
    }

    if (!token) {
      void navigate({ to: "/login" });
    }
  }, [navigate, sessionQuery.isLoading, token]);

  useEffect(() => {
    if (
      sessionQuery.error instanceof ApiError &&
      sessionQuery.error.statusCode === 401
    ) {
      clearSessionMarker();
      void navigate({ to: "/login" });
    }
  }, [navigate, sessionQuery.error]);

  return {
    token,
    ...sessionQuery,
  };
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.login,
    onSuccess: (response) => {
      persistAuth(response);
      queryClient.setQueryData(sessionQueryKey, {
        user: response.user,
        organizations: response.organizations,
      });
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.register,
    onSuccess: (response) => {
      persistAuth(response);
      queryClient.setQueryData(sessionQueryKey, {
        user: response.user,
        organizations: response.organizations,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return async () => {
    try {
      await apiClient.logout();
    } finally {
      clearSessionMarker();
      clearActiveOrganizationId();
      queryClient.clear();
      void navigate({ to: "/" });
    }
  };
}
