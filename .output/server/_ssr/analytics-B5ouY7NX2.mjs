import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth } from "./use-auth-CH-EBljn.mjs";
import { f as useProjectQuery, u as useProjectActivitiesQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { i as TopBar, n as PageHeader, r as Stat, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { a as getKeyMetrics, i as getCompletionByAgeGroup, l as trendsByWeek, o as getMentorMatching, r as getAttendanceDistribution, t as confidenceImprovement } from "./mock-data-DNCOsgtW.mjs";
import { t as Route } from "./analytics-CZdRU5GT.mjs";
import { a as YAxis, c as Line, d as Pie, f as Cell, i as LineChart, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-B5ouY7NX2.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.55 0.22 295)",
	"oklch(0.65 0.18 250)",
	"oklch(0.7 0.16 180)",
	"oklch(0.75 0.16 90)",
	"oklch(0.65 0.2 25)"
];
var tooltipStyle = {
	background: "oklch(1 0 0)",
	border: "1px solid oklch(0.93 0.005 280)",
	borderRadius: 8,
	fontSize: 12,
	padding: "8px 10px",
	boxShadow: "0 4px 12px -2px oklch(0 0 0 / 0.08)"
};
function ProjectAnalytics() {
	const { projectId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activitiesQuery = useProjectActivitiesQuery(projectId, Boolean(auth.token));
	const { t } = useTranslation();
	if (!auth.token || projectQuery.isLoading || activitiesQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("projectAnalytics.loading") });
	if (!projectQuery.data || !activitiesQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("projectAnalytics.loadFailed") });
	const project = projectQuery.data;
	const activities = activitiesQuery.data;
	const keyMetrics = getKeyMetrics(t);
	const attendanceDistribution = getAttendanceDistribution();
	const completionByAgeGroup = getCompletionByAgeGroup();
	const mentorMatching = getMentorMatching(t);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{ label: t("projectAnalytics.crumbsProjects") },
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: t("projectAnalytics.crumbsAnalytics") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("projectAnalytics.eyebrow"),
				title: t("projectAnalytics.title"),
				description: t("projectAnalytics.description", { count: activities.length })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6",
				children: keyMetrics.map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: metric.label,
					value: metric.value,
					delta: metric.delta
				}, metric.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: t("projectAnalytics.charts.attendanceTrend"),
						subtitle: t("projectAnalytics.charts.mockDataset"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: trendsByWeek,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "att",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: COLORS[0],
										stopOpacity: .4
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: COLORS[0],
										stopOpacity: 0
									})]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.93 0.005 280)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "week",
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "attendance",
									name: t("projectAnalytics.series.attendance"),
									stroke: COLORS[0],
									strokeWidth: 2,
									fill: "url(#att)"
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: t("projectAnalytics.charts.confidenceImprovement"),
						subtitle: t("projectAnalytics.charts.mockDataset"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: confidenceImprovement,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.93 0.005 280)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "week",
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [3, 7],
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									dataKey: "pre",
									name: t("projectAnalytics.series.preConfidence"),
									stroke: COLORS[1],
									strokeWidth: 2,
									dot: false,
									strokeDasharray: "4 4"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									dataKey: "post",
									name: t("projectAnalytics.series.postConfidence"),
									stroke: COLORS[0],
									strokeWidth: 2.5,
									dot: {
										r: 3,
										fill: COLORS[0]
									}
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: t("projectAnalytics.charts.attendanceDistribution"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: attendanceDistribution,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.93 0.005 280)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "bucket",
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									name: t("projectAnalytics.series.count"),
									fill: COLORS[0],
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: t("projectAnalytics.charts.completionByAgeGroup"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: completionByAgeGroup,
							stackOffset: "expand",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.93 0.005 280)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "group",
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "oklch(0.55 0.015 280)",
									fontSize: 11,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "completed",
									name: t("projectAnalytics.series.completed"),
									stackId: "a",
									fill: COLORS[0],
									radius: [
										6,
										6,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "dropped",
									name: t("projectAnalytics.series.dropped"),
									stackId: "a",
									fill: "oklch(0.88 0.02 280)",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ChartCard, {
						title: t("projectAnalytics.charts.mentorMatching"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: tooltipStyle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: mentorMatching,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 60,
							outerRadius: 90,
							paddingAngle: 2,
							children: mentorMatching.map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index] }, index))
						})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex justify-center gap-4 text-[11px]",
							children: mentorMatching.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-2 w-2 rounded-full",
									style: { background: COLORS[index] }
								}), item.name]
							}, item.name))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[14px] font-semibold tracking-tight",
							children: t("projectAnalytics.charts.backendStatus")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-3 text-[13px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("projectAnalytics.backendStatus.projectLoaded")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: t("projectAnalytics.backendStatus.yes")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("projectAnalytics.backendStatus.activitiesLoaded")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: activities.length
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: t("projectAnalytics.backendStatus.aiAnalytics")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: t("projectAnalytics.backendStatus.notImplemented")
									})]
								})
							]
						})]
					})
				]
			})
		]
	})] });
}
function ChartCard({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[14px] font-semibold tracking-tight",
				children: title
			}), subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-muted-foreground",
				children: subtitle
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 h-64",
			children
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
export { ProjectAnalytics as component };
