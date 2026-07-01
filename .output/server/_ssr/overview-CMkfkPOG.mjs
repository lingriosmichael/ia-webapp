import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth, r as cn, t as ApiError } from "./use-auth-CH-EBljn.mjs";
import { c as useJobQuery, f as useProjectQuery, i as useActivityUploadsQuery, m as useUploadActivityFileMutation, n as useActivityQuery, r as useActivityResultsQuery, t as useActivityJobsQuery } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as FileSpreadsheet, E as Clock3, H as CloudUpload, R as TriangleAlert, W as CircleCheck, r as Workflow, x as FolderKanban, z as Sparkles } from "../_libs/lucide-react.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { n as translateStatus, t as formatDateTime } from "./translation-utils-79g5PT3p.mjs";
import { t as ActivityTabs } from "./ActivityTabs-bEUyNi9r.mjs";
import { c as getSchema, n as datasetOverview } from "./mock-data-DNCOsgtW.mjs";
import { t as Route } from "./overview-DlPoGp6R.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/overview-CMkfkPOG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivityBriefPage() {
	const { projectId, activityId } = Route.useParams();
	const auth = useRequireAuth();
	const projectQuery = useProjectQuery(projectId, Boolean(auth.token));
	const activityQuery = useActivityQuery(activityId, Boolean(auth.token));
	const uploadsQuery = useActivityUploadsQuery(activityId, Boolean(auth.token));
	const jobsQuery = useActivityJobsQuery(activityId, Boolean(auth.token));
	const resultsQuery = useActivityResultsQuery(activityId, Boolean(auth.token));
	const uploadMutation = useUploadActivityFileMutation(activityId, projectId);
	const latestJobId = jobsQuery.data?.[0]?.id;
	const latestJobQuery = useJobQuery(latestJobId, Boolean(auth.token) && Boolean(latestJobId));
	const { t, i18n } = useTranslation();
	const [file, setFile] = (0, import_react.useState)(null);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [showUploader, setShowUploader] = (0, import_react.useState)(false);
	const [activeUploadName, setActiveUploadName] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	if (!auth.token || projectQuery.isLoading || activityQuery.isLoading || uploadsQuery.isLoading || jobsQuery.isLoading || resultsQuery.isLoading || Boolean(latestJobId) && latestJobQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityBrief.loading") });
	if (!projectQuery.data || !activityQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("activityBrief.loadFailed") });
	const project = projectQuery.data;
	const activity = activityQuery.data;
	const uploads = uploadsQuery.data ?? [];
	const jobs = jobsQuery.data ?? [];
	const results = resultsQuery.data ?? [];
	const lastUpload = uploads[0] ?? null;
	const latestJobStatus = latestJobQuery.data?.status ?? jobs[0]?.status ?? null;
	const availableInsights = results.filter((result) => result.status === "available").length;
	const unresolvedIssues = getSchema(t).filter((column) => column.clarifyingQuestion || column.confidence < .8).length;
	const workflowState = deriveWorkflowState({
		uploadPending: uploadMutation.isPending,
		hasDataset: uploads.length > 0,
		latestJobStatus
	});
	const pipelineStagesValue = t("activityBrief.pipeline.stages", { returnObjects: true });
	const pipelineStages = Array.isArray(pipelineStagesValue) ? pipelineStagesValue : [];
	const nextStepItemsValue = t(`activityBrief.nextStep.items.${workflowState.key}`, { returnObjects: true });
	const nextStepItems = Array.isArray(nextStepItemsValue) ? nextStepItemsValue : [];
	const shouldShowUploader = workflowState.key === "empty" || uploadMutation.isPending || showUploader;
	const primaryNextAction = workflowState.key === "ready" ? unresolvedIssues > 0 ? {
		to: "/projects/$projectId/activities/$activityId/data-review",
		label: t("activityBrief.nextStep.reviewData")
	} : {
		to: "/projects/$projectId/activities/$activityId/analysis",
		label: t("activityBrief.nextStep.continueToAnalysis")
	} : null;
	function pickFile(nextFile) {
		setFile(nextFile);
		setShowUploader(true);
	}
	function onDrop(event) {
		event.preventDefault();
		setDragActive(false);
		const nextFile = event.dataTransfer.files?.[0];
		if (nextFile) pickFile(nextFile);
	}
	function onChange(event) {
		const nextFile = event.target.files?.[0];
		if (nextFile) pickFile(nextFile);
	}
	async function uploadSelectedFile() {
		if (!file) return;
		try {
			setActiveUploadName(file.name);
			await uploadMutation.mutateAsync(file);
			setFile(null);
			setShowUploader(false);
			toast.success(t("upload.successToast"));
		} catch (error) {
			const message = error instanceof ApiError ? error.message : t("upload.failedToast");
			toast.error(message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, { crumbs: [
		{
			label: project.name,
			to: "/projects/$projectId",
			params: { projectId }
		},
		{ label: activity.name },
		{ label: t("activityBrief.crumb") }
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-6xl px-8 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: t("activityBrief.eyebrow"),
				title: activity.name,
				description: activity.description ?? t("activityBrief.noDescription")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityTabs, {
				projectId,
				activityId,
				className: "mt-6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewHero, {
				state: workflowState.key,
				projectId,
				activityId,
				unresolvedIssues,
				lastUploadName: lastUpload?.originalFileName ?? activeUploadName,
				latestJobStatus,
				onOpenUploader: () => setShowUploader(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "h-4 w-4 text-primary" }),
						label: t("activityBrief.metrics.activityStatus"),
						value: translateStatus(t, activity.status),
						description: t(`activityBrief.metrics.stateDescriptions.${workflowState.key}`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-4 w-4 text-primary" }),
						label: t("activityBrief.metrics.project"),
						value: project.name,
						description: project.programGoal ?? t("activityBrief.detail.noProjectGoal")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4 text-primary" }),
						label: t("activityBrief.metrics.lastUpload"),
						value: lastUpload ? formatDateTime(lastUpload.createdAt, i18n.language) : t("activityBrief.metrics.noUpload"),
						description: lastUpload?.originalFileName ?? t("activityBrief.metrics.noUploadDescription")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityMetricCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
						label: t("activityBrief.metrics.aiStatus"),
						value: t(`activityBrief.metrics.aiStatusValues.${workflowState.key}`),
						description: t("activityBrief.metrics.aiStatusDescription", {
							reviewCount: unresolvedIssues,
							insights: availableInsights
						})
					})
				]
			}),
			workflowState.key === "processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineCard, {
				status: latestJobStatus,
				title: t("activityBrief.pipeline.title"),
				description: t("activityBrief.pipeline.description"),
				stages: pipelineStages
			}),
			shouldShowUploader && !uploadMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadComposer, {
				file,
				dragActive,
				inputRef,
				onDragActiveChange: setDragActive,
				onDrop,
				onChange,
				onOpenFilePicker: () => inputRef.current?.click(),
				onRemoveFile: () => setFile(null),
				onUpload: uploadSelectedFile,
				isUploading: uploadMutation.isPending
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), t("activityBrief.nextStep.title")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-6 text-muted-foreground",
							children: t(`activityBrief.nextStep.descriptions.${workflowState.key}`)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-5 grid gap-3",
							children: nextStepItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground",
								children: item
							}, item))
						}),
						primaryNextAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: primaryNextAction.to,
							params: {
								projectId,
								activityId
							},
							className: "mt-5 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
							children: primaryNextAction.label
						}) : workflowState.key !== "empty" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowUploader(true),
							className: "mt-5 inline-flex h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-secondary",
							children: t("activityBrief.nextStep.addAnotherDataset")
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary" }), t("activityBrief.evidence.title")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid gap-4 md:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.datasets"),
								value: String(uploads.length)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.dataReview"),
								value: t("activityBrief.evidence.reviewValue", { count: unresolvedIssues })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.analysis"),
								value: t("activityBrief.evidence.analysisValue", { status: t(`activityBrief.metrics.aiStatusValues.${workflowState.key}`) })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.insights"),
								value: t("activityBrief.evidence.insightsValue", { count: availableInsights })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.qualityIssues"),
								value: t("activityBrief.evidence.qualityIssuesValue", {
									missing: datasetOverview.missingValues,
									duplicates: datasetOverview.duplicateRows
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailRow, {
								label: t("activityBrief.evidence.latestFile"),
								value: lastUpload?.originalFileName ?? t("activityBrief.evidence.noFile")
							})
						]
					})]
				})]
			})
		]
	})] });
}
function OverviewHero({ state, projectId, activityId, unresolvedIssues, lastUploadName, latestJobStatus, onOpenUploader }) {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-6 overflow-hidden border-primary/15 bg-primary-soft/30 p-6 sm:p-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-medium text-primary",
						children: [state === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : state === "uploading" || state === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "h-3.5 w-3.5" }) : state === "attention" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "h-3.5 w-3.5" }), t(`activityBrief.hero.badges.${state}`)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-3xl font-semibold tracking-tight text-foreground",
						children: t(`activityBrief.hero.titles.${state}`)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base leading-7 text-foreground/85",
						children: t(`activityBrief.hero.descriptions.${state}`, {
							count: unresolvedIssues,
							fileName: lastUploadName ?? t("activityBrief.evidence.noFile")
						})
					}),
					state === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted-foreground",
						children: t("activityBrief.hero.processingMeta", { status: latestJobStatus ?? t("common.loading") })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-6 text-muted-foreground",
						children: t("activityBrief.hero.supporting")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 flex-wrap gap-3",
				children: state === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: unresolvedIssues > 0 ? "/projects/$projectId/activities/$activityId/data-review" : "/projects/$projectId/activities/$activityId/analysis",
					params: {
						projectId,
						activityId
					},
					className: "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
					children: unresolvedIssues > 0 ? t("activityBrief.hero.reviewData") : t("activityBrief.hero.continueToAnalysis")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenUploader,
					className: "inline-flex h-11 items-center gap-2 rounded-md border border-border bg-card px-5 text-sm font-medium hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), t("activityBrief.hero.uploadAnother")]
				})] }) : state === "empty" || state === "attention" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenUploader,
					className: "inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-4 w-4" }), t("activityBrief.hero.uploadFirstDataset")]
				}) : null
			})]
		}), state === "uploading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 rounded-2xl border border-primary/15 bg-card/80 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("activityBrief.uploading.title") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("activityBrief.uploading.inProgress") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 h-2 overflow-hidden rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-primary to-[oklch(0.65_0.22_310)]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: t("activityBrief.uploading.description")
				})
			]
		}) : null]
	});
}
function UploadComposer({ file, dragActive, inputRef, onDragActiveChange, onDrop, onChange, onOpenFilePicker, onRemoveFile, onUpload, isUploading }) {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-[0.1em] text-primary",
				children: t("activityBrief.uploader.eyebrow")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 text-xl font-semibold tracking-tight text-foreground",
				children: t("activityBrief.uploader.title")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: t("activityBrief.uploader.description")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (event) => {
					event.preventDefault();
					onDragActiveChange(true);
				},
				onDragLeave: () => onDragActiveChange(false),
				onDrop,
				onClick: onOpenFilePicker,
				className: cn("mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-colors", dragActive ? "border-primary bg-primary-soft" : "border-border bg-secondary/40 hover:border-primary/40 hover:bg-primary-soft/40"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "file",
						accept: ".csv,.xlsx,.xls",
						className: "hidden",
						onChange
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 text-[15px] font-semibold tracking-tight",
						children: t("upload.dropzoneTitle")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-[13px] text-muted-foreground",
						children: [
							t("upload.dropzoneBrowsePrefix"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary underline-offset-2 hover:underline",
								children: t("upload.dropzoneBrowseAction")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 text-[11px] text-muted-foreground",
						children: t("upload.accepts")
					})
				]
			}),
			file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "mt-5 flex items-center gap-4 p-4 shadow-none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[14px] font-semibold",
							children: file.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[12px] text-muted-foreground",
							children: [
								formatSize(file.size),
								" · ",
								t("upload.readyToUpload")
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onRemoveFile,
						className: "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
						children: t("activityBrief.uploader.remove")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: isUploading,
						onClick: onUpload,
						className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), isUploading ? t("upload.uploading") : t("activityBrief.uploader.cta")]
					})
				]
			}) : null
		]
	});
}
function PipelineCard({ status, title, description, stages }) {
	const activeIndex = status === "completed" ? stages.length : status === "processing" ? 3 : status === "queued" ? 1 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-6 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-sm font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "h-4 w-4 text-primary" }), title]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5",
				children: stages.map((stage, index) => {
					const state = index < activeIndex ? "complete" : index === activeIndex ? "current" : "upcoming";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: cn("rounded-xl border px-4 py-4 text-sm", state === "complete" && "border-primary/20 bg-primary-soft/30", state === "current" && "border-warning/25 bg-[oklch(0.98_0.03_75)]", state === "upcoming" && "border-border bg-card"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("grid h-6 w-6 place-items-center rounded-full text-xs font-semibold", state === "complete" && "bg-primary text-primary-foreground", state === "current" && "bg-warning/15 text-[oklch(0.45_0.16_75)]", state === "upcoming" && "bg-secondary text-muted-foreground"),
								children: state === "complete" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }) : index + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: stage
							})]
						})
					}, stage);
				})
			})
		]
	});
}
function ActivityMetricCard({ icon, label, value, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground",
				children: [icon, label]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-lg font-semibold tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: description
			})
		]
	});
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
function deriveWorkflowState({ uploadPending, hasDataset, latestJobStatus }) {
	if (uploadPending) return { key: "uploading" };
	if (!hasDataset) return { key: "empty" };
	if (latestJobStatus === "failed") return { key: "attention" };
	if (latestJobStatus === "queued" || latestJobStatus === "processing") return { key: "processing" };
	return { key: "ready" };
}
function formatSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { ActivityBriefPage as component };
