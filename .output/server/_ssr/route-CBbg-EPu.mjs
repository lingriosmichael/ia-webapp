import { f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth, l as useLogout } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { h as useOrganizationWorkspaceQuery, v as useProjectQuery } from "./use-grantready-DIPYOCni.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BJLE8-Mu.mjs";
import { t as Route } from "./route-BwqYEoWp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CBbg-EPu.js
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkspaceShell, {
		organizationId: workspaceQuery.data.organization.id,
		organizationName: workspaceQuery.data.organization.name,
		organizationRole: workspaceQuery.data.organization.role,
		organizationPermissions: workspaceQuery.data.organization.permissions,
		organizationLogoUrl: workspaceQuery.data.organization.logoUrl,
		userName: auth.data?.user.fullName ?? auth.data?.user.email ?? "Account",
		projects: workspaceQuery.data.projects,
		currentProjectId: projectId,
		onLogout: logout,
		children: [projectQuery.data.permissions.canEdit ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-8 pt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-primary/20 bg-primary-soft/40 px-5 py-4 shadow-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold text-primary",
					children: t("project.readOnlyBannerTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("project.readOnlyBannerDescription", { owner: projectQuery.data.ownerName ?? t("project.unknownOwner") })
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
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
