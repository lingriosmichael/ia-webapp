import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as Route } from "./processing-B1XaKgdJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/processing-CZDt-ip4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LegacyProcessingRedirect() {
	const { projectId, activityId } = Route.useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	(0, import_react.useEffect)(() => {
		navigate({
			to: "/projects/$projectId/activities/$activityId/overview",
			params: {
				projectId,
				activityId
			},
			replace: true
		});
	}, [
		activityId,
		navigate,
		projectId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center text-sm text-muted-foreground",
		children: t("activityBrief.redirectingToOverview")
	});
}
//#endregion
export { LegacyProcessingRedirect as component };
