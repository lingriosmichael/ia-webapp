import { apiClient } from '@/services/api-client';

export async function resolveWorkspaceDestination(organizationId: string) {
  try {
    const workspace = await apiClient.getWorkspace(organizationId);
    const firstProjectId = workspace.projects[0]?.id;

    if (firstProjectId) {
      return {
        to: '/projects/$projectId' as const,
        params: { projectId: firstProjectId },
      };
    }
  } catch {
    // Fall back to the organization overview when the workspace is not reachable yet.
  }

  return {
    to: '/organizations/$organizationId' as const,
    params: { organizationId },
  };
}
