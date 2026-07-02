import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { d as useInvitationQuery, t as useAcceptInvitationMutation } from "./use-grantready-DIPYOCni.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./invitations._token.accept-8eAfndJ6.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invitations._token.accept-B_NTa3Dq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvitationAcceptancePage() {
	const { token } = Route.useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const invitationQuery = useInvitationQuery(token, Boolean(token));
	const acceptMutation = useAcceptInvitationMutation(token);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	async function onSubmit(event) {
		event.preventDefault();
		try {
			const accepted = await acceptMutation.mutateAsync({
				fullName,
				password
			});
			toast.success(accepted.hasExistingAccount ? t("auth.invitationAcceptedExistingAccount") : t("auth.invitationAccepted"));
			navigate({ to: "/login" });
		} catch (error) {
			toast.error(error instanceof ApiError ? error.message : t("auth.invitationAcceptFailed"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicMarketingShell, {
		currentPage: "login",
		title: t("auth.invitationTitle"),
		description: t("auth.invitationDescription"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold tracking-tight",
					children: t("auth.invitationCardTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: invitationQuery.data ? t("auth.invitationCardDescription", {
						organization: invitationQuery.data.organizationName,
						email: invitationQuery.data.email
					}) : t("common.loading")
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
						disabled: acceptMutation.isPending,
						children: acceptMutation.isPending ? t("auth.acceptingInvitation") : t("auth.acceptInvitation")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 border-t border-border pt-6 text-sm text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "font-medium text-primary underline-offset-4 hover:underline",
					children: t("common.logIn")
				})
			})
		]
	});
}
//#endregion
export { InvitationAcceptancePage as component };
