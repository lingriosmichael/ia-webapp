export async function resolveWorkspaceDestination(organizationId: string) {
  return {
    to: '/organizations/$organizationId' as const,
    params: { organizationId },
  };
}
