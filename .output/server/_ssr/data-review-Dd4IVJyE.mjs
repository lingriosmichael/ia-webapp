import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { d as useRequireAuth } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { B as TriangleAlert, C as FileSpreadsheet, G as CircleQuestionMark, I as ArrowRight, K as CircleCheck, M as Check, V as Sparkles, W as CloudUpload, c as ShieldCheck, d as Search, n as X, p as MapPinned } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { a as useActivityUploadsQuery, n as useActivityJobsQuery, r as useActivityQuery, v as useProjectQuery } from "./use-grantready-DIPYOCni.mjs";
import { t as formatDateTime } from "./translation-utils-79g5PT3p.mjs";
import { t as ActivityTabs } from "./ActivityTabs-cP5SB4J9.mjs";
import { c as getSchema, n as datasetOverview } from "./mock-data-DNCOsgtW.mjs";
import { t as Route } from "./data-review-BkrxhRC8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/data-review-Dd4IVJyE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var privacyTone = {
	"Direct Identifier": "bg-[oklch(0.96_0.05_25)] text-[oklch(0.45_0.18_25)]",
	"Quasi Identifier": "bg-[oklch(0.96_0.05_75)] text-[oklch(0.45_0.16_75)]",
	"High Risk": "bg-[oklch(0.94_0.08_25)] text-[oklch(0.4_0.2_25)]",
	Operational: "bg-secondary text-foreground",
	Outcome: "bg-primary-soft text-primary"
};
var transformationTone = {
	Hashed: "bg-primary-soft text-primary",
	Removed: "bg-[oklch(0.94_0.08_25)] text-[oklch(0.4_0.2_25)]",
	Generalised: "bg-[oklch(0.96_0.05_75)] text-[oklch(0.45_0.16_75)]",
	Kept: "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.12_155)]"
};
function SchemaReview() {
	const { projectId, activityId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
	const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
	const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
	const { t, i18n } = useTranslation();
	const [selectedColumnKey, setSelectedColumnKey] = (0, import_react.useState)(null);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [pendingSelections, setPendingSelections] = (0, import_react.useState)({});
	const [confirmedSelections, setConfirmedSelections] = (0, import_react.useState)({});
	if (!auth.token || projectQuery.isLoading || activityQuery.isLoading || uploadsQuery.isLoading || jobsQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("schemaReview.loading") });
	if (!projectQuery.data || !activityQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("schemaReview.loadFailed") });
	const project = projectQuery.data;
	const uploads = uploadsQuery.data ?? [];
	const schema = getSchema(t);
	const hasDataset = uploads.length > 0;
	const latestUpload = uploads[0] ?? null;
	const reviewColumns = schema.filter((column) => Boolean(column.clarifyingQuestion) || column.confidence < .8);
	const unresolvedColumns = reviewColumns.filter((column) => !confirmedSelections[column.original]);
	const unresolvedCount = unresolvedColumns.length;
	const autoClassifiedCount = schema.length - reviewColumns.length;
	const reviewedCount = reviewColumns.length - unresolvedCount;
	const filteredSchema = schema.filter((column) => {
		const term = searchTerm.trim().toLowerCase();
		if (!term) return true;
		return column.original.toLowerCase().includes(term) || column.semantic.toLowerCase().includes(term) || translateSchemaPrivacyLabel(t, column.privacy).toLowerCase().includes(term);
	});
	const selectedColumn = schema.find((column) => column.original === selectedColumnKey) ?? unresolvedColumns[0] ?? schema[0];
	const pageAction = !hasDataset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/projects/$projectId/activities/$activityId/overview",
		params: {
			projectId,
			activityId
		},
		className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), t("schemaReview.cta.uploadDataset")]
	}) : unresolvedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex h-10 items-center gap-2 rounded-md border border-warning/25 bg-[oklch(0.98_0.03_75)] px-4 text-sm font-medium text-[oklch(0.42_0.14_75)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), t("schemaReview.cta.reviewRequired", { count: unresolvedCount })]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/projects/$projectId/activities/$activityId/analysis",
		params: {
			projectId,
			activityId
		},
		className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
		children: [t("schemaReview.cta.continueToAnalysis"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
	});
	function confirmSelectedMeaning() {
		const nextValue = pendingSelections[selectedColumn.original];
		if (!nextValue) return;
		const nextConfirmedSelections = {
			...confirmedSelections,
			[selectedColumn.original]: nextValue
		};
		setConfirmedSelections(nextConfirmedSelections);
		const nextUnresolvedColumn = reviewColumns.find((column) => column.original !== selectedColumn.original && !nextConfirmedSelections[column.original]);
		if (nextUnresolvedColumn) setSelectedColumnKey(nextUnresolvedColumn.original);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: activityQuery.data.name },
		{ label: t("schemaReview.crumb") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-7xl px-6 py-10 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("schemaReview.eyebrow"),
				title: t("schemaReview.title"),
				description: t("schemaReview.description"),
				actions: pageAction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTabs, {
				projectId,
				activityId,
				className: "mt-6"
			}),
			!hasDataset ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDatasetState, {
				projectId,
				activityId
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatasetStatusCard, {
					title: unresolvedCount > 0 ? t("schemaReview.datasetStatus.reviewTitle") : t("schemaReview.datasetStatus.readyTitle"),
					description: unresolvedCount > 0 ? t("schemaReview.datasetStatus.reviewDescription", { count: unresolvedCount }) : t("schemaReview.datasetStatus.readyDescription", { count: schema.length }),
					meta: latestUpload ? t("schemaReview.datasetStatus.lastUpload", { date: formatDateTime(latestUpload.createdAt, i18n.language) }) : void 0,
					tone: unresolvedCount > 0 ? "review" : "ready"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowProgress, { steps: [
					{
						label: t("schemaReview.workflow.upload"),
						state: "complete"
					},
					{
						label: t("schemaReview.workflow.understanding"),
						state: "complete"
					},
					{
						label: t("schemaReview.workflow.review"),
						state: unresolvedCount > 0 ? "current" : "complete"
					},
					{
						label: t("schemaReview.workflow.analysis"),
						state: unresolvedCount > 0 ? "upcoming" : "current"
					}
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary" }),
							label: t("schemaReview.summary.columnsDetected"),
							value: String(schema.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }),
							label: t("schemaReview.summary.autoClassified"),
							value: String(autoClassifiedCount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
							label: t("schemaReview.summary.reviewedByYou"),
							value: String(reviewedCount)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryMetric, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-primary" }),
							label: t("schemaReview.summary.needsReview"),
							value: String(unresolvedCount)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-6 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: t("schemaReview.quality.title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTile, {
								label: t("schemaReview.quality.missingValues"),
								value: String(datasetOverview.missingValues)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTile, {
								label: t("schemaReview.quality.duplicateRows"),
								value: String(datasetOverview.duplicateRows)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTile, {
								label: t("schemaReview.quality.sensitiveText"),
								value: t("schemaReview.quality.sensitiveTextValue")
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "min-w-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-4 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold tracking-tight text-foreground",
									children: t("schemaReview.mapping.title")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: t("schemaReview.mapping.description", { count: filteredSchema.length })
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "relative block w-full sm:w-72",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: searchTerm,
										onChange: (event) => setSearchTerm(event.target.value),
										placeholder: t("schemaReview.searchPlaceholder"),
										className: "h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-[760px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[1.5fr_1.8fr_1.4fr_1.1fr_1.1fr] gap-4 border-b border-border bg-secondary/50 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("schemaReview.headers.originalName") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("schemaReview.headers.semanticMeaning") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("schemaReview.headers.privacyCategory") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("schemaReview.headers.transformation") }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: t("schemaReview.headers.confidence") })
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: filteredSchema.map((column) => {
										const isSelected = selectedColumn.original === column.original;
										const columnStatus = getColumnStatus(column, Boolean(confirmedSelections[column.original]));
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
											className: "border-b border-border/70 last:border-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => setSelectedColumnKey(column.original),
												className: cn("grid w-full grid-cols-[1.5fr_1.8fr_1.4fr_1.1fr_1.1fr] items-center gap-4 px-5 py-4 text-left text-[13px] transition-colors", isSelected ? "bg-primary-soft/35" : "hover:bg-secondary/30"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-mono text-[12.5px] font-medium text-foreground",
														children: column.original
													}), confirmedSelections[column.original] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-1 text-xs text-primary",
														children: t("schemaReview.row.confirmedAs", { value: confirmedSelections[column.original] })
													}) : null] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-foreground",
														children: column.semantic
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium", privacyTone[column.privacy]),
														children: translateSchemaPrivacyLabel(t, column.privacy)
													}) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransformationBadge, {
														label: translateSchemaTransformationLabel(t, column.transformation),
														transformation: column.transformation
													}) }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex justify-start",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, {
															status: columnStatus,
															value: column.confidence
														})
													})
												]
											})
										}, column.original);
									}) })]
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColumnDetailPanel, {
						column: selectedColumn,
						draftSelection: pendingSelections[selectedColumn.original] ?? null,
						confirmedSelection: confirmedSelections[selectedColumn.original] ?? null,
						unresolvedCount,
						onDraftSelect: (value) => setPendingSelections((current) => ({
							...current,
							[selectedColumn.original]: value
						})),
						onConfirm: confirmSelectedMeaning
					})]
				})
			] })
		]
	})] });
}
function EmptyDatasetState({ projectId, activityId }) {
	const { t } = useTranslation();
	const benefitsValue = t("schemaReview.empty.benefits", { returnObjects: true });
	const benefits = Array.isArray(benefitsValue) ? benefitsValue : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6 overflow-hidden border-primary/15 bg-primary-soft/25 p-8 sm:p-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), t("schemaReview.empty.eyebrow")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-2xl font-semibold tracking-tight text-foreground",
					children: t("schemaReview.empty.title")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-sm leading-7 text-foreground/85",
					children: t("schemaReview.empty.description")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-3",
					children: benefits.map((benefit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 rounded-xl border border-primary/10 bg-card/70 px-4 py-3 text-sm text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: benefit })]
					}, benefit))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/projects/$projectId/activities/$activityId/overview",
						params: {
							projectId,
							activityId
						},
						className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), t("schemaReview.empty.cta")]
					})
				})
			]
		})
	});
}
function DatasetStatusCard({ title, description, meta, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: cn("mt-6 flex items-start gap-3 p-4", tone === "ready" ? "border-primary/15 bg-primary-soft/35" : "border-warning/25 bg-[oklch(0.98_0.03_75)]"),
		children: [tone === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.45_0.16_75)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-6 text-muted-foreground",
				children: description
			}),
			meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: meta
			}) : null
		] })]
	});
}
function WorkflowProgress({ steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "mt-6 p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-4",
			children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("rounded-xl border px-4 py-3", step.state === "complete" && "border-primary/20 bg-primary-soft/25", step.state === "current" && "border-warning/25 bg-[oklch(0.98_0.03_75)]", step.state === "upcoming" && "border-border bg-card"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("grid h-6 w-6 place-items-center rounded-full text-xs font-semibold", step.state === "complete" && "bg-primary text-primary-foreground", step.state === "current" && "bg-warning/15 text-[oklch(0.45_0.16_75)]", step.state === "upcoming" && "bg-secondary text-muted-foreground"),
						children: step.state === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : index + 1
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-foreground",
						children: step.label
					})]
				})
			}, step.label))
		})
	});
}
function SummaryMetric({ icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-[12px] font-medium text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 text-[28px] font-semibold tracking-tight text-foreground",
			children: value
		})]
	});
}
function ConfidenceBadge({ status, value }) {
	const { t } = useTranslation();
	const tone = status === "confirmed" ? "bg-primary-soft text-primary" : status === "high" ? "bg-[oklch(0.95_0.04_155)] text-[oklch(0.4_0.12_155)]" : status === "review" ? "bg-[oklch(0.98_0.03_75)] text-[oklch(0.45_0.16_75)]" : "bg-[oklch(0.95_0.05_25)] text-[oklch(0.45_0.18_25)]";
	const icon = status === "confirmed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : status === "high" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : status === "review" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		title: `${Math.round(value * 100)}%`,
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", tone),
		children: [icon, t(`schemaReview.statusLabels.${status}`)]
	});
}
function TransformationBadge({ transformation, label }) {
	const icon = transformation === "Hashed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }) : transformation === "Generalised" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinned, { className: "h-3.5 w-3.5" }) : transformation === "Removed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", transformationTone[transformation]),
		children: [icon, label]
	});
}
function ColumnDetailPanel({ column, draftSelection, confirmedSelection, unresolvedCount, onDraftSelect, onConfirm }) {
	const { t } = useTranslation();
	const reasoning = Array.isArray(column.reasoning) && column.reasoning.length > 0 ? column.reasoning : buildFallbackReasoning(t, column);
	const sampleValues = Array.isArray(column.sampleValues) ? column.sampleValues : [];
	const columnStatus = getColumnStatus(column, Boolean(confirmedSelection));
	const canConfirm = Boolean(draftSelection) && !confirmedSelection;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-w-0",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "sticky top-20 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-[0.08em] text-primary",
						children: t("schemaReview.detail.eyebrow")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-xl font-semibold tracking-tight text-foreground",
						children: column.semantic
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: t("schemaReview.detail.originalColumn", { column: column.original })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5 px-5 py-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBadge, {
							status: columnStatus,
							value: column.confidence
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
							children: t("schemaReview.detail.confidenceScore", { value: Math.round(column.confidence * 100) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTile, {
							label: t("schemaReview.detail.privacy"),
							value: translateSchemaPrivacyLabel(t, column.privacy)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoTile, {
							label: t("schemaReview.detail.transformation"),
							value: translateSchemaTransformationLabel(t, column.transformation)
						})]
					}),
					sampleValues.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
						children: t("schemaReview.detail.sampleValues")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: sampleValues.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-xs text-foreground",
							children: value
						}, value))
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), t("schemaReview.detail.reasoningTitle")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-2",
						children: reasoning.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "rounded-xl border border-border bg-secondary/20 px-4 py-3 text-sm leading-6 text-muted-foreground",
							children: item
						}, item))
					})] }),
					column.clarifyingQuestion ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-warning/25 bg-[oklch(0.98_0.03_75)] p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-[11px] font-medium text-[oklch(0.45_0.16_75)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), t("schemaReview.reviewCard.badge")]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-6 text-foreground",
								children: column.clarifyingQuestion
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: (Array.isArray(column.clarifyingOptions) ? column.clarifyingOptions : []).map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onDraftSelect(option),
									className: cn("rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary", draftSelection === option && "border-primary bg-primary-soft text-primary"),
									children: option
								}, option))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: confirmedSelection ? t("schemaReview.reviewCard.confirmedSelection", { value: confirmedSelection }) : t("schemaReview.reviewCard.remainingQuestions", { count: unresolvedCount })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: onConfirm,
									disabled: !canConfirm,
									className: cn("inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors", canConfirm ? "bg-primary text-primary-foreground shadow hover:bg-primary/90" : "cursor-not-allowed bg-card text-muted-foreground"),
									children: confirmedSelection ? t("schemaReview.reviewCard.confirmed") : t("schemaReview.reviewCard.confirm")
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-primary/10 bg-primary-soft/20 p-4 shadow-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-foreground",
							children: t("schemaReview.detail.noReviewNeededTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted-foreground",
							children: t("schemaReview.detail.noReviewNeededDescription")
						})]
					})
				]
			})]
		})
	});
}
function InfoTile({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-secondary/20 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 text-sm font-medium text-foreground",
			children: value
		})]
	});
}
function getColumnStatus(column, isConfirmed) {
	if (isConfirmed) return "confirmed";
	if (column.clarifyingQuestion) return "review";
	if (column.confidence < .8) return "unsure";
	return "high";
}
function buildFallbackReasoning(t, column) {
	return [
		t("schemaReview.detail.defaultReasoning.pattern"),
		t("schemaReview.detail.defaultReasoning.privacy", { privacy: translateSchemaPrivacyLabel(t, column.privacy) }),
		t("schemaReview.detail.defaultReasoning.transformation", { transformation: translateSchemaTransformationLabel(t, column.transformation) })
	];
}
function translateSchemaPrivacyLabel(t, category) {
	return t(`schemaReview.privacyLabels.${{
		"Direct Identifier": "directIdentifier",
		"Quasi Identifier": "quasiIdentifier",
		"High Risk": "highRisk",
		Operational: "operational",
		Outcome: "outcome"
	}[category]}`);
}
function translateSchemaTransformationLabel(t, transformation) {
	return t(`schemaReview.transformationLabels.${{
		Hashed: "hashed",
		Removed: "removed",
		Generalised: "generalised",
		Kept: "kept"
	}[transformation]}`);
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { SchemaReview as component };
