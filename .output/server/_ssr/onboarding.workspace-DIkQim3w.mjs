import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, d as useRequireAuth, i as rememberActiveOrganizationId, t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { c as useCreateOrganizationMutation } from "./use-grantready-DIPYOCni.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
import { t as resolveWorkspaceDestination } from "./workspace-routing-BnWsA8wo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding.workspace-DIkQim3w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OnboardingWorkspacePage() {
	const navigate = useNavigate();
	const auth = useRequireAuth();
	const { t } = useTranslation();
	const createOrganizationMutation = useCreateOrganizationMutation();
	const [organizationName, setOrganizationName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const organizationId = resolveActiveOrganizationId(auth.data?.organizations ?? []);
		if (organizationId) resolveWorkspaceDestination(organizationId).then((destination) => navigate(destination));
	}, [auth.data?.organizations, navigate]);
	async function onSubmit(event) {
		event.preventDefault();
		try {
			rememberActiveOrganizationId((await createOrganizationMutation.mutateAsync({ name: organizationName })).id);
			toast.success(t("auth.workspaceCreatedToast"));
			navigate({ to: "/onboarding/welcome" });
		} catch (error) {
			toast.error(error instanceof ApiError ? error.message : t("auth.workspaceCreateFailed"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PublicMarketingShell, {
		currentPage: "register",
		title: t("auth.workspaceProvisioningTitle"),
		description: t("auth.workspaceProvisioningDescription"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold tracking-tight",
				children: t("auth.workspaceProvisioningCardTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: t("auth.workspaceProvisioningCardDescription")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-4",
			onSubmit,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium text-foreground",
					children: t("auth.organizationName")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: organizationName,
					onChange: (event) => setOrganizationName(event.target.value),
					placeholder: t("auth.organizationPlaceholder"),
					required: true
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: createOrganizationMutation.isPending,
				children: createOrganizationMutation.isPending ? t("auth.creatingWorkspace") : t("landing.createWorkspace")
			})]
		})]
	});
}
//#endregion
export { OnboardingWorkspacePage as component };
