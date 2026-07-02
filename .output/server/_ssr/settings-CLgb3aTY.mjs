import { P as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useOrganizationWorkspacePage } from "./route-CrUr4hSq.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CLgb3aTY.js
var import_jsx_runtime = require_jsx_runtime();
function OrganizationSettingsPage() {
	const { workspace } = useOrganizationWorkspacePage();
	const locale = useWorkspaceLocale();
	if (!workspace.organization.permissions.canManageSettings) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, {
		to: "/organizations/$organizationId",
		params: { organizationId: workspace.organization.id }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [{
		label: workspace.organization.name,
		to: "/organizations/$organizationId",
		params: { organizationId: workspace.organization.id }
	}, { label: locale.sidebar.organizationSettings }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: locale.organizationSettings.settingsEyebrow,
			title: locale.organizationSettings.settingsTitle,
			description: locale.organizationSettings.settingsDescription
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-8 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-6 text-muted-foreground",
				children: locale.organizationSettings.settingsPlaceholder
			})
		})]
	})] });
}
//#endregion
export { OrganizationSettingsPage as component };
