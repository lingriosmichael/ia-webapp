import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CrUr4hSq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var $$splitComponentImporter = () => import("./route-AUTY0A9i.mjs");
var OrganizationWorkspacePageContext = (0, import_react.createContext)(null);
var Route = createFileRoute("/organizations/$organizationId")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
function useOrganizationWorkspacePage() {
	const context = (0, import_react.useContext)(OrganizationWorkspacePageContext);
	if (!context) throw new Error("useOrganizationWorkspacePage must be used within the organization layout.");
	return context;
}
//#endregion
export { useOrganizationWorkspacePage as n, Route as t };
