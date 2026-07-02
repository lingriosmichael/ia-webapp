import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { a as resolveActiveOrganizationId, d as useRequireAuth } from "./use-auth-CbwAMR7f.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as useOrganizationWorkspaceQuery } from "./use-grantready-DIPYOCni.mjs";
import { t as PublicMarketingShell } from "./PublicMarketingShell-DdrUd9C2.mjs";
import { t as OrganizationSettingsPanel } from "./OrganizationSettingsPanel-BRgCh1m0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding.profile-BN9YUmvN.js
var import_jsx_runtime = require_jsx_runtime();
function OnboardingProfilePage() {
	const navigate = useNavigate();
	const auth = useRequireAuth();
	const { t } = useTranslation();
	const organizationId = resolveActiveOrganizationId(auth.data?.organizations ?? []);
	const workspaceQuery = useOrganizationWorkspaceQuery(organizationId ?? "", Boolean(auth.token && organizationId));
	if (!organizationId || workspaceQuery.isLoading || !workspaceQuery.data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicMarketingShell, {
		currentPage: "register",
		title: t("auth.profileTitle"),
		description: t("auth.profileDescription"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationSettingsPanel, { organization: workspaceQuery.data.organization }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "w-full",
				onClick: () => void navigate({ to: "/onboarding/invite" }),
				children: t("common.continue")
			})]
		})
	});
}
//#endregion
export { OnboardingProfilePage as component };
