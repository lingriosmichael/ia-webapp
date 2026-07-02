import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { V as Sparkles, a as TrendingUp, c as ShieldCheck, g as Lightbulb, q as CircleAlert, t as Zap } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { g as useProjectActivitiesQuery, v as useProjectQuery } from "./use-grantready-DIPYOCni.mjs";
import { s as getProjectInsights } from "./mock-data-DNCOsgtW.mjs";
import { t as Route } from "./insights-XvoBgZbc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/insights-CXO99-Sb.js
var import_jsx_runtime = require_jsx_runtime();
function ProjectInsights() {
	const { projectId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activitiesQuery = useProjectActivitiesQuery(projectId, Boolean(auth.token));
	const { t } = useTranslation();
	if (!auth.token || projectQuery.isLoading || activitiesQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("projectInsights.loading") });
	if (!projectQuery.data || !activitiesQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("projectInsights.loadFailed") });
	const project = projectQuery.data;
	const activities = activitiesQuery.data;
	const projectInsights = getProjectInsights(t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{ label: t("projectInsights.crumbsProjects") },
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: t("projectInsights.crumbsInsights") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-5xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("projectInsights.eyebrow"),
				title: t("projectInsights.title"),
				description: t("projectInsights.description", { count: activities.length })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-8 border-primary/15 bg-gradient-to-br from-primary-soft to-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
						" ",
						t("projectInsights.executiveSummaryTitle")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[15px] leading-relaxed text-foreground",
					children: projectInsights.executiveSummary
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						title: t("projectInsights.keyFindingsTitle"),
						items: projectInsights.keyFindings,
						tone: "primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4" }),
						title: t("projectInsights.interestingPatternsTitle"),
						description: t("projectInsights.interestingPatternsDescription"),
						items: projectInsights.interestingPatterns
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
						title: t("projectInsights.evidenceGapsTitle"),
						description: t("projectInsights.evidenceGapsDescription"),
						items: projectInsights.evidenceGaps
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4" }),
						title: t("projectInsights.recommendationsTitle"),
						items: projectInsights.recommendations
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-6 border-success/30 bg-[oklch(0.98_0.02_155)] p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-[oklch(0.4_0.12_155)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[15px] font-semibold tracking-tight",
						children: t("projectInsights.privacyTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[12px] text-muted-foreground",
						children: t("projectInsights.privacyDescription")
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 grid gap-2.5 md:grid-cols-3",
					children: projectInsights.privacy.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-lg border border-success/20 bg-card px-3.5 py-3 text-[12.5px] leading-relaxed",
						children: item
					}, index))
				})]
			})
		]
	})] });
}
function Section({ icon, title, description, items, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-9 w-9 place-items-center rounded-lg ${tone === "primary" ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"}`,
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[15px] font-semibold tracking-tight",
				children: title
			}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-[12px] text-muted-foreground",
				children: description
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 space-y-2.5",
			children: items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-start gap-2.5 rounded-lg border border-border/60 bg-secondary/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
			}, index))
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
export { ProjectInsights as component };
