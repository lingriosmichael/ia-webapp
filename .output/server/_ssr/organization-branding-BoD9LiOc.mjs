import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { o as resolveApiUrl } from "./use-auth-CbwAMR7f.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/organization-branding-BoD9LiOc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrganizationAvatar({ name, initials, logoUrl, className }) {
	const resolvedLogoUrl = resolveApiUrl(logoUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sidebar-border bg-[linear-gradient(135deg,oklch(0.97_0.02_300),oklch(0.93_0.02_260))] text-sm font-semibold tracking-[0.08em] text-primary shadow-[var(--shadow-soft)]", className),
		"aria-hidden": "true",
		children: resolvedLogoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: resolvedLogoUrl,
			alt: `${name} logo`,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: initials })
	});
}
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function getOrganizationBranding({ organizationName, organizationRole, logoUrl, language }) {
	const isGerman = language.startsWith("de");
	const displayName = organizationName;
	return {
		displayName,
		roleLabel: organizationRole === "ORGANIZATION_ADMIN" ? isGerman ? "Organisationsadministration" : "Organization Admin" : isGerman ? "Projektleitung" : "Project Manager",
		logoUrl: logoUrl ?? null,
		initials: getInitials(displayName)
	};
}
function getInitials(value) {
	const words = value.split(/\s+/).map((word) => word.trim()).filter(Boolean);
	if (words.length === 0) return "GR";
	return words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? "").join("");
}
//#endregion
export { getOrganizationBranding as i, OrganizationAvatar as n, Textarea as r, Label as t };
