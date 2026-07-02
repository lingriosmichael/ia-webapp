import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as apiClient, s as sessionQueryKey } from "./use-auth-CbwAMR7f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-grantready-DIPYOCni.js
var workspaceQueryKey = (organizationId) => ["workspace", organizationId];
var projectQueryKey = (projectId) => ["project", projectId];
var projectOverviewQueryKey = (projectId) => ["project-overview", projectId];
var projectActivitiesQueryKey = (projectId) => ["project-activities", projectId];
var activityQueryKey = (activityId) => ["activity", activityId];
var activityUploadsQueryKey = (activityId) => ["activity-uploads", activityId];
var activityJobsQueryKey = (activityId) => ["activity-jobs", activityId];
var activityResultsQueryKey = (activityId) => ["activity-results", activityId];
var jobQueryKey = (jobId) => ["job", jobId];
var organizationMembersQueryKey = (organizationId) => ["organization-members", organizationId];
var organizationInvitationsQueryKey = (organizationId) => ["organization-invitations", organizationId];
var invitationQueryKey = (token) => ["invitation", token];
function useOrganizationWorkspaceQuery(organizationId, enabled = true) {
	return useQuery({
		queryKey: workspaceQueryKey(organizationId),
		queryFn: () => apiClient.getWorkspace(organizationId),
		enabled
	});
}
function useOrganizationMembersQuery(organizationId, enabled = true) {
	return useQuery({
		queryKey: organizationMembersQueryKey(organizationId),
		queryFn: () => apiClient.listOrganizationMembers(organizationId),
		enabled
	});
}
function useOrganizationInvitationsQuery(organizationId, enabled = true) {
	return useQuery({
		queryKey: organizationInvitationsQueryKey(organizationId),
		queryFn: () => apiClient.listOrganizationInvitations(organizationId),
		enabled
	});
}
function useInvitationQuery(token, enabled = true) {
	return useQuery({
		queryKey: invitationQueryKey(token),
		queryFn: () => apiClient.getInvitation(token),
		enabled
	});
}
function useProjectQuery(projectId, enabled = true) {
	return useQuery({
		queryKey: projectQueryKey(projectId),
		queryFn: () => apiClient.getProject(projectId),
		enabled
	});
}
function useProjectOverviewQuery(projectId, enabled = true) {
	return useQuery({
		queryKey: projectOverviewQueryKey(projectId),
		queryFn: () => apiClient.getProjectOverview(projectId),
		enabled
	});
}
function useProjectActivitiesQuery(projectId, enabled = true) {
	return useQuery({
		queryKey: projectActivitiesQueryKey(projectId),
		queryFn: () => apiClient.listProjectActivities(projectId),
		enabled
	});
}
function useActivityQuery(activityId, enabled = true) {
	return useQuery({
		queryKey: activityQueryKey(activityId),
		queryFn: () => apiClient.getActivity(activityId),
		enabled
	});
}
function useActivityUploadsQuery(activityId, enabled = true) {
	return useQuery({
		queryKey: activityUploadsQueryKey(activityId),
		queryFn: () => apiClient.listActivityUploads(activityId),
		enabled
	});
}
function useActivityJobsQuery(activityId, enabled = true) {
	return useQuery({
		queryKey: activityJobsQueryKey(activityId),
		queryFn: () => apiClient.listActivityJobs(activityId),
		enabled
	});
}
function useActivityResultsQuery(activityId, enabled = true) {
	return useQuery({
		queryKey: activityResultsQueryKey(activityId),
		queryFn: () => apiClient.listActivityResults(activityId),
		enabled
	});
}
function useJobQuery(jobId, enabled = true) {
	return useQuery({
		queryKey: jobQueryKey(jobId ?? "missing"),
		queryFn: () => apiClient.getJob(jobId),
		enabled: enabled && Boolean(jobId),
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			return status && ["completed", "failed"].includes(status) ? false : 1e3;
		}
	});
}
function useCreateProjectMutation(organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => apiClient.createProject(organizationId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: workspaceQueryKey(organizationId) });
		}
	});
}
function useCreateOrganizationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => apiClient.createOrganization(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: sessionQueryKey });
		}
	});
}
function useDeleteProjectMutation(organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ projectId, payload }) => apiClient.deleteProject(projectId, payload),
		onSuccess: (deletedProject) => {
			queryClient.setQueryData(workspaceQueryKey(organizationId), (current) => current ? {
				...current,
				projects: current.projects.filter((project) => project.id !== deletedProject.id)
			} : current);
			queryClient.removeQueries({ queryKey: projectQueryKey(deletedProject.id) });
			queryClient.removeQueries({ queryKey: projectOverviewQueryKey(deletedProject.id) });
			queryClient.removeQueries({ queryKey: projectActivitiesQueryKey(deletedProject.id) });
			queryClient.invalidateQueries({ queryKey: workspaceQueryKey(organizationId) });
		}
	});
}
function useUpdateOrganizationMutation(organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => apiClient.updateOrganization(organizationId, payload),
		onSuccess: (organization) => {
			queryClient.setQueryData(workspaceQueryKey(organizationId), (current) => current ? {
				...current,
				organization: {
					...current.organization,
					...organization
				}
			} : current);
			queryClient.setQueryData(sessionQueryKey, (current) => current ? {
				...current,
				organizations: current.organizations.map((item) => item.id === organizationId ? {
					...item,
					...organization
				} : item)
			} : current);
			queryClient.invalidateQueries({ queryKey: workspaceQueryKey(organizationId) });
			queryClient.invalidateQueries({ queryKey: sessionQueryKey });
		}
	});
}
function useCreateInvitationMutation(organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => apiClient.createOrganizationInvitation(organizationId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: organizationInvitationsQueryKey(organizationId) });
			queryClient.invalidateQueries({ queryKey: organizationMembersQueryKey(organizationId) });
		}
	});
}
function useRemoveOrganizationMemberMutation(organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (membershipId) => apiClient.removeOrganizationMember(organizationId, membershipId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: organizationMembersQueryKey(organizationId) });
			queryClient.invalidateQueries({ queryKey: sessionQueryKey });
		}
	});
}
function useAcceptInvitationMutation(token) {
	return useMutation({ mutationFn: (payload) => apiClient.acceptInvitation(token, payload) });
}
function useCreateActivityMutation(projectId, organizationId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (payload) => apiClient.createActivity(projectId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: projectActivitiesQueryKey(projectId) });
			queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
			queryClient.invalidateQueries({ queryKey: projectOverviewQueryKey(projectId) });
			if (organizationId) queryClient.invalidateQueries({ queryKey: workspaceQueryKey(organizationId) });
		}
	});
}
function useUploadActivityFileMutation(activityId, projectId) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (file) => apiClient.uploadActivityFile(activityId, file),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: activityUploadsQueryKey(activityId) });
			queryClient.invalidateQueries({ queryKey: activityJobsQueryKey(activityId) });
			queryClient.invalidateQueries({ queryKey: activityResultsQueryKey(activityId) });
			if (projectId) {
				queryClient.invalidateQueries({ queryKey: projectOverviewQueryKey(projectId) });
				queryClient.invalidateQueries({ queryKey: projectActivitiesQueryKey(projectId) });
				queryClient.invalidateQueries({ queryKey: projectQueryKey(projectId) });
			}
		}
	});
}
//#endregion
export { useProjectOverviewQuery as _, useActivityUploadsQuery as a, useUpdateOrganizationMutation as b, useCreateOrganizationMutation as c, useInvitationQuery as d, useJobQuery as f, useProjectActivitiesQuery as g, useOrganizationWorkspaceQuery as h, useActivityResultsQuery as i, useCreateProjectMutation as l, useOrganizationMembersQuery as m, useActivityJobsQuery as n, useCreateActivityMutation as o, useOrganizationInvitationsQuery as p, useActivityQuery as r, useCreateInvitationMutation as s, useAcceptInvitationMutation as t, useDeleteProjectMutation as u, useProjectQuery as v, useUploadActivityFileMutation as x, useRemoveOrganizationMemberMutation as y };
