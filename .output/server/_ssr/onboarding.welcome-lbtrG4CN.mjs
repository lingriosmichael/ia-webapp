import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, d as useRequireAuth } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding.welcome-lbtrG4CN.js
var import_jsx_runtime = require_jsx_runtime();
function OnboardingWelcomePage() {
	const navigate = useNavigate();
	const auth = useRequireAuth();
	const { t } = useTranslation();
	const organizationId = resolveActiveOrganizationId(auth.data?.organizations ?? []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicMarketingShell, {
		currentPage: "register",
		title: t("auth.welcomeTitle"),
		description: t("auth.welcomeDescription"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-semibold tracking-tight",
				children: t("auth.welcomeCardTitle")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-6 text-muted-foreground",
				children: t("auth.welcomeCardDescription")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => void navigate({ to: "/onboarding/profile" }),
				disabled: !organizationId,
				children: t("common.continue")
			})]
		})
	});
}
//#endregion
export { OnboardingWelcomePage as component };
