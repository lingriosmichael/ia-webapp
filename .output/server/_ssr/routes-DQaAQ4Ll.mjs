import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, f as useSessionQuery } from "./use-auth-CH-EBljn.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { B as Layers, F as ArrowRight, N as Building2, x as FolderKanban } from "../_libs/lucide-react.mjs";
import { t as LanguageSwitcher } from "./LanguageSwitcher-DqiLzln-.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-yiPbNogR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DQaAQ4Ll.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LandingPage() {
	const navigate = useNavigate();
	const activeOrganizationId = resolveActiveOrganizationId(useSessionQuery().data?.organizations ?? []);
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		if (!activeOrganizationId) return;
		let cancelled = false;
		async function redirectToWorkspace() {
			const destination = await resolveWorkspaceDestination(activeOrganizationId);
			if (!cancelled) navigate(destination);
		}
		redirectToWorkspace();
		return () => {
			cancelled = true;
		};
	}, [activeOrganizationId, navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(197,132,24,0.16),_transparent_22%),linear-gradient(180deg,_#fbf7ee_0%,_#f4efe6_44%,_#ffffff_100%)] text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold tracking-[0.18em] text-primary",
					children: t("common.brand")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-9 items-center rounded-md px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
							children: t("common.logIn")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							className: "inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
							children: t("common.register")
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "inline-flex rounded-full border border-primary/20 bg-card/80 px-4 py-2 text-sm text-primary shadow-[var(--shadow-soft)]",
						children: t("landing.badge")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-8 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl",
						children: t("landing.title")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-lg leading-8 text-muted-foreground",
						children: t("landing.description")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/register",
							className: "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90",
							children: [
								t("landing.createWorkspace"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "inline-flex h-10 items-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground",
							children: t("landing.useExistingAccount")
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-[32px] border border-border/70 bg-card/82 p-6 shadow-[var(--shadow-elevated)] backdrop-blur",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }),
								title: t("landing.features.organizations.title"),
								description: t("landing.features.organizations.description")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-5 w-5 text-primary" }),
								title: t("landing.features.projects.title"),
								description: t("landing.features.projects.description")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureCard, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-5 w-5 text-primary" }),
								title: t("landing.features.activities.title"),
								description: t("landing.features.activities.description")
							})
						]
					})
				})]
			})]
		})
	});
}
function FeatureCard({ icon, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/70 bg-background/90 p-5",
		children: [
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-lg font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { LandingPage as component };
