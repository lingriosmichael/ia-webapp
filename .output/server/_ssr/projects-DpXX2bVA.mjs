import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useOrganizationWorkspacePage } from "./route-CrUr4hSq.mjs";
import { i as TopBar, n as PageHeader } from "./WorkspaceUI-JmFi-JKL.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
import { n as useWorkspaceShell } from "./WorkspaceShell-BJLE8-Mu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-DpXX2bVA.js
var import_jsx_runtime = require_jsx_runtime();
function OrganizationProjectsPage() {
	const { workspace, organizationId } = useOrganizationWorkspacePage();
	const { openProjectDialog } = useWorkspaceShell();
	const locale = useWorkspaceLocale();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [{
		label: workspace.organization.name,
		to: "/organizations/$organizationId",
		params: { organizationId }
	}, { label: locale.sidebar.projects }] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: locale.organizationProjects.eyebrow,
			title: locale.organizationProjects.title,
			description: locale.organizationProjects.description,
			actions: workspace.organization.permissions.canCreateProject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: openProjectDialog,
				className: "inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
				children: locale.organizationProjects.primaryAction
			}) : void 0
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-2",
			children: workspace.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/projects/$projectId",
				params: { projectId: project.id },
				className: "rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-semibold tracking-tight text-foreground",
						children: project.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: project.description || locale.organizationProjects.noDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 text-xs text-muted-foreground",
						children: [
							project.activities.length,
							" ",
							locale.organizationProjects.activities
						]
					})
				]
			}, project.id))
		})]
	})] });
}
//#endregion
export { OrganizationProjectsPage as component };
