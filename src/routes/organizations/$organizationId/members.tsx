import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, PageHeader, TopBar } from "@/components/WorkspaceUI";
import {
  useCreateInvitationMutation,
  useOrganizationMembersQuery,
  useOrganizationInvitationsQuery,
  useRemoveOrganizationMemberMutation,
} from "@/hooks/use-grantready";
import { useWorkspaceLocale } from "@/hooks/use-workspace-locale";
import { ApiError } from "@/services/api-client";
import { useOrganizationWorkspacePage } from "./route";

export const Route = createFileRoute("/organizations/$organizationId/members")({
  component: OrganizationMembersPage,
});

function OrganizationMembersPage() {
  const { workspace, organizationId } = useOrganizationWorkspacePage();
  const locale = useWorkspaceLocale();
  const [email, setEmail] = useState("");
  const membersQuery = useOrganizationMembersQuery(
    organizationId,
    workspace.organization.permissions.canManageMembers,
  );
  const invitationsQuery = useOrganizationInvitationsQuery(
    organizationId,
    workspace.organization.permissions.canManageMembers,
  );
  const createInvitationMutation = useCreateInvitationMutation(organizationId);
  const removeMemberMutation = useRemoveOrganizationMemberMutation(organizationId);

  if (!workspace.organization.permissions.canManageMembers) {
    return <Navigate to="/organizations/$organizationId" params={{ organizationId }} />;
  }

  if (membersQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading members…
      </div>
    );
  }

  const members = membersQuery.data ?? [];

  async function inviteMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await createInvitationMutation.mutateAsync({
        email,
        role: "PROJECT_MANAGER",
      });
      setEmail("");
      toast.success(locale.members.inviteSuccess);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : locale.members.inviteFailure);
    }
  }

  async function removeMember(membershipId: string) {
    try {
      await removeMemberMutation.mutateAsync(membershipId);
      toast.success(locale.members.removeSuccess);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : locale.members.removeFailure);
    }
  }

  return (
    <>
      <TopBar
        crumbs={[
          { label: workspace.organization.name, to: "/organizations/$organizationId", params: { organizationId } },
          { label: locale.sidebar.members },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl px-8 py-10">
        <PageHeader
          eyebrow={locale.members.eyebrow}
          title={locale.members.title}
          description={locale.members.description}
        />

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-6">
            <div className="text-sm font-semibold tracking-tight text-foreground">
              {locale.members.inviteTitle}
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {locale.members.inviteDescription}
            </p>
            <form className="mt-5 space-y-4" onSubmit={inviteMember}>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder={locale.members.emailPlaceholder}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              />
              <div className="rounded-md border border-border bg-secondary/30 px-3 py-2 text-sm text-muted-foreground">
                {locale.members.projectManagerRole}
              </div>
              <button
                type="submit"
                disabled={createInvitationMutation.isPending}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-60"
              >
                {createInvitationMutation.isPending
                  ? locale.members.inviting
                  : locale.members.sendInvitation}
              </button>
            </form>

            <div className="mt-8">
              <div className="text-sm font-semibold tracking-tight text-foreground">
                {locale.members.pendingInvitations}
              </div>
              <div className="mt-4 space-y-3">
                {(invitationsQuery.data ?? []).filter((invitation) => invitation.status === "pending").map((invitation) => (
                  <div
                    key={invitation.id}
                    className="rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm"
                  >
                    <div className="font-medium text-foreground">{invitation.email}</div>
                    <div className="mt-1 text-muted-foreground">{locale.members.pendingStatus}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-semibold tracking-tight text-foreground">
              {locale.members.currentMembers}
            </div>
            <div className="mt-4 space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/20 px-4 py-4"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">{member.fullName}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                      {member.role === "ORGANIZATION_ADMIN"
                        ? locale.members.organizationAdminRole
                        : locale.members.projectManagerRole}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-sm font-medium text-destructive"
                    >
                      {locale.members.removeAction}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
