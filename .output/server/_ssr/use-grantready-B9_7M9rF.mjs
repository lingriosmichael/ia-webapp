import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as apiClient, s as sessionQueryKey } from "./use-auth-CH-EBljn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-grantready-B9_7M9rF.js
var workspaceQueryKey = (organizationId) => ["workspace", organizationId];
var projectQueryKey = (projectId) => ["project", projectId];
var projectOverviewQueryKey = (projectId) => ["project-overview", projectId];
var projectActivitiesQueryKey = (projectId) => ["project-activities", projectId];
var activityQueryKey = (activityId) => ["activity", activityId];
var activityUploadsQueryKey = (activityId) => ["activity-uploads", activityId];
var activityJobsQueryKey = (activityId) => ["activity-jobs", activityId];
var activityResultsQueryKey = (activityId) => ["activity-results", activityId];
var jobQueryKey = (jobId) => ["job", jobId];
function useOrganizationWorkspaceQuery(organizationId, enabled = true) {
	return useQuery({
		queryKey: workspaceQueryKey(organizationId),
		queryFn: () => apiClient.getWorkspace(organizationId),
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
export { useCreateActivityMutation as a, useJobQuery as c, useProjectOverviewQuery as d, useProjectQuery as f, useActivityUploadsQuery as i, useOrganizationWorkspaceQuery as l, useUploadActivityFileMutation as m, useActivityQuery as n, useCreateProjectMutation as o, useUpdateOrganizationMutation as p, useActivityResultsQuery as r, useDeleteProjectMutation as s, useActivityJobsQuery as t, useProjectActivitiesQuery as u };
