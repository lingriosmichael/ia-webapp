import { createContext, useContext } from "react";
import type { useOrganizationWorkspaceQuery } from "@/hooks/useWorkspaceQueries";

interface OrganizationWorkspacePageContextValue {
  organizationId: string;
  userName: string;
  workspace: NonNullable<
    ReturnType<typeof useOrganizationWorkspaceQuery>["data"]
  >;
}

export const OrganizationWorkspacePageContext =
  createContext<OrganizationWorkspacePageContextValue | null>(null);

export function useOrganizationWorkspacePage() {
  const context = useContext(OrganizationWorkspacePageContext);

  if (!context) {
    throw new Error(
      "useOrganizationWorkspacePage must be used within the organization layout.",
    );
  }

  return context;
}
