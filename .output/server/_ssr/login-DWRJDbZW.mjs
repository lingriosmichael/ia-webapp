import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, c as useLoginMutation, i as rememberActiveOrganizationId, t as ApiError } from "./use-auth-CH-EBljn.mjs";
import { n as Input, t as Button } from "./input-Da49WZya.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as LanguageSwitcher } from "./LanguageSwitcher-DqiLzln-.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-yiPbNogR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DWRJDbZW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const loginMutation = useLoginMutation();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const { t } = useTranslation();
	async function onSubmit(event) {
		event.preventDefault();
		try {
			const response = await loginMutation.mutateAsync({
				email,
				password
			});
			const organizationId = resolveActiveOrganizationId(response.organizations, response.organizations[0]?.id);
			if (!organizationId) {
				toast.error(t("auth.noOrganizationToast"));
				return;
			}
			rememberActiveOrganizationId(organizationId);
			toast.success(t("auth.loginSuccessToast"));
			navigate(await resolveWorkspaceDestination(organizationId));
		} catch (error) {
			const message = error instanceof ApiError ? error.message : t("auth.loginFailed");
			toast.error(message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthShell, {
		title: t("auth.loginTitle"),
		description: t("auth.loginDescription"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: t("auth.email")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "email",
						placeholder: t("auth.emailPlaceholder"),
						value: email,
						onChange: (event) => setEmail(event.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-medium text-foreground",
						children: t("auth.password")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						placeholder: t("auth.hiddenPasswordPlaceholder"),
						value: password,
						onChange: (event) => setPassword(event.target.value),
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "w-full",
					disabled: loginMutation.isPending,
					children: loginMutation.isPending ? t("auth.loggingIn") : t("common.logIn")
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 border-t border-border pt-6 text-sm text-muted-foreground",
			children: [
				t("auth.newHere"),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: t("auth.createAnAccount")
				})
			]
		})]
	});
}
function AuthShell({ title, description, children }) {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(9,126,105,0.14),_transparent_34%),linear-gradient(180deg,_#fbf8f1_0%,_#f4efe5_100%)] text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-h-screen max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex flex-col justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] text-primary",
						children: t("common.brand")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground",
							children: t("auth.foundation")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl",
							children: t("auth.loginMarketingTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl text-base leading-7 text-muted-foreground",
							children: t("auth.loginMarketingDescription")
						})
					]
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full rounded-[28px] border border-border/80 bg-card/92 p-8 shadow-[var(--shadow-elevated)] backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-semibold tracking-tight",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted-foreground",
							children: description
						})]
					}), children]
				})
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
