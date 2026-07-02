import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-auth-CbwAMR7f.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var ACCESS_TOKEN_KEY = "grantready.access_token";
var ACTIVE_ORGANIZATION_KEY = "grantready.active_organization_id";
function getAccessToken() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}
function setAccessToken(token) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
function clearAccessToken() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}
function getActiveOrganizationId() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(ACTIVE_ORGANIZATION_KEY);
}
function setActiveOrganizationId(organizationId) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(ACTIVE_ORGANIZATION_KEY, organizationId);
}
function clearActiveOrganizationId() {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(ACTIVE_ORGANIZATION_KEY);
}
function resolveActiveOrganizationId(organizations, preferredOrganizationId) {
	if (organizations.length === 0) return null;
	const availableOrganizationIds = new Set(organizations.map((organization) => organization.id));
	if (preferredOrganizationId && availableOrganizationIds.has(preferredOrganizationId)) return preferredOrganizationId;
	const storedOrganizationId = getActiveOrganizationId();
	if (storedOrganizationId && availableOrganizationIds.has(storedOrganizationId)) return storedOrganizationId;
	return organizations.slice().sort((left, right) => {
		const leftTimestamp = Date.parse(left.updatedAt || left.createdAt);
		return Date.parse(right.updatedAt || right.createdAt) - leftTimestamp;
	})[0]?.id ?? organizations[0]?.id ?? null;
}
function rememberActiveOrganizationId(organizationId) {
	setActiveOrganizationId(organizationId);
}
var ApiError = class extends Error {
	statusCode;
	code;
	details;
	constructor(message, statusCode, code = "api_error", details) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.details = details;
	}
};
var apiBaseUrl = "http://localhost:4000";
function resolveApiUrl(path) {
	if (!path) return null;
	if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) return path;
	return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
async function request(path, init) {
	const token = getAccessToken();
	const response = await fetch(`${apiBaseUrl}${path}`, {
		...init,
		headers: {
			...token ? { authorization: `Bearer ${token}` } : {},
			...init?.headers ?? {}
		}
	});
	const text = await response.text();
	const payload = text ? JSON.parse(text) : void 0;
	if (!response.ok) {
		if (payload && typeof payload === "object" && "success" in payload && payload.success === false) throw new ApiError(payload.error.message, response.status, payload.error.code, payload.error.details);
		throw new ApiError("Request failed.", response.status);
	}
	if (!payload || typeof payload !== "object" || !("success" in payload) || payload.success !== true) throw new ApiError("Malformed API response.", response.status);
	return payload.data;
}
var apiClient = {
	register(payload) {
		return request("/auth/register", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	login(payload) {
		return request("/auth/login", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	getSession() {
		return request("/auth/me");
	},
	createOrganization(payload) {
		return request("/organizations", {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	getWorkspace(organizationId) {
		return request(`/organizations/${organizationId}/workspace`);
	},
	listOrganizationMembers(organizationId) {
		return request(`/organizations/${organizationId}/members`);
	},
	removeOrganizationMember(organizationId, membershipId) {
		return request(`/organizations/${organizationId}/members/${membershipId}`, { method: "DELETE" });
	},
	listOrganizationInvitations(organizationId) {
		return request(`/organizations/${organizationId}/invitations`);
	},
	createOrganizationInvitation(organizationId, payload) {
		return request(`/organizations/${organizationId}/invitations`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	revokeOrganizationInvitation(organizationId, invitationId) {
		return request(`/organizations/${organizationId}/invitations/${invitationId}`, { method: "DELETE" });
	},
	getInvitation(token) {
		return request(`/invitations/${token}`);
	},
	acceptInvitation(token, payload) {
		return request(`/invitations/${token}/accept`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	updateOrganization(organizationId, payload) {
		const formData = new FormData();
		formData.append("name", payload.name);
		formData.append("mission", payload.mission);
		if (payload.logoFile) formData.append("logo", payload.logoFile);
		return request(`/organizations/${organizationId}`, {
			method: "PATCH",
			body: formData
		});
	},
	createProject(organizationId, payload) {
		return request(`/organizations/${organizationId}/projects`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	getProject(projectId) {
		return request(`/projects/${projectId}`);
	},
	deleteProject(projectId, payload) {
		return request(`/projects/${projectId}`, {
			method: "DELETE",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	getProjectOverview(projectId) {
		return request(`/projects/${projectId}/overview`);
	},
	listProjectActivities(projectId) {
		return request(`/projects/${projectId}/activities`);
	},
	createActivity(projectId, payload) {
		return request(`/projects/${projectId}/activities`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		});
	},
	getActivity(activityId) {
		return request(`/activities/${activityId}`);
	},
	listActivityUploads(activityId) {
		return request(`/activities/${activityId}/upload-metadata`);
	},
	listActivityJobs(activityId) {
		return request(`/activities/${activityId}/jobs`);
	},
	listActivityResults(activityId) {
		return request(`/activities/${activityId}/results`);
	},
	uploadActivityFile(activityId, file) {
		const formData = new FormData();
		formData.append("file", file);
		return request(`/activities/${activityId}/uploads`, {
			method: "POST",
			body: formData
		});
	},
	getJob(jobId) {
		return request(`/jobs/${jobId}`);
	}
};
var sessionQueryKey = ["session"];
function persistAuth(response) {
	setAccessToken(response.accessToken);
	const activeOrganizationId = resolveActiveOrganizationId(response.organizations);
	if (activeOrganizationId) setActiveOrganizationId(activeOrganizationId);
}
function useSessionQuery() {
	const hasWindow = typeof window !== "undefined";
	const token = getAccessToken();
	return useQuery({
		queryKey: sessionQueryKey,
		queryFn: () => apiClient.getSession(),
		enabled: hasWindow && Boolean(token),
		retry: false
	});
}
function useRequireAuth() {
	const navigate = useNavigate();
	const token = getAccessToken();
	const sessionQuery = useSessionQuery();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined" && !token) navigate({ to: "/login" });
	}, [navigate, token]);
	(0, import_react.useEffect)(() => {
		if (sessionQuery.error instanceof ApiError && sessionQuery.error.statusCode === 401) {
			clearAccessToken();
			navigate({ to: "/login" });
		}
	}, [navigate, sessionQuery.error]);
	return {
		token,
		...sessionQuery
	};
}
function useLoginMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: apiClient.login,
		onSuccess: (response) => {
			persistAuth(response);
			queryClient.setQueryData(sessionQueryKey, {
				user: response.user,
				organizations: response.organizations
			});
		}
	});
}
function useRegisterMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: apiClient.register,
		onSuccess: (response) => {
			persistAuth(response);
			queryClient.setQueryData(sessionQueryKey, {
				user: response.user,
				organizations: response.organizations
			});
		}
	});
}
function useLogout() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	return () => {
		clearAccessToken();
		clearActiveOrganizationId();
		queryClient.clear();
		navigate({ to: "/" });
	};
}
//#endregion
export { resolveActiveOrganizationId as a, useLoginMutation as c, useRequireAuth as d, useSessionQuery as f, rememberActiveOrganizationId as i, useLogout as l, apiClient as n, resolveApiUrl as o, getAccessToken as r, sessionQueryKey as s, ApiError as t, useRegisterMutation as u };
