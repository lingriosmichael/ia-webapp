import { P as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useOrganizationWorkspacePage } from "./route-CrUr4hSq.mjs";
import { i as TopBar, n as PageHeader } from "./WorkspaceUI-JmFi-JKL.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
import { t as OrganizationSettingsPanel } from "./OrganizationSettingsPanel-BRgCh1m0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-D32oiv4F.js
var import_jsx_runtime = require_jsx_runtime();
function OrganizationProfilePage() {
	const { workspace } = useOrganizationWorkspacePage();
	const locale = useWorkspaceLocale();
	if (!workspace.organization.permissions.canManageProfile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/organizations/$organizationId",
		params: { organizationId: workspace.organization.id }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [{
		label: workspace.organization.name,
		to: "/organizations/$organizationId",
		params: { organizationId: workspace.organization.id }
	}, { label: locale.sidebar.organizationProfile }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: locale.organizationSettings.eyebrow,
			title: locale.organizationSettings.title,
			description: locale.organizationSettings.description
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationSettingsPanel, { organization: workspace.organization })]
	})] });
}
//#endregion
export { OrganizationProfilePage as component };
