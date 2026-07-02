import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { i as getOrganizationBranding, n as OrganizationAvatar, r as Textarea, t as Label } from "./organization-branding-BoD9LiOc.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { W as CloudUpload, b as ImagePlus } from "../_libs/lucide-react.mjs";
import { t as Card } from "./WorkspaceUI-JmFi-JKL.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { b as useUpdateOrganizationMutation } from "./use-grantready-DIPYOCni.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OrganizationSettingsPanel-BRgCh1m0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var acceptedLogoTypes = /* @__PURE__ */ new Set([
	"image/png",
	"image/jpeg",
	"image/webp"
]);
var acceptedLogoExtensions = [
	".png",
	".jpg",
	".jpeg",
	".webp"
];
function OrganizationSettingsPanel({ organization }) {
	const locale = useWorkspaceLocale();
	const { i18n } = useTranslation();
	const updateOrganizationMutation = useUpdateOrganizationMutation(organization.id);
	const fileInputRef = (0, import_react.useRef)(null);
	const [name, setName] = (0, import_react.useState)(organization.name);
	const [mission, setMission] = (0, import_react.useState)(organization.mission ?? "");
	const [selectedLogoFile, setSelectedLogoFile] = (0, import_react.useState)(null);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [previewLogoUrl, setPreviewLogoUrl] = (0, import_react.useState)(organization.logoUrl);
	(0, import_react.useEffect)(() => {
		setName(organization.name);
		setMission(organization.mission ?? "");
		if (!selectedLogoFile) setPreviewLogoUrl(organization.logoUrl);
	}, [
		organization.logoUrl,
		organization.mission,
		organization.name,
		selectedLogoFile
	]);
	(0, import_react.useEffect)(() => {
		if (!selectedLogoFile) return;
		const objectUrl = URL.createObjectURL(selectedLogoFile);
		setPreviewLogoUrl(objectUrl);
		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [selectedLogoFile]);
	const branding = (0, import_react.useMemo)(() => getOrganizationBranding({
		organizationName: name.trim() || organization.name,
		organizationRole: organization.role,
		logoUrl: previewLogoUrl,
		language: i18n.resolvedLanguage ?? i18n.language
	}), [
		i18n.language,
		i18n.resolvedLanguage,
		name,
		organization.name,
		organization.role,
		previewLogoUrl
	]);
	const hasChanges = name.trim() !== organization.name || mission !== (organization.mission ?? "") || Boolean(selectedLogoFile);
	function updateSelectedLogo(file) {
		const lowerName = file.name.toLowerCase();
		const matchesExtension = acceptedLogoExtensions.some((extension) => lowerName.endsWith(extension));
		if (!acceptedLogoTypes.has(file.type) && !matchesExtension) {
			toast.error(locale.organizationSettings.invalidFile);
			return;
		}
		setSelectedLogoFile(file);
	}
	function handleFileChange(event) {
		const nextFile = event.target.files?.[0];
		if (nextFile) updateSelectedLogo(nextFile);
	}
	function handleDrop(event) {
		event.preventDefault();
		setDragActive(false);
		const nextFile = event.dataTransfer.files?.[0];
		if (nextFile) updateSelectedLogo(nextFile);
	}
	async function handleSubmit(event) {
		event.preventDefault();
		try {
			await updateOrganizationMutation.mutateAsync({
				name: name.trim(),
				mission,
				logoFile: selectedLogoFile
			});
			setSelectedLogoFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
			toast.success(locale.organizationSettings.success);
		} catch (error) {
			const message = error instanceof ApiError ? error.message : locale.organizationSettings.failure;
			toast.error(message);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
		onSubmit: handleSubmit,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-8 p-6 sm:p-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: locale.organizationSettings.general
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
						children: locale.organizationSettings.generalDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "organization-name",
									children: locale.organizationSettings.nameLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "organization-name",
									value: name,
									onChange: (event) => setName(event.target.value),
									placeholder: locale.organizationSettings.namePlaceholder,
									required: true,
									maxLength: 120
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "organization-description",
									children: locale.organizationSettings.missionLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "organization-description",
									value: mission,
									onChange: (event) => setMission(event.target.value),
									placeholder: locale.organizationSettings.missionPlaceholder,
									rows: 5,
									maxLength: 2e3
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "organization-logo",
										children: locale.organizationSettings.logoLabel
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: "organization-logo",
										onDragOver: (event) => {
											event.preventDefault();
											setDragActive(true);
										},
										onDragLeave: () => setDragActive(false),
										onDrop: handleDrop,
										className: cn("flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors", dragActive ? "border-primary bg-primary-soft" : "border-border bg-secondary/40 hover:border-primary/40 hover:bg-primary-soft/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "organization-logo",
												ref: fileInputRef,
												type: "file",
												accept: ".png,.jpg,.jpeg,.webp",
												className: "hidden",
												onChange: handleFileChange
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-14 w-14 place-items-center rounded-2xl bg-card text-primary shadow-[var(--shadow-soft)]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-4 text-[15px] font-semibold tracking-tight text-foreground",
												children: locale.organizationSettings.dropzoneTitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm text-primary",
												children: selectedLogoFile ? locale.organizationSettings.replaceLogo : locale.organizationSettings.dropzoneAction
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3 max-w-xl text-sm leading-6 text-muted-foreground",
												children: locale.organizationSettings.logoDescription
											})
										]
									}),
									selectedLogoFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm text-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium",
												children: [locale.organizationSettings.selectedLogo, ":"]
											}),
											" ",
											selectedLogoFile.name
										]
									}) : null
								]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "h-fit p-6 shadow-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-4 w-4 text-primary" }), locale.organizationSettings.previewLabel]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-6 text-muted-foreground",
							children: locale.organizationSettings.previewDescription
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-col items-center rounded-2xl border border-border bg-secondary/30 px-5 py-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationAvatar, {
									name: branding.displayName,
									initials: branding.initials,
									logoUrl: previewLogoUrl,
									className: "h-20 w-20 rounded-3xl text-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 text-lg font-semibold tracking-tight text-foreground",
									children: name.trim() || organization.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-sm text-muted-foreground",
									children: branding.roleLabel
								})
							]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: !hasChanges || updateOrganizationMutation.isPending,
					className: "inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60",
					children: updateOrganizationMutation.isPending ? locale.organizationSettings.saving : locale.organizationSettings.save
				})
			})]
		})
	});
}
//#endregion
export { OrganizationSettingsPanel as t };
