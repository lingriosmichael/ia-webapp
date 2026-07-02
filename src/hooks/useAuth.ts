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
  clearAccessToken,
  clearActiveOrganizationId,
  getAccessToken,
  setAccessToken,
  setActiveOrganizationId,
} from "@/services/authStorage";

export const sessionQueryKey = ["session"] as const;

function persistAuth(response: AuthResponse) {
  setAccessToken(response.accessToken);
  const activeOrganizationId = resolveActiveOrganizationId(
    response.organizations,
  );

  if (activeOrganizationId) {
    setActiveOrganizationId(activeOrganizationId);
  }
}

export function useSessionQuery() {
  const hasWindow = typeof window !== "undefined";
  const token = getAccessToken();

  return useQuery<SessionResponse, ApiError>({
    queryKey: sessionQueryKey,
    queryFn: () => apiClient.getSession(),
    enabled: hasWindow && Boolean(token),
    retry: false,
  });
}

export function useRequireAuth() {
  const navigate = useNavigate();
  const token = getAccessToken();
  const sessionQuery = useSessionQuery();

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      void navigate({ to: "/login" });
    }
  }, [navigate, token]);

  useEffect(() => {
    if (
      sessionQuery.error instanceof ApiError &&
      sessionQuery.error.statusCode === 401
    ) {
      clearAccessToken();
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

  return () => {
    clearAccessToken();
    clearActiveOrganizationId();
    queryClient.clear();
    void navigate({ to: "/" });
  };
}
