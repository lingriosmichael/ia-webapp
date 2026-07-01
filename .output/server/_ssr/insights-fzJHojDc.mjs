import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CH-EBljn.mjs";
import { f as useProjectQuery, n as useActivityQuery, r as useActivityResultsQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { c as ShieldCheck, g as Lightbulb, z as Sparkles } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { t as ActivityTabs } from "./ActivityTabs-bEUyNi9r.mjs";
import { s as getProjectInsights } from "./mock-data-DNCOsgtW.mjs";
import { t as Route } from "./insights-BVlzm3es.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-fzJHojDc.js
var import_jsx_runtime = require_jsx_runtime();
function ActivityInsightsPage() {
	const { projectId, activityId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
	const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
	const { t } = useTranslation();
	if (!auth.token || projectQuery.isLoading || activityQuery.isLoading || resultsQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityInsights.loading") });
	if (!projectQuery.data || !activityQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityInsights.loadFailed") });
	const project = projectQuery.data;
	const activity = activityQuery.data;
	const availableInsights = (resultsQuery.data ?? []).filter((result) => result.status === "available").length;
	const insights = getProjectInsights(t);
	const privacyItems = Array.isArray(insights.privacy) ? insights.privacy : [];
	const keyFindings = Array.isArray(insights.keyFindings) ? insights.keyFindings : [];
	const recommendations = Array.isArray(insights.recommendations) ? insights.recommendations : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: activity.name },
		{ label: t("activityInsights.crumb") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("activityInsights.eyebrow"),
				title: t("activityInsights.title"),
				description: t("activityInsights.description")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTabs, {
				projectId,
				activityId,
				className: "mt-6"
			}),
			availableInsights === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-6 border-primary/15 bg-primary-soft/25 p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold tracking-tight text-foreground",
							children: t("activityInsights.emptyTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-7 text-muted-foreground",
							children: t("activityInsights.emptyDescription")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/projects/$projectId/activities/$activityId/overview",
							params: {
								projectId,
								activityId
							},
							className: "mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
							children: t("activityInsights.emptyCta")
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
							label: t("activityInsights.summary.generated"),
							value: String(availableInsights)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-primary" }),
							label: t("activityInsights.summary.keyFindings"),
							value: String(keyFindings.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }),
							label: t("activityInsights.summary.privacyChecks"),
							value: String(privacyItems.length)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), t("activityInsights.executiveSummaryTitle")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-7 text-muted-foreground",
							children: insights.executiveSummary
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), t("activityInsights.privacyBoundaryTitle")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
							children: privacyItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 xl:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightList, {
						title: t("activityInsights.keyFindingsTitle"),
						items: keyFindings
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightList, {
						title: t("activityInsights.recommendationsTitle"),
						items: recommendations
					})]
				})
			] })
		]
	})] });
}
function SummaryCard({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-lg font-semibold tracking-tight",
			children: value
		})]
	});
}
function InsightList({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold tracking-tight text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
		})]
	});
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { ActivityInsightsPage as component };
