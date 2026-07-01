import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/processing-B1XaKgdJ.js
var $$splitComponentImporter = () => import("./processing-CZDt-ip4.mjs");
var Route = createFileRoute("/projects/$projectId/activities/$activityId/processing")({
	validateSearch: objectType({ jobId: stringType().optional() }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
