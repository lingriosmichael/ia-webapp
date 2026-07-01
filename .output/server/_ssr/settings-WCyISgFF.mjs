import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CH-EBljn.mjs";
import { t as Button } from "./input-Da49WZya.mjs";
import { f as useProjectQuery, l as useOrganizationWorkspaceQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { M as CalendarRange, l as ShieldAlert, m as MapPin, o as Trash2, s as Target } from "../_libs/lucide-react.mjs";
import { o as useWorkspaceLocale, s as useWorkspaceShell } from "./WorkspaceShell-K3aPfZoe.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { n as translateStatus, t as formatDateTime } from "./translation-utils-79g5PT3p.mjs";
import { t as Route } from "./settings-BJRd6qss.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-WCyISgFF.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectSettingsPanel({ project, organizationName, onDeleteProject }) {
	const locale = useWorkspaceLocale();
	const { i18n, t } = useTranslation();
	const timeline = [project.startMonth, project.endMonth].filter(Boolean).join(" -> ");
	const location = [project.regionCity, project.country].filter(Boolean).join(", ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: locale.projectSettings.general
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
					children: locale.projectSettings.generalDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 grid gap-4 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.status,
							value: translateStatus(t, project.status)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.organization,
							value: organizationName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.timeline,
							value: timeline || locale.projectSettings.notSet,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, { className: "h-4 w-4 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.location,
							value: location || locale.projectSettings.notSet,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.funding,
							value: project.fundingSource || locale.projectSettings.notSet
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.goal,
							value: project.programGoal || locale.projectSettings.notSet,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-primary" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.created,
							value: formatDateTime(project.createdAt, i18n.language)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailCard, {
							label: locale.projectSettings.fields.updated,
							value: formatDateTime(project.updatedAt, i18n.language)
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-destructive/25 bg-destructive/[0.04] p-6 shadow-none",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-destructive" }), locale.projectSettings.dangerTitle]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-6 text-muted-foreground",
					children: locale.projectSettings.dangerDescription
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "destructive",
					className: "mt-6 w-full justify-center",
					onClick: onDeleteProject,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), locale.projectSettings.deleteAction]
				})
			]
		}) })]
	});
}
function DetailCard({ label, value, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-secondary/20 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-sm leading-6 text-foreground",
			children: value
		})]
	});
}
function ProjectSettingsPage() {
	const { projectId } = Route.useParams();
	const auth = useRequireAuth();
	const locale = useWorkspaceLocale();
	const { t } = useTranslation();
	const { openProjectDeleteDialog } = useWorkspaceShell();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const workspaceQuery = useOrganizationWorkspaceQuery(projectQuery.data?.organizationId ?? "", Boolean(auth.token && projectQuery.data?.organizationId));
	if (!auth.token || auth.isLoading || projectQuery.isLoading || workspaceQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("project.loading") });
	if (!projectQuery.data || !workspaceQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("project.loadFailed") });
	const project = projectQuery.data;
	const workspace = workspaceQuery.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: workspace.organization.name,
			to: "/organizations/$organizationId",
			params: { organizationId: workspace.organization.id }
		},
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: locale.sidebar.projectSettings }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: locale.projectSettings.eyebrow,
			title: locale.projectSettings.title,
			description: locale.projectSettings.description
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectSettingsPanel, {
			project,
			organizationName: workspace.organization.name,
			onDeleteProject: () => openProjectDeleteDialog({
				id: project.id,
				name: project.name,
				organizationId: project.organizationId
			})
		})]
	})] });
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { ProjectSettingsPage as component };
