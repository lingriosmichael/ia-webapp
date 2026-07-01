import { f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth, l as useLogout } from "./use-auth-CH-EBljn.mjs";
import { f as useProjectQuery, l as useOrganizationWorkspaceQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { i as WorkspaceShell } from "./WorkspaceShell-K3aPfZoe.mjs";
import { t as Route } from "./route-UAZJQWX9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Bh8Aexzq.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectLayout() {
	const { projectId } = Route.useParams();
	const logout = useLogout();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const workspaceQuery = useOrganizationWorkspaceQuery(projectQuery.data?.organizationId ?? "", Boolean(auth.token && projectQuery.data?.organizationId));
	const { t } = useTranslation();
	if (!auth.token || auth.isLoading || projectQuery.isLoading || workspaceQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("project.loading") });
	if (!projectQuery.data || !workspaceQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("project.loadFailed") });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
		organizationId: workspaceQuery.data.organization.id,
		organizationName: workspaceQuery.data.organization.name,
		organizationRole: workspaceQuery.data.organization.role,
		organizationLogoUrl: workspaceQuery.data.organization.logoUrl,
		userName: auth.data?.user.fullName ?? auth.data?.user.email ?? "Account",
		projects: workspaceQuery.data.projects,
		currentProjectId: projectId,
		onLogout: logout,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { ProjectLayout as component };
