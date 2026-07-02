const workspaceEn = {
  sidebar: {
    workspace: "Workspace",
    projects: "Projects",
    members: "Members",
    billing: "Billing",
    organizationProfile: "Organization Profile",
    sectionTitle: "Projects",
    projectSingular: "Project",
    projectPlural: "Projects",
    addProject: "Add project",
    activities: "Activities",
    addActivity: "Add activity",
    noProjects: "No projects yet",
    createFirstProject: "Create your first project to start the workspace.",
    overview: "Overview",
    analytics: "Analytics",
    insights: "Insights",
    brief: "Overview",
    dataReview: "Data Review",
    activityAnalysis: "Analysis",
    activityInsights: "Insights",
    activitySettings: "Settings",
    projectSettings: "Project Settings",
    organizationSettings: "Organization Settings",
    projectActions: "Project actions",
    deleteProject: "Delete project",
    readOnlyProject: "Read-only project view",
  },
  status: {
    planning: "Planning",
    active: "Active",
    completed: "Completed",
  },
  role: {
    ORGANIZATION_ADMIN: "Organization Admin",
    PROJECT_MANAGER: "Project Manager",
  },
  organizationCard: {
    eyebrow: "Organization",
    noMission:
      "Add a short mission statement to make this workspace easier to recognize.",
    members: "Members",
    projects: "Projects",
    workspace: "Workspace",
    workspaceReady: "Ready",
    readOnly: "Read-only",
  },
  organizationPage: {
    eyebrow: "Organization Workspace",
    adminTitle: "Organization workspace",
    managerTitle: "My workspace",
    adminDescription:
      "View the full organization, monitor project ownership, and guide the team into the evidence workflow.",
    managerDescription:
      "You are part of this organization. Open your projects or create the next one you want to manage.",
    primaryAction: "Create project",
    emptyTitle: "No projects yet",
    emptyDescription:
      "Projects help organize evidence across activities, uploads, analytics, and insights.",
    emptyAction: "Create your first project",
    projectOverview: "Project overview",
    myProjects: "My projects",
    recentActivity: "Recent activity",
    membersSummary: "Members summary",
    manageMembers: "Manage members",
    analyticsPlaceholder: "Organization analytics",
    analyticsAdminDescription:
      "Organization-wide analytics and insights will expand here as more evidence flows in.",
    analyticsManagerDescription:
      "Use your projects to build evidence. Organization-wide analytics remain visible to admins.",
    activitiesLabel: "activities",
    noProjectDescription: "No project description yet.",
  },
  organizationSettings: {
    eyebrow: "Organization Settings",
    title: "Organization profile",
    description:
      "Update your organization name, mission, and logo. Once saved, the workspace card refreshes immediately.",
    settingsEyebrow: "Workspace Settings",
    settingsTitle: "Organization settings",
    settingsDescription:
      "Keep the organization profile separate from future workspace-level settings.",
    settingsPlaceholder:
      "Additional workspace-level settings can be added here without mixing them into the organization profile.",
    general: "General",
    generalDescription:
      "Manage the visible identity of your organization inside this workspace.",
    nameLabel: "Organization name",
    namePlaceholder: "PHINEO",
    missionLabel: "Mission",
    missionPlaceholder:
      "Briefly explain what your organization does and how your team uses evidence.",
    logoLabel: "Organization logo",
    logoDescription:
      "PNG, JPG, JPEG, or WebP. Drag a file here or choose one from your computer.",
    previewLabel: "Preview",
    previewDescription:
      "If no logo exists yet, a fallback avatar with initials is shown automatically.",
    chooseLogo: "Choose logo",
    replaceLogo: "Replace logo",
    selectedLogo: "Selected logo",
    save: "Save changes",
    saving: "Saving…",
    success: "Organization updated.",
    failure: "Organization update failed.",
    invalidFile: "Please upload a PNG, JPG, JPEG, or WebP image.",
    dropzoneTitle: "Drop your logo here",
    dropzoneAction: "Choose a file from your computer",
  },
  organizationProjects: {
    eyebrow: "Projects",
    title: "Projects in this workspace",
    description:
      "Open an existing project or create the next one you want to manage.",
    primaryAction: "Create project",
    noDescription: "No project description yet.",
    activities: "activities",
  },
  organizationActivities: {
    eyebrow: "Activities",
    title: "Activities across my projects",
    description:
      "Open any activity you own to continue uploading evidence or reviewing insights.",
    noDescription: "No activity description yet.",
    openActivity: "Open activity",
  },
  members: {
    eyebrow: "Members",
    title: "Invite and manage your project managers",
    description:
      "Invite project managers, review the current member list, and keep ownership clear.",
    inviteTitle: "Invite your team",
    inviteDescription:
      "Create invitation records for project managers so they can join and start creating projects.",
    emailPlaceholder: "team@organization.org",
    projectManagerRole: "Project Manager",
    organizationAdminRole: "Organization Admin",
    sendInvitation: "Send invitation",
    inviting: "Sending invitation…",
    inviteSuccess: "Invitation created.",
    inviteFailure: "Invitation could not be created.",
    pendingInvitations: "Pending invitations",
    pendingStatus: "Pending acceptance",
    currentMembers: "Current members",
    removeAction: "Remove",
    removeSuccess: "Member removed.",
    removeFailure: "Member could not be removed.",
  },
  organizationBilling: {
    eyebrow: "Billing",
    title: "Subscription and billing",
    description:
      "Billing remains organization-level so project ownership rules stay simple.",
    placeholder:
      "Subscription management can be added here later without changing the project and activity model.",
  },
  projectPage: {
    viewInsights: "View insights",
    activitiesTitle: "Activities",
    activitiesDescription: "Each activity owns its own upload and job history.",
    noActivitiesTitle: "No activities yet",
    noActivitiesDescription:
      "Use the plus button next to Activities in the sidebar to add the first activity.",
    noActivityDescription: "No activity description yet.",
    quickAction: "Add activity",
    uploadsReady: "Ready",
    lastUpdated: "Now",
    privacyTitle: "Your evidence stays private",
    privacyDescription:
      "Personal identifiers remain outside the AI layer. The backend already stores uploads and mocked job progression; semantic interpretation comes later.",
  },
  projectSettings: {
    eyebrow: "Project Settings",
    title: "Project settings",
    description:
      "Review the current project configuration and manage irreversible actions carefully.",
    general: "Project details",
    generalDescription:
      "These values reflect the live project metadata stored in the backend.",
    dangerTitle: "Delete project",
    dangerDescription:
      "Deleting a project permanently removes all activities, uploads, jobs, review outputs, analyses, and insights linked to it.",
    deleteAction: "Delete project",
    notSet: "Not set",
    fields: {
      status: "Status",
      organization: "Organization",
      timeline: "Timeline",
      location: "Location",
      funding: "Funding source",
      goal: "Programme goal",
      created: "Created",
      updated: "Updated",
    },
  },
  projectDelete: {
    title: "Delete this project?",
    description:
      "This action cannot be undone. Deleting this project will permanently delete:",
    confirmLabel: "To confirm, type the project name:",
    confirmAction: "Delete permanently",
    deleting: "Deleting…",
    success: "Project deleted successfully.",
    failure: "Project could not be deleted. Please try again.",
    impacts: {
      activities: "all activities",
      datasets: "all uploaded datasets",
      jobs: "all processing jobs",
      reviews: "all data review results",
      analyses: "all analyses",
      insights: "all insights",
    },
  },
  dialogs: {
    cancel: "Cancel",
    create: "Create",
    createProjectTitle: "Create project",
    createProjectDescription:
      "Add the core programme information for this project.",
    createActivityTitle: "Add activity",
    createActivityDescription:
      "Capture the delivery details for a project activity.",
    project: {
      submit: "Create project",
      creating: "Creating project…",
      success: "Project created.",
      failure: "Project creation failed.",
      name: "Project name",
      namePlaceholder: "Mentoring Programme 2026",
      description: "Description",
      descriptionPlaceholder:
        "A six-month mentoring programme matching senior volunteers with young adults to improve confidence, employability and social inclusion.",
      programGoal: "Programme goal",
      programGoalPlaceholder:
        "Increase youth employability through long-term mentoring relationships.",
      startMonth: "Start month / year",
      endMonth: "End month / year",
      country: "Country",
      countryPlaceholder: "Germany",
      regionCity: "Region / City",
      regionCityPlaceholder: "Berlin",
      organization: "Organization",
      sdgs: "SDGs",
      targetBeneficiaries: "Target beneficiaries",
      fundingSource: "Funding source",
      fundingSourcePlaceholder: "Erasmus+",
      status: "Status",
    },
    activity: {
      submit: "Create activity",
      creating: "Creating activity…",
      success: "Activity created.",
      failure: "Activity creation failed.",
      name: "Activity name",
      namePlaceholder: "Senior Mentor Training",
      description: "Description",
      descriptionPlaceholder: "Two-day training for volunteer mentors.",
      activityType: "Activity type",
      owner: "Owner",
      ownerPlaceholder: "Programme Manager",
      startDate: "Start date",
      endDate: "End date",
      objectives: "Objectives",
      objectivesPlaceholder:
        "Prepare 40 mentors to facilitate safe, consistent mentoring sessions.",
      expectedOutcomes: "Expected outcomes",
      expectedOutcomesPlaceholder:
        "Improved mentoring confidence and stronger safeguarding practice.",
      successIndicators: "Success indicators",
      successIndicatorsPlaceholder:
        "Attendance above 85%, safeguarding sign-off for all participants.",
      targetAudience: "Target audience",
      targetAudiencePlaceholder: "Returning volunteer mentors",
      beneficiaryGroup: "Beneficiary group",
      beneficiaryGroupPlaceholder: "Youth",
      status: "Status",
    },
    options: {
      sdgs: ["SDG 3", "SDG 4", "SDG 5", "SDG 10"],
      targetBeneficiaries: [
        "Youth",
        "Seniors",
        "Refugees",
        "Women",
        "Teachers",
      ],
      activityTypes: [
        "Mentoring Session",
        "Workshop",
        "Training",
        "Outreach",
        "Assessment",
        "Other",
      ],
    },
  },
} as const;

type DeepStringShape<T> = {
  [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends readonly (infer Item)[]
      ? Item extends string
        ? string[]
        : DeepStringShape<Item>[]
      : T[Key] extends Record<string, unknown>
        ? DeepStringShape<T[Key]>
        : T[Key];
};

export type WorkspaceTranslationDictionary = DeepStringShape<
  typeof workspaceEn
>;

export default workspaceEn;
