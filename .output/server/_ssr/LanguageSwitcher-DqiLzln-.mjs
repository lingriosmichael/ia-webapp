import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as cn } from "./use-auth-CH-EBljn.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { y as Languages } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LanguageSwitcher-DqiLzln-.js
var import_jsx_runtime = require_jsx_runtime();
var LANGUAGES = ["de", "en"];
function LanguageSwitcher({ className = "" }) {
	const { i18n, t } = useTranslation();
	const activeLanguage = (i18n.resolvedLanguage ?? i18n.language).startsWith("en") ? "en" : "de";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-[var(--shadow-soft)]", className),
		"aria-label": t("language.switcherLabel"),
		role: "group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-7 w-7 place-items-center text-muted-foreground",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, { className: "h-3.5 w-3.5" })
		}), LANGUAGES.map((language) => {
			const isActive = language === activeLanguage;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void i18n.changeLanguage(language),
				className: cn("rounded px-2.5 py-1 text-[11px] font-semibold transition-colors", isActive ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-secondary hover:text-foreground"),
				"aria-pressed": isActive,
				children: t(`language.${language === "de" ? "german" : "english"}`)
			}, language);
		})]
	});
}
//#endregion
export { LanguageSwitcher as t };
