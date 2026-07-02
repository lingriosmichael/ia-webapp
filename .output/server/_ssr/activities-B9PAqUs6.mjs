import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useOrganizationWorkspacePage } from "./route-CrUr4hSq.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activities-B9PAqUs6.js
var import_jsx_runtime = require_jsx_runtime();
function OrganizationActivitiesPage() {
	const { workspace, organizationId } = useOrganizationWorkspacePage();
	const locale = useWorkspaceLocale();
	const activityRows = workspace.projects.flatMap((project) => project.activities.map((activity) => ({
		projectId: project.id,
		projectName: project.name,
		activity
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [{
		label: workspace.organization.name,
		to: "/organizations/$organizationId",
		params: { organizationId }
	}, { label: locale.sidebar.activities }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: locale.organizationActivities.eyebrow,
			title: locale.organizationActivities.title,
			description: locale.organizationActivities.description
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4",
			children: activityRows.map(({ projectId, projectName, activity }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold tracking-tight text-foreground",
							children: activity.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted-foreground",
							children: activity.description || locale.organizationActivities.noDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-xs text-muted-foreground",
							children: projectName
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/projects/$projectId/activities/$activityId/overview",
						params: {
							projectId,
							activityId: activity.id
						},
						className: "inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium",
						children: locale.organizationActivities.openActivity
					})]
				})
			}, activity.id))
		})]
	})] });
}
//#endregion
export { OrganizationActivitiesPage as component };
