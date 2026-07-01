import { n as apiClient } from "./use-auth-CH-EBljn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/workspace-routing-yiPbNogR.js
async function resolveWorkspaceDestination(organizationId) {
	try {
		const firstProjectId = (await apiClient.getWorkspace(organizationId)).projects[0]?.id;
		if (firstProjectId) return {
			to: "/projects/$projectId",
			params: { projectId: firstProjectId }
		};
	} catch {}
	return {
		to: "/organizations/$organizationId",
		params: { organizationId }
	};
}
//#endregion
export { resolveWorkspaceDestination as t };
