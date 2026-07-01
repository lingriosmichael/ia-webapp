import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { T as Command, d as Search, k as ChevronRight } from "../_libs/lucide-react.mjs";
import { t as LanguageSwitcher } from "./LanguageSwitcher-DqiLzln-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkspaceUI-BGreAxnr.js
var import_jsx_runtime = require_jsx_runtime();
function TopBar({ crumbs, actions }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border/70 bg-background/80 px-6 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex items-center gap-1.5 text-[13px] text-muted-foreground",
			children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-1.5",
				children: [i > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-50" }), c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: c.to,
					params: c.params,
					className: "rounded px-1.5 py-0.5 transition-colors hover:bg-secondary hover:text-foreground",
					children: c.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "px-1.5 py-0.5 font-medium text-foreground",
					children: c.label
				})]
			}, i))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hidden h-8 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-[12px] text-muted-foreground transition-colors hover:bg-secondary md:inline-flex",
					"aria-label": t("common.searchAria"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("common.search") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 inline-flex items-center gap-0.5 rounded border border-border bg-secondary px-1 py-0.5 text-[10px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-2.5 w-2.5" }), "K"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {}),
				actions
			]
		})]
	}, pathname);
}
function PageHeader({ eyebrow, title, description, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [
				eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-primary",
					children: eyebrow
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight text-foreground sm:text-[28px]",
					children: title
				}),
				description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-[14px] leading-relaxed text-muted-foreground",
					children: description
				})
			]
		}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2",
			children: actions
		})]
	});
}
function Card({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-xl border border-border bg-card shadow-[var(--shadow-soft)] ${className}`,
		children
	});
}
function Stat({ label, value, delta, accent = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[12px] font-medium text-muted-foreground",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `mt-2 text-[26px] font-semibold tracking-tight ${accent ? "text-primary" : "text-foreground"}`,
				children: value
			}),
			delta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-[12px] text-muted-foreground",
				children: delta
			})
		]
	});
}
//#endregion
export { TopBar as i, PageHeader as n, Stat as r, Card as t };
