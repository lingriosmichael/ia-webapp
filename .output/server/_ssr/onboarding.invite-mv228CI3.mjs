import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, d as useRequireAuth, t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { p as useOrganizationInvitationsQuery, s as useCreateInvitationMutation } from "./use-grantready-DIPYOCni.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-BnWsA8wo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding.invite-mv228CI3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingInvitePage() {
	const navigate = useNavigate();
	const auth = useRequireAuth();
	const { t } = useTranslation();
	const organizationId = resolveActiveOrganizationId(auth.data?.organizations ?? []);
	const [email, setEmail] = (0, import_react.useState)("");
	const createInvitationMutation = useCreateInvitationMutation(organizationId ?? "");
	const invitationsQuery = useOrganizationInvitationsQuery(organizationId ?? "", Boolean(auth.token && organizationId));
	if (!organizationId) return null;
	async function invite(event) {
		event.preventDefault();
		try {
			await createInvitationMutation.mutateAsync({
				email,
				role: "PROJECT_MANAGER"
			});
			setEmail("");
			toast.success(t("auth.inviteSuccessToast"));
		} catch (error) {
			toast.error(error instanceof ApiError ? error.message : t("auth.inviteFailedToast"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicMarketingShell, {
		currentPage: "register",
		title: t("auth.inviteTitle"),
		description: t("auth.inviteDescription"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold tracking-tight",
					children: t("auth.inviteCardTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-6 text-muted-foreground",
					children: t("auth.inviteCardDescription")
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: invite,
					children: [
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-border bg-secondary/20 px-3 py-2 text-sm text-muted-foreground",
							children: t("auth.projectManagerOnly")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: createInvitationMutation.isPending,
							children: createInvitationMutation.isPending ? t("auth.inviting") : t("auth.sendInvitation")
						})
					]
				}),
				(invitationsQuery.data ?? []).filter((invitation) => invitation.status === "pending").length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: (invitationsQuery.data ?? []).filter((invitation) => invitation.status === "pending").map((invitation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-foreground",
							children: invitation.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: t("auth.pendingInvitation")
						})]
					}, invitation.id))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: () => void resolveWorkspaceDestination(organizationId).then((destination) => navigate(destination)),
					children: t("auth.finishOnboarding")
				})
			]
		})
	});
}
//#endregion
export { OnboardingInvitePage as component };
