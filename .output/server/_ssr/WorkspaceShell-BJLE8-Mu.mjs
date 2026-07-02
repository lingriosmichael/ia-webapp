import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { i as rememberActiveOrganizationId, t as ApiError } from "./use-auth-CbwAMR7f.mjs";
import { i as getOrganizationBranding, n as OrganizationAvatar, r as Textarea, t as Label } from "./organization-branding-BoD9LiOc.mjs";
import { t as useTranslation } from "../_libs/react-i18next.mjs";
import { A as ChevronRight, B as TriangleAlert, J as ChartColumn, L as Activity, M as Check, O as Circle, P as Building2, R as UsersRound, T as CreditCard, U as Ellipsis, V as Sparkles, f as Plus, h as LogOut, j as ChevronDown, k as ChevronUp, n as X, o as Trash2, u as Settings2, v as LayoutDashboard, x as FolderKanban } from "../_libs/lucide-react.mjs";
import { t as useWorkspaceLocale } from "./use-workspace-locale-DVjcZ9zV.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { l as useCreateProjectMutation, o as useCreateActivityMutation, u as useDeleteProjectMutation } from "./use-grantready-DIPYOCni.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkspaceShell-BJLE8-Mu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function EntityDialog({ open, onOpenChange, title, description, submitLabel, cancelLabel, isSubmitting, onSubmit, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[88vh] max-w-4xl overflow-y-auto rounded-[28px] border border-border/80 bg-card/97 p-0 shadow-[var(--shadow-elevated)] backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "border-b border-border/70 px-8 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-2xl font-semibold tracking-tight",
							children: title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "mt-2 text-sm leading-6 text-muted-foreground",
							children: description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-8 px-8 py-6",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "border-t border-border/70 px-8 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: cancelLabel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: isSubmitting,
							children: submitLabel
						})]
					})
				]
			})
		})
	});
}
function DialogSection({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-semibold uppercase tracking-[0.08em] text-primary",
			children: title
		}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: description
		}) : null] }), children]
	});
}
function FieldLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-sm font-medium text-foreground",
		children
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var STATUS_OPTIONS$1 = [
	"planning",
	"active",
	"completed"
];
var initialState$1 = {
	name: "",
	description: "",
	activityType: "",
	owner: "",
	startDate: "",
	endDate: "",
	objectives: "",
	expectedOutcomes: "",
	successIndicators: "",
	targetAudience: "",
	beneficiaryGroup: "",
	status: "planning"
};
function ActivityDialog({ open, onOpenChange, isSubmitting, onSubmit }) {
	const locale = useWorkspaceLocale();
	const [form, setForm] = (0, import_react.useState)(initialState$1);
	(0, import_react.useEffect)(() => {
		if (!open) setForm(initialState$1);
	}, [open]);
	async function handleSubmit(event) {
		event.preventDefault();
		await onSubmit({
			name: form.name,
			description: form.description || void 0,
			activityType: form.activityType || void 0,
			owner: form.owner || void 0,
			startDate: form.startDate ? new Date(form.startDate).toISOString() : void 0,
			endDate: form.endDate ? new Date(form.endDate).toISOString() : void 0,
			objectives: form.objectives || void 0,
			expectedOutcomes: form.expectedOutcomes || void 0,
			successIndicators: form.successIndicators || void 0,
			targetAudience: form.targetAudience || void 0,
			beneficiaryGroup: form.beneficiaryGroup || void 0,
			status: form.status
		});
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EntityDialog, {
		open,
		onOpenChange,
		title: locale.dialogs.createActivityTitle,
		description: locale.dialogs.createActivityDescription,
		submitLabel: isSubmitting ? locale.dialogs.activity.creating : locale.dialogs.activity.submit,
		cancelLabel: locale.dialogs.cancel,
		isSubmitting,
		onSubmit: handleSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.activity.name,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (event) => setForm((current) => ({
									...current,
									name: event.target.value
								})),
								placeholder: locale.dialogs.activity.namePlaceholder,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.description }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.description,
								onChange: (event) => setForm((current) => ({
									...current,
									description: event.target.value
								})),
								placeholder: locale.dialogs.activity.descriptionPlaceholder,
								rows: 4
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.activityType }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.activityType,
								onValueChange: (value) => setForm((current) => ({
									...current,
									activityType: value
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: locale.dialogs.activity.activityType }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: locale.dialogs.options.activityTypes.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: option,
									children: option
								}, option)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.owner }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.owner,
								onChange: (event) => setForm((current) => ({
									...current,
									owner: event.target.value
								})),
								placeholder: locale.dialogs.activity.ownerPlaceholder
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.startDate }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.startDate,
								onChange: (event) => setForm((current) => ({
									...current,
									startDate: event.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.endDate }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: form.endDate,
								onChange: (event) => setForm((current) => ({
									...current,
									endDate: event.target.value
								}))
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.activity.objectives,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.objectives }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.objectives,
								onChange: (event) => setForm((current) => ({
									...current,
									objectives: event.target.value
								})),
								placeholder: locale.dialogs.activity.objectivesPlaceholder,
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.expectedOutcomes }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.expectedOutcomes,
								onChange: (event) => setForm((current) => ({
									...current,
									expectedOutcomes: event.target.value
								})),
								placeholder: locale.dialogs.activity.expectedOutcomesPlaceholder,
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.successIndicators }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.successIndicators,
								onChange: (event) => setForm((current) => ({
									...current,
									successIndicators: event.target.value
								})),
								placeholder: locale.dialogs.activity.successIndicatorsPlaceholder,
								rows: 3
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.activity.targetAudience,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.targetAudience }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.targetAudience,
								onChange: (event) => setForm((current) => ({
									...current,
									targetAudience: event.target.value
								})),
								placeholder: locale.dialogs.activity.targetAudiencePlaceholder,
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.beneficiaryGroup }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.beneficiaryGroup,
								onChange: (event) => setForm((current) => ({
									...current,
									beneficiaryGroup: event.target.value
								})),
								placeholder: locale.dialogs.activity.beneficiaryGroupPlaceholder,
								rows: 3
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.activity.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: form.status,
								onValueChange: (value) => setForm((current) => ({
									...current,
									status: value
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS$1.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: status,
									children: locale.status[status]
								}, status)) })]
							})]
						})
					]
				})
			})
		]
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function SidebarHeader({ organizationName, organizationRole, organizationLogoUrl }) {
	const { i18n } = useTranslation();
	const branding = getOrganizationBranding({
		organizationName,
		organizationRole,
		logoUrl: organizationLogoUrl,
		language: i18n.resolvedLanguage ?? i18n.language
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "px-4 py-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationAvatar, {
				name: branding.displayName,
				initials: branding.initials,
				logoUrl: branding.logoUrl
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-[17px] font-semibold tracking-tight text-foreground",
					children: branding.displayName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate text-[13px] text-muted-foreground",
					children: branding.roleLabel
				})]
			})]
		})
	});
}
function Group({ label, actions, defaultOpen = true, children }) {
	const [open, setOpen] = (0, import_react.useState)(defaultOpen);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setOpen((value) => !value),
				className: "flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left text-[13px] font-medium text-sidebar-foreground/85 hover:bg-sidebar-hover hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-90") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: label
				})]
			}), actions]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1 pl-2",
					children
				})
			})
		})]
	});
}
function NavRow({ to, params, icon, label, depth = 0, exact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		params,
		activeOptions: { exact },
		className: cn("group relative flex items-center gap-2 rounded-xl py-2 text-[13px] font-medium text-sidebar-foreground/85 transition-colors", "hover:bg-sidebar-hover hover:text-foreground", "data-[status=active]:bg-sidebar-active data-[status=active]:text-primary data-[status=active]:font-semibold"),
		style: {
			paddingLeft: `${.75 + depth * .8}rem`,
			paddingRight: "0.75rem"
		},
		children: [icon ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		})]
	});
}
function ActionButton({ onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground",
		"aria-label": label,
		title: label,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
	});
}
function AppSidebar({ organizationName, organizationRole, organizationPermissions, organizationLogoUrl, organizationId, userName, projects, currentProjectId, currentProject, onCreateProject, onCreateActivity, onDeleteProject, onLogout }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const { t, i18n } = useTranslation();
	const locale = useWorkspaceLocale();
	const currentActivityId = pathname.match(/\/activities\/([^/]+)/)?.[1];
	const branding = getOrganizationBranding({
		organizationName,
		organizationRole,
		logoUrl: organizationLogoUrl,
		language: i18n.resolvedLanguage ?? i18n.language
	});
	const projectCountLabel = projects.length === 1 ? locale.sidebar.projectSingular : locale.sidebar.projectPlural;
	const primaryNavigation = organizationRole === "ORGANIZATION_ADMIN" ? [
		{
			to: "/organizations/$organizationId",
			label: locale.sidebar.workspace,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/projects",
			label: locale.sidebar.projects,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/members",
			label: locale.sidebar.members,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersRound, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/profile",
			label: locale.sidebar.organizationProfile,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/billing",
			label: locale.sidebar.billing,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/settings",
			label: locale.sidebar.organizationSettings,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" })
		}
	] : [
		{
			to: "/organizations/$organizationId",
			label: locale.sidebar.workspace,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/projects",
			label: locale.sidebar.projects,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-3.5 w-3.5" })
		},
		{
			to: "/organizations/$organizationId/activities",
			label: locale.sidebar.activities,
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5" })
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "sticky top-0 flex h-dvh w-[21rem] shrink-0 flex-col border-r border-sidebar-border bg-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
				organizationName,
				organizationRole,
				organizationLogoUrl
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-5 overflow-y-auto px-3 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-sidebar-border bg-card/75 p-2 shadow-[var(--shadow-soft)]",
					children: primaryNavigation.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
						to: item.to,
						params: { organizationId },
						label: item.label,
						icon: item.icon,
						exact: item.to === "/organizations/$organizationId"
					}, item.to))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: locale.sidebar.sectionTitle }), organizationPermissions.canCreateProject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						onClick: onCreateProject,
						label: locale.sidebar.addProject
					}) : null]
				}), projects.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/70 bg-card/60 px-4 py-4 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-foreground",
						children: locale.sidebar.noProjects
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 leading-6",
						children: locale.sidebar.createFirstProject
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1.5",
					children: projects.map((project) => {
						const isCurrentProject = project.id === currentProjectId;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Group, {
							label: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderKanban, { className: "h-3.5 w-3.5 text-primary" }), project.name]
							}),
							defaultOpen: isCurrentProject,
							actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectActionsMenu, {
								project,
								onDeleteProject,
								projectSettingsLabel: locale.sidebar.projectSettings,
								deleteProjectLabel: locale.sidebar.deleteProject,
								actionsLabel: locale.sidebar.projectActions
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
									to: "/projects/$projectId",
									params: { projectId: project.id },
									label: locale.sidebar.overview,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "h-3.5 w-3.5" }),
									depth: 1,
									exact: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
									to: "/projects/$projectId/analytics",
									params: { projectId: project.id },
									label: locale.sidebar.analytics,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5" }),
									depth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
									to: "/projects/$projectId/insights",
									params: { projectId: project.id },
									label: locale.sidebar.insights,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }),
									depth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
									to: "/projects/$projectId/settings",
									params: { projectId: project.id },
									label: locale.sidebar.projectSettings,
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-3.5 w-3.5" }),
									depth: 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
									label: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5" }), locale.sidebar.activities]
									}),
									defaultOpen: isCurrentProject,
									actions: project.permissions.canCreateActivity ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
										onClick: () => onCreateActivity(project.id),
										label: locale.sidebar.addActivity
									}) : void 0,
									children: project.activities.map((activity) => {
										const isActiveActivity = currentActivityId === activity.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavRow, {
											to: "/projects/$projectId/activities/$activityId/overview",
											params: {
												projectId: project.id,
												activityId: activity.id
											},
											label: activity.name,
											icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: cn("h-3.5 w-3.5", isActiveActivity && "text-primary") }),
											depth: 1
										}, activity.id);
									})
								})
							]
						}, project.id);
					})
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "m-3 rounded-2xl border border-sidebar-border bg-card p-4 shadow-[var(--shadow-soft)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: userName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: branding.roleLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 border-t border-border pt-3 text-xs text-muted-foreground",
						children: [
							projects.length,
							" ",
							projectCountLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: organizationPermissions.canManageProfile ? "/organizations/$organizationId/profile" : "/organizations/$organizationId",
								params: { organizationId },
								className: "inline-flex items-center justify-center rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary",
								children: organizationPermissions.canManageProfile ? locale.sidebar.organizationProfile : locale.sidebar.workspace
							}),
							currentProject && !currentProject.permissions.canEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-primary/20 bg-primary-soft px-3 py-2 text-xs leading-5 text-primary",
								children: locale.sidebar.readOnlyProject
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onLogout,
								className: "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }),
									" ",
									t("common.logOut")
								]
							})
						]
					})
				]
			})
		]
	});
}
function ProjectActionsMenu({ project, onDeleteProject, projectSettingsLabel, deleteProjectLabel, actionsLabel }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-hover hover:text-foreground",
			"aria-label": `${project.name} ${actionsLabel}`,
			title: actionsLabel,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-3.5 w-3.5" })
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-52",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/projects/$projectId/settings",
				params: { projectId: project.id },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4" }), projectSettingsLabel]
			})
		}), project.permissions.canDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
			onSelect: () => onDeleteProject(project),
			className: "text-destructive focus:text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), deleteProjectLabel]
		})] }) : null]
	})] });
}
function ProjectDeleteDialog({ open, onOpenChange, project, isDeleting, onConfirm }) {
	const locale = useWorkspaceLocale();
	const [projectNameConfirmation, setProjectNameConfirmation] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setProjectNameConfirmation("");
	}, [open, project?.id]);
	const projectNameMatches = projectNameConfirmation === project?.name;
	const deletionImpacts = [
		locale.projectDelete.impacts.activities,
		locale.projectDelete.impacts.datasets,
		locale.projectDelete.impacts.jobs,
		locale.projectDelete.impacts.reviews,
		locale.projectDelete.impacts.analyses,
		locale.projectDelete.impacts.insights
	];
	async function handleSubmit(event) {
		event.preventDefault();
		if (!projectNameMatches || !project) return;
		await onConfirm(projectNameConfirmation);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-2xl rounded-[28px] border border-border/80 bg-card/98 p-0 shadow-[var(--shadow-elevated)]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "border-b border-border/70 px-8 py-6 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-2xl font-semibold tracking-tight",
								children: locale.projectDelete.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "mt-2 text-sm leading-6 text-muted-foreground",
								children: locale.projectDelete.description
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 px-8 py-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 rounded-2xl border border-border bg-secondary/25 p-5 text-sm text-foreground",
							children: deletionImpacts.map((impact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mt-0.5 h-4 w-4 shrink-0 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: impact })]
							}, impact))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "project-delete-confirmation",
								children: locale.projectDelete.confirmLabel
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "project-delete-confirmation",
								value: projectNameConfirmation,
								onChange: (event) => setProjectNameConfirmation(event.target.value),
								placeholder: project?.name ?? "",
								autoComplete: "off",
								autoFocus: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "border-t border-border/70 px-8 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: isDeleting,
							children: locale.dialogs.cancel
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							variant: "destructive",
							disabled: !projectNameMatches || isDeleting,
							children: isDeleting ? locale.projectDelete.deleting : locale.projectDelete.confirmAction
						})]
					})
				]
			})
		})
	});
}
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var STATUS_OPTIONS = [
	"planning",
	"active",
	"completed"
];
function toggleValue(values, value) {
	return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
var initialState = {
	name: "",
	description: "",
	programGoal: "",
	startMonth: "",
	endMonth: "",
	country: "",
	regionCity: "",
	sdgs: [],
	targetBeneficiaries: [],
	fundingSource: "",
	status: "planning"
};
function ProjectDialog({ open, onOpenChange, organizationName, isSubmitting, onSubmit }) {
	const locale = useWorkspaceLocale();
	const [form, setForm] = (0, import_react.useState)(initialState);
	(0, import_react.useEffect)(() => {
		if (!open) setForm(initialState);
	}, [open]);
	async function handleSubmit(event) {
		event.preventDefault();
		await onSubmit({
			name: form.name,
			description: form.description || void 0,
			programGoal: form.programGoal || void 0,
			startMonth: form.startMonth || void 0,
			endMonth: form.endMonth || void 0,
			country: form.country || void 0,
			regionCity: form.regionCity || void 0,
			sdgs: form.sdgs,
			targetBeneficiaries: form.targetBeneficiaries,
			fundingSource: form.fundingSource || void 0,
			status: form.status
		});
		onOpenChange(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EntityDialog, {
		open,
		onOpenChange,
		title: locale.dialogs.createProjectTitle,
		description: locale.dialogs.createProjectDescription,
		submitLabel: isSubmitting ? locale.dialogs.project.creating : locale.dialogs.project.submit,
		cancelLabel: locale.dialogs.cancel,
		isSubmitting,
		onSubmit: handleSubmit,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.project.name,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.name,
								onChange: (event) => setForm((current) => ({
									...current,
									name: event.target.value
								})),
								placeholder: locale.dialogs.project.namePlaceholder,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.description }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.description,
								onChange: (event) => setForm((current) => ({
									...current,
									description: event.target.value
								})),
								placeholder: locale.dialogs.project.descriptionPlaceholder,
								rows: 4
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.programGoal }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: form.programGoal,
								onChange: (event) => setForm((current) => ({
									...current,
									programGoal: event.target.value
								})),
								placeholder: locale.dialogs.project.programGoalPlaceholder,
								rows: 3
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.project.organization,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.startMonth }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "month",
								value: form.startMonth,
								onChange: (event) => setForm((current) => ({
									...current,
									startMonth: event.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.endMonth }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "month",
								value: form.endMonth,
								onChange: (event) => setForm((current) => ({
									...current,
									endMonth: event.target.value
								}))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.country }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.country,
								onChange: (event) => setForm((current) => ({
									...current,
									country: event.target.value
								})),
								placeholder: locale.dialogs.project.countryPlaceholder
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.regionCity }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: form.regionCity,
								onChange: (event) => setForm((current) => ({
									...current,
									regionCity: event.target.value
								})),
								placeholder: locale.dialogs.project.regionCityPlaceholder
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 md:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.organization }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: organizationName,
								readOnly: true,
								disabled: true
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.project.sdgs,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: locale.dialogs.options.sdgs.map((sdg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: form.sdgs.includes(sdg),
							onCheckedChange: () => setForm((current) => ({
								...current,
								sdgs: toggleValue(current.sdgs, sdg)
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sdg })]
					}, sdg))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.project.targetBeneficiaries,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: locale.dialogs.options.targetBeneficiaries.map((beneficiary) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: form.targetBeneficiaries.includes(beneficiary),
							onCheckedChange: () => setForm((current) => ({
								...current,
								targetBeneficiaries: toggleValue(current.targetBeneficiaries, beneficiary)
							}))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: beneficiary })]
					}, beneficiary))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogSection, {
				title: locale.dialogs.project.fundingSource,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-5 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.fundingSource }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.fundingSource,
							onChange: (event) => setForm((current) => ({
								...current,
								fundingSource: event.target.value
							})),
							placeholder: locale.dialogs.project.fundingSourcePlaceholder
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: locale.dialogs.project.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.status,
							onValueChange: (value) => setForm((current) => ({
								...current,
								status: value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: status,
								children: locale.status[status]
							}, status)) })]
						})]
					})]
				})
			})
		]
	});
}
var WorkspaceShellContext = (0, import_react.createContext)(null);
function useWorkspaceShell() {
	const context = (0, import_react.useContext)(WorkspaceShellContext);
	if (!context) throw new Error("useWorkspaceShell must be used within WorkspaceShell.");
	return context;
}
function WorkspaceShell({ organizationId, organizationName, organizationRole, organizationPermissions, organizationLogoUrl, userName, projects, currentProjectId, onLogout, children }) {
	const navigate = useNavigate();
	const locale = useWorkspaceLocale();
	const [projectDialogOpen, setProjectDialogOpen] = (0, import_react.useState)(false);
	const [activityDialogProjectId, setActivityDialogProjectId] = (0, import_react.useState)(null);
	const [projectDeleteTarget, setProjectDeleteTarget] = (0, import_react.useState)(null);
	const createProjectMutation = useCreateProjectMutation(organizationId);
	const deleteProjectMutation = useDeleteProjectMutation(organizationId);
	const activeActivityProjectId = (0, import_react.useMemo)(() => activityDialogProjectId ?? currentProjectId ?? "", [activityDialogProjectId, currentProjectId]);
	const currentProject = (0, import_react.useMemo)(() => projects.find((project) => project.id === currentProjectId) ?? null, [currentProjectId, projects]);
	const createActivityMutation = useCreateActivityMutation(activeActivityProjectId, organizationId);
	(0, import_react.useEffect)(() => {
		rememberActiveOrganizationId(organizationId);
	}, [organizationId]);
	const workspaceShellActions = (0, import_react.useMemo)(() => ({
		openProjectDialog: () => setProjectDialogOpen(true),
		openActivityDialog: (projectId) => setActivityDialogProjectId(projectId),
		openProjectDeleteDialog: (project) => setProjectDeleteTarget(project)
	}), []);
	async function handleCreateProject(payload) {
		try {
			const project = await createProjectMutation.mutateAsync(payload);
			toast.success(locale.dialogs.project.success);
			navigate({
				to: "/projects/$projectId",
				params: { projectId: project.id }
			});
		} catch (error) {
			const message = error instanceof ApiError ? error.message : locale.dialogs.project.failure;
			toast.error(message);
			throw error;
		}
	}
	async function handleCreateActivity(payload) {
		if (!activeActivityProjectId) {
			toast.error(locale.dialogs.activity.failure);
			throw new Error("No project selected for activity creation.");
		}
		try {
			const activity = await createActivityMutation.mutateAsync(payload);
			toast.success(locale.dialogs.activity.success);
			setActivityDialogProjectId(null);
			navigate({
				to: "/projects/$projectId/activities/$activityId/overview",
				params: {
					projectId: activeActivityProjectId,
					activityId: activity.id
				}
			});
		} catch (error) {
			const message = error instanceof ApiError ? error.message : locale.dialogs.activity.failure;
			toast.error(message);
			throw error;
		}
	}
	async function handleDeleteProject(projectName) {
		if (!projectDeleteTarget) return;
		const deletedProjectId = projectDeleteTarget.id;
		const shouldRedirectToOrganization = currentProjectId === deletedProjectId;
		try {
			await deleteProjectMutation.mutateAsync({
				projectId: deletedProjectId,
				payload: { projectName }
			});
			setProjectDeleteTarget(null);
			toast.success(locale.projectDelete.success);
			if (shouldRedirectToOrganization) navigate({
				to: "/organizations/$organizationId",
				params: { organizationId }
			});
		} catch (error) {
			toast.error(locale.projectDelete.failure);
			throw error;
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShellContext.Provider, {
		value: workspaceShellActions,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen w-full bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {
					organizationName,
					organizationRole,
					organizationPermissions,
					organizationLogoUrl,
					organizationId,
					userName,
					projects,
					currentProjectId,
					currentProject,
					onCreateProject: workspaceShellActions.openProjectDialog,
					onCreateActivity: workspaceShellActions.openActivityDialog,
					onDeleteProject: workspaceShellActions.openProjectDeleteDialog,
					onLogout
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex min-w-0 flex-1 flex-col",
					children
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDialog, {
					open: projectDialogOpen,
					onOpenChange: setProjectDialogOpen,
					organizationName,
					isSubmitting: createProjectMutation.isPending,
					onSubmit: handleCreateProject
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityDialog, {
					open: Boolean(activityDialogProjectId),
					onOpenChange: (open) => {
						if (!open) setActivityDialogProjectId(null);
					},
					isSubmitting: createActivityMutation.isPending,
					onSubmit: handleCreateActivity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectDeleteDialog, {
					open: Boolean(projectDeleteTarget),
					onOpenChange: (open) => {
						if (!open) setProjectDeleteTarget(null);
					},
					project: projectDeleteTarget,
					isDeleting: deleteProjectMutation.isPending,
					onConfirm: handleDeleteProject
				})
			]
		})
	});
}
//#endregion
export { useWorkspaceShell as n, WorkspaceShell as t };
