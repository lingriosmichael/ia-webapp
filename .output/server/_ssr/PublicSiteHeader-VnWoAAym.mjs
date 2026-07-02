import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { t as LanguageSwitcher } from "./LanguageSwitcher-CWmzTt9Y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PublicSiteHeader-VnWoAAym.js
var import_jsx_runtime = require_jsx_runtime();
function PublicSiteHeader({ currentPage }) {
	const { t } = useTranslation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "flex items-center justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "text-sm font-semibold tracking-[0.18em] text-primary",
			children: t("common.brand")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageSwitcher, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: cn("inline-flex h-9 items-center rounded-md px-4 text-sm font-medium transition-colors", currentPage === "login" ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"),
					"aria-current": currentPage === "login" ? "page" : void 0,
					children: t("common.logIn")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: cn("inline-flex h-9 items-center rounded-md px-4 text-sm font-medium shadow transition-colors", currentPage === "register" ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"),
					"aria-current": currentPage === "register" ? "page" : void 0,
					children: t("common.register")
				})
			]
		})]
	});
}
//#endregion
export { PublicSiteHeader as t };
