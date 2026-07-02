import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { S as FileText, c as ShieldCheck, u as Settings2, z as UserRound } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { r as useActivityQuery, v as useProjectQuery } from "./use-grantready-DIPYOCni.mjs";
import { n as translateStatus, t as formatDateTime } from "./translation-utils-79g5PT3p.mjs";
import { t as ActivityTabs } from "./ActivityTabs-cP5SB4J9.mjs";
import { t as Route } from "./settings-B7LeBgPj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CPEt0tA0.js
var import_jsx_runtime = require_jsx_runtime();
function ActivitySettingsPage() {
	const { projectId, activityId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
	const { t, i18n } = useTranslation();
	if (!auth.token || projectQuery.isLoading || activityQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activitySettings.loading") });
	if (!projectQuery.data || !activityQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activitySettings.loadFailed") });
	const project = projectQuery.data;
	const activity = activityQuery.data;
	const workflowGuardrailsValue = t("activitySettings.workflowGuardrails", { returnObjects: true });
	const workflowGuardrails = Array.isArray(workflowGuardrailsValue) ? workflowGuardrailsValue : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: activity.name },
		{ label: t("activitySettings.crumb") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("activitySettings.eyebrow"),
				title: t("activitySettings.title"),
				description: t("activitySettings.description")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTabs, {
				projectId,
				activityId,
				className: "mt-6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4 text-primary" }), t("activitySettings.activityDetailsTitle")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.name"),
								value: activity.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.status"),
								value: translateStatus(t, activity.status)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.project"),
								value: project.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.owner"),
								value: activity.owner ?? t("activitySettings.noOwner")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.created"),
								value: formatDateTime(activity.createdAt, i18n.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activitySettings.fields.updated"),
								value: formatDateTime(activity.updatedAt, i18n.language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
									children: t("activitySettings.fields.description")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-6 text-foreground",
									children: activity.description ?? t("activitySettings.noDescription")
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), t("activitySettings.workflowGuardrailsTitle")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
								children: workflowGuardrails.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), t("activitySettings.contextTitle")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: project.programGoal ?? t("activitySettings.noProjectGoal") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: activity.description ?? t("activitySettings.noDescription") })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-4 w-4 text-primary" }), t("activitySettings.supportTitle")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-6 text-muted-foreground",
								children: t("activitySettings.supportDescription")
							})]
						})
					]
				})]
			})
		]
	})] });
}
function DetailRow({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 text-sm text-foreground",
		children: value
	})] });
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { ActivitySettingsPage as component };
