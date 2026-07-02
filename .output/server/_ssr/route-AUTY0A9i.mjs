import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route } from "./route-CrUr4hSq.mjs";
import { a as resolveActiveOrganizationId, d as useRequireAuth, l as useLogout } from "./use-auth-CbwAMR7f.mjs";
import { h as useOrganizationWorkspaceQuery, m as useOrganizationMembersQuery } from "./use-grantready-DIPYOCni.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BJLE8-Mu.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-BnWsA8wo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-AUTY0A9i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var OrganizationWorkspacePageContext = (0, import_react.createContext)(null);
function useOrganizationWorkspacePage() {
	const context = (0, import_react.useContext)(OrganizationWorkspacePageContext);
	if (!context) throw new Error("useOrganizationWorkspacePage must be used within the organization layout.");
	return context;
}
function OrganizationLayout() {
	const { organizationId } = Route.useParams();
	const navigate = useNavigate();
	const logout = useLogout();
	const auth = useRequireAuth();
	const workspaceQuery = useOrganizationWorkspaceQuery(organizationId, Boolean(auth.token));
	const membersQuery = useOrganizationMembersQuery(organizationId, Boolean(auth.token));
	(0, import_react.useEffect)(() => {
		if (!auth.data?.organizations.length) return;
		const activeOrganizationId = resolveActiveOrganizationId(auth.data.organizations, organizationId);
		if (!activeOrganizationId || activeOrganizationId === organizationId) return;
		resolveWorkspaceDestination(activeOrganizationId).then((destination) => navigate(destination));
	}, [
		auth.data?.organizations,
		navigate,
		organizationId
	]);
	if (!auth.token || auth.isLoading || workspaceQuery.isLoading || membersQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: "Loading workspace…"
	});
	if (!workspaceQuery.data || !membersQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: "Workspace could not be loaded."
	});
	const userName = auth.data?.user.fullName ?? auth.data?.user.email ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationWorkspacePageContext.Provider, {
		value: {
			organizationId,
			userName,
			workspace: workspaceQuery.data,
			members: membersQuery.data
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			organizationId: workspaceQuery.data.organization.id,
			organizationName: workspaceQuery.data.organization.name,
			organizationRole: workspaceQuery.data.organization.role,
			organizationPermissions: workspaceQuery.data.organization.permissions,
			organizationLogoUrl: workspaceQuery.data.organization.logoUrl,
			userName,
			projects: workspaceQuery.data.projects,
			onLogout: logout,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { OrganizationLayout as component, useOrganizationWorkspacePage };
