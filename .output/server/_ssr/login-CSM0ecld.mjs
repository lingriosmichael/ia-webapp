import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, c as useLoginMutation, i as rememberActiveOrganizationId, t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-BnWsA8wo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CSM0ecld.js
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
				toast.success(t("auth.loginSuccessToast"));
				navigate({ to: "/onboarding/workspace" });
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicMarketingShell, {
		currentPage: "login",
		title: t("auth.loginMarketingTitle"),
		description: t("auth.loginMarketingDescription"),
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
	});
}
//#endregion
export { LoginPage as component };
