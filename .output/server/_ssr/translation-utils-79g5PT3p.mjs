//#region node_modules/.nitro/vite/services/ssr/assets/translation-utils-79g5PT3p.js
var statusKeyMap = {
	draft: "planning",
	planning: "planning",
	active: "active",
	archived: "completed",
	queued: "queued",
	processing: "processing",
	completed: "completed",
	failed: "failed",
	pending: "pending",
	uploaded: "uploaded",
	available: "available"
};
function translateStatus(t, status) {
	const translationKey = status ? statusKeyMap[status] : void 0;
	return t(translationKey ? `enums.status.${translationKey}` : "enums.status.planning");
}
function formatDateTime(value, language) {
	return new Intl.DateTimeFormat(language === "de" ? "de-DE" : "en-US", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(new Date(value));
}
//#endregion
export { translateStatus as n, formatDateTime as t };
