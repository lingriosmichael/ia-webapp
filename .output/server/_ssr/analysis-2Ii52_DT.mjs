import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CH-EBljn.mjs";
import { f as useProjectQuery, i as useActivityUploadsQuery, n as useActivityQuery, r as useActivityResultsQuery, t as useActivityJobsQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { C as FileSpreadsheet, K as ChartColumn, W as CircleCheck, w as Database, z as Sparkles } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { t as Route } from "./analysis-DnWZe14Q.mjs";
import { t as ActivityTabs } from "./ActivityTabs-bEUyNi9r.mjs";
import { a as getKeyMetrics, c as getSchema, n as datasetOverview } from "./mock-data-DNCOsgtW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analysis-2Ii52_DT.js
var import_jsx_runtime = require_jsx_runtime();
function ActivityAnalyticsPage() {
	const { projectId, activityId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
	const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
	const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
	const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
	const { t } = useTranslation();
	if (!auth.token || projectQuery.isLoading || activityQuery.isLoading || uploadsQuery.isLoading || jobsQuery.isLoading || resultsQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityAnalytics.loading") });
	if (!projectQuery.data || !activityQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityAnalytics.loadFailed") });
	const project = projectQuery.data;
	const activity = activityQuery.data;
	const uploads = uploadsQuery.data ?? [];
	const jobs = jobsQuery.data ?? [];
	const results = resultsQuery.data ?? [];
	const unresolvedReviewCount = getSchema(t).filter((column) => column.clarifyingQuestion || column.confidence < .8).length;
	const hasDataset = uploads.length > 0;
	const isProcessing = jobs.some((job) => ["queued", "processing"].includes(job.status));
	const analysisReady = hasDataset && !isProcessing;
	const insightsAvailable = results.filter((result) => result.status === "available").length;
	const keyMetrics = getKeyMetrics(t).slice(0, 4);
	const storyPointsValue = t("activityAnalytics.storyPoints", { returnObjects: true });
	const storyPoints = Array.isArray(storyPointsValue) ? storyPointsValue : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: activity.name },
		{ label: t("activityAnalytics.crumb") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("activityAnalytics.eyebrow"),
				title: t("activityAnalytics.title"),
				description: t("activityAnalytics.description")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTabs, {
				projectId,
				activityId,
				className: "mt-6"
			}),
			!hasDataset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowGate, {
				title: t("activityAnalytics.gates.noDataset.title"),
				description: t("activityAnalytics.gates.noDataset.description"),
				to: "/projects/$projectId/activities/$activityId/overview",
				params: {
					projectId,
					activityId
				},
				cta: t("activityAnalytics.gates.noDataset.cta")
			}) : isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowGate, {
				title: t("activityAnalytics.gates.processing.title"),
				description: t("activityAnalytics.gates.processing.description"),
				to: "/projects/$projectId/activities/$activityId/overview",
				params: {
					projectId,
					activityId
				},
				cta: t("activityAnalytics.gates.processing.cta")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "h-4 w-4 text-primary" }),
							label: t("activityAnalytics.summary.rows"),
							value: String(datasetOverview.rows)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary" }),
							label: t("activityAnalytics.summary.columns"),
							value: String(datasetOverview.columns)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }),
							label: t("activityAnalytics.summary.review"),
							value: t("activityAnalytics.summary.reviewValue", { count: unresolvedReviewCount })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniCard, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
							label: t("activityAnalytics.summary.insights"),
							value: t("activityAnalytics.summary.insightsValue", { count: insightsAvailable })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-primary" }), t("activityAnalytics.metricsTitle")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4",
						children: keyMetrics.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-secondary/20 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
									children: metric.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-xl font-semibold tracking-tight text-foreground",
									children: metric.value
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: metric.delta
								})
							]
						}, metric.key))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold tracking-tight text-foreground",
							children: t("activityAnalytics.storyTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3 text-sm leading-6 text-muted-foreground",
							children: storyPoints.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold tracking-tight text-foreground",
								children: t("activityAnalytics.nextActionTitle")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-6 text-muted-foreground",
								children: analysisReady ? t("activityAnalytics.nextActionReady") : t("activityAnalytics.nextActionBlocked")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: unresolvedReviewCount > 0 ? "/projects/$projectId/activities/$activityId/data-review" : "/projects/$projectId/activities/$activityId/insights",
								params: {
									projectId,
									activityId
								},
								className: "mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
								children: unresolvedReviewCount > 0 ? t("activityAnalytics.reviewDataCta") : t("activityAnalytics.openInsightsCta")
							})
						]
					})]
				})
			] })
		]
	})] });
}
function WorkflowGate({ title, description, to, params, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6 border-primary/15 bg-primary-soft/25 p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-tight text-foreground",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-7 text-muted-foreground",
					children: description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to,
					params,
					className: "mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
					children: cta
				})
			]
		})
	});
}
function MiniCard({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-lg font-semibold tracking-tight capitalize",
			children: value
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
export { ActivityAnalyticsPage as component };
