import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as ApiError, u as useRegisterMutation } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DajWeYwe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const navigate = useNavigate();
	const registerMutation = useRegisterMutation();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const { t } = useTranslation();
	async function onSubmit(event) {
		event.preventDefault();
		try {
			await registerMutation.mutateAsync({
				fullName,
				email,
				password
			});
			toast.success(t("auth.registerSuccessToast"));
			navigate({ to: "/onboarding/workspace" });
		} catch (error) {
			const message = error instanceof ApiError ? error.message : t("auth.registerFailed");
			toast.error(message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicMarketingShell, {
		currentPage: "register",
		title: t("auth.registerMarketingTitle"),
		description: t("auth.registerMarketingDescription"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold tracking-tight",
					children: t("auth.registerTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: t("auth.registerDescription")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium text-foreground",
							children: t("auth.fullName")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: fullName,
							onChange: (event) => setFullName(event.target.value),
							placeholder: t("auth.fullNamePlaceholder"),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium text-foreground",
							children: t("auth.email")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (event) => setEmail(event.target.value),
							placeholder: t("auth.emailPlaceholder"),
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
							value: password,
							onChange: (event) => setPassword(event.target.value),
							placeholder: t("auth.passwordPlaceholder"),
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						disabled: registerMutation.isPending,
						children: registerMutation.isPending ? t("auth.creatingAccount") : t("auth.createAccount")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 border-t border-border pt-6 text-sm text-muted-foreground",
				children: [
					t("auth.alreadyHaveAccount"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						className: "font-medium text-primary underline-offset-4 hover:underline",
						children: t("common.logIn")
					})
				]
			})
		]
	});
}
//#endregion
export { RegisterPage as component };
