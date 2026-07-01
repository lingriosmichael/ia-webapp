import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as useRequireAuth, l as useLogout, r as cn, t as ApiError } from "./use-auth-CH-EBljn.mjs";
import { n as Input } from "./input-Da49WZya.mjs";
import { l as useOrganizationWorkspaceQuery, p as useUpdateOrganizationMutation } from "./use-grantready-B9_7M9rF.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as CloudUpload, b as ImagePlus } from "../_libs/lucide-react.mjs";
import { a as getOrganizationBranding, i as WorkspaceShell, n as OrganizationAvatar, o as useWorkspaceLocale, r as Textarea, t as Label } from "./WorkspaceShell-K3aPfZoe.mjs";
import { i as TopBar, n as PageHeader, t as Card } from "./WorkspaceUI-BGreAxnr.mjs";
import { t as Route } from "./route-C1a0K7Ro.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CMDYu5g8.js
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
	const [description, setDescription] = (0, import_react.useState)(organization.description ?? "");
	const [selectedLogoFile, setSelectedLogoFile] = (0, import_react.useState)(null);
	const [dragActive, setDragActive] = (0, import_react.useState)(false);
	const [previewLogoUrl, setPreviewLogoUrl] = (0, import_react.useState)(organization.logoUrl);
	(0, import_react.useEffect)(() => {
		setName(organization.name);
		setDescription(organization.description ?? "");
		if (!selectedLogoFile) setPreviewLogoUrl(organization.logoUrl);
	}, [
		organization.description,
		organization.logoUrl,
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
	const hasChanges = name.trim() !== organization.name || description !== (organization.description ?? "") || Boolean(selectedLogoFile);
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
				description,
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
									children: locale.organizationSettings.descriptionLabel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "organization-description",
									value: description,
									onChange: (event) => setDescription(event.target.value),
									placeholder: locale.organizationSettings.descriptionPlaceholder,
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
function OrganizationSettingsPage() {
	const { organizationId } = Route.useParams();
	const logout = useLogout();
	const auth = useRequireAuth();
	const workspaceQuery = useOrganizationWorkspaceQuery(organizationId, Boolean(auth.token));
	const { t } = useTranslation();
	const locale = useWorkspaceLocale();
	if (!auth.token || auth.isLoading || workspaceQuery.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("organization.loading") });
	if (!workspaceQuery.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredState, { label: t("organization.loadFailed") });
	const workspace = workspaceQuery.data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(WorkspaceShell, {
		organizationId: workspace.organization.id,
		organizationName: workspace.organization.name,
		organizationRole: workspace.organization.role,
		organizationLogoUrl: workspace.organization.logoUrl,
		userName: auth.data?.user.fullName ?? auth.data?.user.email ?? "Account",
		projects: workspace.projects,
		onLogout: logout,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {
			crumbs: [{ label: workspace.organization.name }, { label: locale.sidebar.organizationSettings }],
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary",
				onClick: logout,
				children: t("common.logOut")
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-5xl px-8 py-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: locale.organizationSettings.eyebrow,
				title: locale.organizationSettings.title,
				description: locale.organizationSettings.description
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationSettingsPanel, { organization: workspace.organization })]
		})]
	});
}
function CenteredState({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground",
		children: label
	});
}
//#endregion
export { OrganizationSettingsPage as component };
