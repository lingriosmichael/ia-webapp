import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as cn } from "./use-auth-CH-EBljn.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { K as ChartColumn, S as FileText, _ as LayoutGrid, u as Settings2, z as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ActivityTabs-bEUyNi9r.js
var import_jsx_runtime = require_jsx_runtime();
function ActivityTabs({ projectId, activityId, className }) {
	const { t } = useTranslation();
	const tabs = [
		{
			to: "/projects/$projectId/activities/$activityId/overview",
			label: t("activityTabs.brief"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/projects/$projectId/activities/$activityId/data-review",
			label: t("activityTabs.schema"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/projects/$projectId/activities/$activityId/analysis",
			label: t("activityTabs.analytics"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/projects/$projectId/activities/$activityId/insights",
			label: t("activityTabs.insights"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/projects/$projectId/activities/$activityId/settings",
			label: t("activityTabs.settings"),
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" })
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cn("flex w-full gap-1 overflow-x-auto border-b border-border pb-px", className),
		children: tabs.map((tItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: tItem.to,
			params: {
				projectId,
				activityId
			},
			className: cn("inline-flex items-center gap-1.5 rounded-t-md border-b-2 border-transparent px-3 py-2 text-[12.5px] font-medium text-muted-foreground transition-colors", "hover:text-foreground", "data-[status=active]:border-primary data-[status=active]:text-primary"),
			children: [tItem.icon, tItem.label]
		}, tItem.to))
	});
}
//#endregion
export { ActivityTabs as t };
