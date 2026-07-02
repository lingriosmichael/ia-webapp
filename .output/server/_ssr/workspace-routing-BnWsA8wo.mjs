//#region node_modules/.nitro/vite/services/ssr/assets/workspace-routing-BnWsA8wo.js
async function resolveWorkspaceDestination(organizationId) {
	return {
		to: "/organizations/$organizationId",
		params: { organizationId }
	};
}
//#endregion
export { resolveWorkspaceDestination as t };
