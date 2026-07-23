const en = {
  language: {
    switcherLabel: "Language",
    german: "DE",
    english: "EN",
  },
  common: {
    brand: "Impact Atlas",
    evidenceWorkspace: "Evidence Workspace",
    logIn: "Log in",
    register: "Register",
    logOut: "Log out",
    search: "Search…",
    searchAria: "Search",
    create: "Create",
    loading: "Loading…",
    tryAgain: "Try again",
    goHome: "Go home",
    yes: "Yes",
    no: "No",
    other: "Other",
    now: "Now",
    open: "Open",
    ready: "Ready",
    optional: "Optional",
    required: "Required",
    back: "Back",
    continue: "Continue",
    close: "Close",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The requested page does not exist or is no longer available.",
    backToHome: "Back to home",
  },
  landing: {
    createWorkspace: "Create workspace",
    header: {
      navHowItWorks: "How it works",
      navFaq: "FAQ",
      navAboutUs: "About us",
    },
    hero: {
      pilotBadge: "Pilot phase from August 2026",
      freeBadge: "Free participation",
      titleLine1: "Less time on funder reports.",
      titleLine2: "More clarity on ",
      titleHighlight: "your impact.",
      description:
        "Impact Atlas brings project data, evidence, and impact information together in one place, so your team writes reports faster and sees more clearly what your work achieves.",
      ctaPrimary: "View pilot programme",
      ctaSecondary: "Book a 15-minute call",
      trustItems: [
        "Reuse your existing data",
        "Personal onboarding",
        "No technical setup",
      ],
      mockupAlt:
        "Impact Atlas dashboard preview showing a mentoring programme's overview, its recent activities, and an impact insights panel with a 79% relationship-capital score.",
    },
    problem: {
      title: "Does this sound familiar?",
      items: [
        {
          title: "Information scattered everywhere",
          description:
            "Project data, evidence, and documents sit across different file systems, folders, emails, and the nearest USB stick.",
        },
        {
          title: "Reports take too long",
          description:
            "Too much time goes into collecting data, formatting it, and chasing answers — just to capture what the work actually achieved.",
        },
        {
          title: "Unclear impact",
          description:
            "It's hard to see what your work is actually achieving, and which results genuinely make a difference.",
        },
      ],
    },
    howItWorks: {
      title: "How Impact Atlas helps",
      steps: [
        {
          title: "Collect",
          description:
            "Gather project data and evidence automatically, instead of organizing it yourself by hand.",
        },
        {
          title: "Understand",
          description:
            "Understand and analyze the data. Make impact visible — with clear metrics and insights.",
        },
        {
          title: "Report",
          description:
            "Create and share reports. Fast, well-founded, and precise — tailored to what your funders need.",
        },
      ],
    },
    trustBar: {
      statement:
        "Impact Atlas is designed according to GDPR principles. We reduce direct personal identifiers before AI processing, use controlled AWS infrastructure, do not use customer data to train general AI models, and delete customer data when the service ends.",
    },
    pilotProgram: {
      title: "Our pilot programme",
      whatYouGet: {
        title: "What you get",
        items: [
          "Access to Impact Atlas during the 2026 pilot phase",
          "Personal onboarding and walkthrough",
          "Support from our team of experts",
          "Regular check-ins & feedback rounds",
        ],
      },
      whatYouBring: {
        title: "What you bring",
        items: [
          "An existing project or programme",
          "Results and evidence you already have",
          "Willingness to collaborate and share feedback",
        ],
      },
      goodToKnow: {
        title: "Good to know",
        items: [
          "Free participation",
          "About 2–3 hours of time per month",
          "Runtime: August – September 2026",
          "Spots are limited",
        ],
      },
      afterPilot: {
        title: "After the pilot",
        items: [
          "You get an evaluation with insights",
          "Joint feedback for optimization",
          "Access to Impact Atlas on special terms (optional)",
        ],
      },
    },
    cta: {
      titleBefore: "Ready for ",
      titleHighlight1: "less effort",
      titleMiddle: " and ",
      titleHighlight2: "more impact",
      titleAfter: "?",
      description:
        "Book a no-obligation call now. We'll show you how Impact Atlas takes work off your team's plate and makes your impact visible.",
      primary: "Request a call",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question:
            "How much effort does taking part in the pilot programme mean?",
          answer:
            "During the pilot programme, plan for an average of two to three hours per month. Most of the effort happens at the beginning: in a personal onboarding session, we set up your project together, clarify your reporting requirements, and discuss which existing data and evidence you want to use.\n\nAfter that, you upload existing project documents and review the information prepared by Impact Atlas. Additional time is mainly needed for short feedback conversations so we can understand what is helpful in your day-to-day work and where the platform should still be improved.\n\nYou do not need to build a new monitoring structure or start additional data collection for this. The pilot programme is intended to fit into your existing workflows as smoothly as possible, not create new bureaucracy. In the first month, the effort may be slightly higher because of onboarding; after that, participation mainly focuses on use, review, and feedback.",
        },
        {
          question: "What data can we use with Impact Atlas?",
          answer:
            "Impact Atlas is designed to work with the data and evidence that already exist in your project. This can include, for example:\n\n• Excel and CSV files with indicators, participant numbers, or activities\n• Word documents and PDF reports\n• Narrative and interim reports\n• Attendance lists and event overviews\n• Exports from survey or data-collection tools\n• Minutes, conversation notes, and qualitative feedback\n• Project concepts, theories of change, and funding documents\n• Evidence of completed activities and achieved results\n\nThe files do not need to be perfectly prepared. One of the goals of Impact Atlas is precisely to bring together information from different documents and spreadsheets and make it easier to use.\n\nDuring onboarding, we discuss together which materials make sense for your use case. The principle is simple: only upload data that are actually needed for the analysis. Particularly sensitive or unnecessary personal data should, where possible, be removed or pseudonymized beforehand. If your use case requires personal data, we clarify in advance how they can be handled in a data-protection-compliant way.",
        },
        {
          question:
            "How does Impact Atlas use artificial intelligence and how are personal data protected?",
          answer:
            "Impact Atlas uses AI to structure, summarize, and place information from uploaded project documents into a clear and understandable context. For example, the AI can identify relevant content, assign evidence to different activities, describe developments, and point out missing or contradictory information.\n\nThe protection of personal data begins before content is sent to the AI model. An integrated PII scanner detects direct identifiers, currently especially personal names, and replaces them with pseudonymous placeholders. This means the model does not receive a name such as “Maria Mustermann”, but instead a neutral label such as “Person 01”. This pseudonymization reduces risk, but it does not replace all other data-protection measures.\n\nOrganizations should therefore upload only the data required for the specific purpose and, where possible, remove particularly sensitive or unnecessary details before upload. Pseudonymized information is not automatically anonymous in legal terms and may still fall under the GDPR.\n\nAI processing is carried out via Amazon Bedrock. According to AWS, the providers of the foundation models made available there do not have access to customer prompts or generated responses. AWS also states that inputs and outputs are not used to train the foundation models.\n\nImpact Atlas uses AI as a supporting tool. The results should be reviewed by users and do not replace professional or legal judgment.",
        },
        {
          question: "Is our organization legally bound by joining?",
          answer:
            "Taking part in the pilot programme does not oblige your organization to continue using Impact Atlas on a paid basis afterwards. There is no automatic conversion into a paid subscription and no later obligation to buy.\n\nFor the pilot phase, we only agree the framework of the collaboration. This can include, for example, the duration of the pilot, how data are handled, responsibilities, and the opportunity to provide feedback on the platform. Your organization remains in control of its own project information and decides which data are used for the pilot.\n\nIf you want to end the pilot programme early, we discuss together how to proceed and how to handle the data uploaded up to that point. Any later use of Impact Atlas is only agreed if both sides explicitly want that.",
        },
        {
          question: "How much setup work is involved?",
          answer:
            "You do not need your own IT department for setup, and you do not have to install new software in your organization. Impact Atlas is used through the browser.\n\nAt the beginning, we carry out a personal onboarding session. Together, we set up your first project and discuss topics such as:\n\n• What goals and activities does the project include?\n• Which indicators or reporting obligations are relevant?\n• What data and evidence already exist?\n• Who within your organization should work with Impact Atlas?\n• Which analyses or reporting questions are especially important to you?\n\nAfter that, you can assign existing files directly to the relevant project or the appropriate activities. You do not need to migrate your entire existing filing structure or design a new data structure before you begin.\n\nThroughout the pilot phase, we support you personally with questions about setup, selecting suitable materials, and using the results. The goal is to start working as quickly as possible with a real project and your existing data.",
        },
        {
          question:
            "What happens to our data if we do not continue using Impact Atlas after the pilot?",
          answer:
            "After the pilot programme ends, you decide for yourself whether you want to continue using Impact Atlas. There is no automatic renewal and no obligation to enter into a paid offer.\n\nIf you decide not to continue, your access will be terminated and all data uploaded by your organization will be deleted. This also applies to information and results that Impact Atlas created on the basis of those data.\n\nYour data remain your data at all times. Impact Atlas does not sell them, does not pass them on to other organizations, and does not use them for other purposes without your consent. Before deletion, you can export the results relevant to you, provided that this export option is part of the pilot scope.",
        },
      ],
    },
    footer: {
      tagline: "Less effort. More impact.",
      impressum: "Imprint",
      datenschutz: "Privacy policy",
      agb: "Terms",
      rights: "Impact Atlas. All rights reserved.",
    },
  },
  legal: {
    impressum: {
      title: "Imprint",
      placeholder: "Placeholder — imprint content to be added.",
    },
    datenschutz: {
      title: "Privacy policy",
      placeholder: "Placeholder — privacy policy content to be added.",
    },
    agb: {
      title: "Terms & conditions",
      placeholder: "Placeholder — terms & conditions content to be added.",
    },
    ueberUns: {
      title: "About us",
      placeholder: "Placeholder — about-us content to be added.",
    },
  },
  auth: {
    loginMarketingTitle:
      "Build a grant evidence workspace before the AI layer.",
    loginMarketingDescription:
      "Start with organizations, projects, activities, authentication, and a durable backend. Semantic processing comes later.",
    registerMarketingTitle: "Your projects already tell a story.",
    registerMarketingDescription:
      "Create your account first, then provision the workspace, refine the organization profile, and invite your project managers.",
    loginTitle: "Log in",
    loginDescription: "Sign in to access your organization workspace.",
    registerTitle: "Create account",
    registerDescription:
      "After registration, you can create projects, upload evidence, and clearly present the impact of your programmes with meaningful analyses, visualizations, and reports.",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    organizationName: "Organization name",
    emailPlaceholder: "team@organization.org",
    passwordPlaceholder: "At least 8 characters",
    hiddenPasswordPlaceholder: "••••••••",
    fullNamePlaceholder: "Jane Doe",
    organizationPlaceholder: "Example Foundation",
    loggingIn: "Logging in…",
    creatingAccount: "Creating account…",
    creatingWorkspace: "Creating workspace…",
    createAccount: "Create account",
    newHere: "New here?",
    createAnAccount: "Create an account",
    alreadyHaveAccount: "Already have an account?",
    noOrganizationToast: "No organization is linked to this account yet.",
    loginSuccessToast: "Logged in.",
    loginFailed: "Login failed.",
    registerSuccessToast: "Account created.",
    registerFailed: "Registration failed.",
    workspaceProvisioningTitle: "Create the organization workspace first.",
    workspaceProvisioningDescription:
      "Create the organization record before inviting project managers and routing them into the workspace.",
    workspaceProvisioningCardTitle: "Create workspace",
    workspaceProvisioningCardDescription:
      "Use the organization name exactly as your team expects to see it inside Impact Atlas.",
    workspaceCreatedToast: "Workspace created.",
    workspaceCreateFailed: "Workspace could not be created.",
    welcomeTitle: "Welcome to Impact Atlas.",
    welcomeDescription:
      "Your workspace is ready. Configure the organization before inviting the rest of the team.",
    welcomeCardTitle: "Your workspace is ready.",
    welcomeCardDescription:
      "Let's configure your organization before inviting your team.",
    profileTitle: "Give the workspace an identity.",
    profileDescription:
      "Keep the organization profile intentionally lightweight: name, mission, and logo.",
    inviteTitle: "Invite your team.",
    inviteDescription:
      "Invite your project managers so they can start creating projects and uploading evidence.",
    inviteCardTitle: "Invite Project Managers",
    inviteCardDescription:
      "Email sending can stay mocked for now. We only need invitation records and a working acceptance flow.",
    inviteSuccessToast: "Invitation sent.",
    inviteFailedToast: "Invitation could not be created.",
    projectManagerOnly: "Role: Project Manager",
    inviting: "Sending invitation…",
    sendInvitation: "Send invitation",
    pendingInvitation: "Pending acceptance",
    finishOnboarding: "Finish onboarding",
    invitationTitle: "Accept your invitation.",
    invitationDescription:
      "Join the organization, create your password, then sign in to enter the workspace.",
    invitationCardTitle: "Accept invitation",
    invitationCardDescription:
      "You are joining {{organization}} with {{email}}.",
    invitationExistingAccountDescription:
      "This invitation is linked to an existing account. Sign in as {{email}} to join {{organization}}.",
    invitationExistingAccountMismatch:
      "You are signed in as {{signedInEmail}}. Sign in as {{invitedEmail}} to accept this invitation.",
    acceptingInvitation: "Accepting invitation…",
    acceptInvitation: "Accept invitation",
    signInToAcceptInvitation: "Sign in to accept invitation",
    invitationAccepted: "Invitation accepted. You can sign in now.",
    invitationAcceptedExistingAccount:
      "Invitation accepted. Redirecting to the workspace.",
    invitationAcceptFailed: "Invitation could not be accepted.",
  },
  organization: {
    loading: "Loading workspace…",
    loadFailed: "Workspace could not be loaded.",
    eyebrow: "Organization Workspace",
    description:
      "Create projects, add activities, and route users into the evidence workspace.",
    stats: {
      projects: "Projects",
      activities: "Activities",
      role: "Role",
      status: "Status",
      ready: "Ready",
      backendConnected: "Backend connected",
    },
    createProject: "Create project",
    projectName: "Project name",
    projectNamePlaceholder: "Youth Mentoring Programme",
    descriptionLabel: "Description",
    projectDescriptionPlaceholder: "Optional summary for the team",
    creatingProject: "Creating…",
    createProjectToast: "Project created.",
    createProjectFailed: "Project creation failed.",
    noProjectsTitle: "No projects yet",
    noProjectsDescription:
      "Create the first project for this organization to unlock the workspace routes.",
    projectEyebrow: "Project",
    noProjectDescription: "No project goal captured yet.",
    openProject: "Open project",
    noActivityDescription: "No activity description yet.",
    uploads: "uploads",
    jobs: "jobs",
    results: "results",
    addActivityNamePlaceholder: "Add activity name",
    addActivityDescriptionPlaceholder: "Optional short description",
    addingActivity: "Adding…",
    addActivity: "Add activity",
    createActivityToast: "Activity created.",
    createActivityFailed: "Activity creation failed.",
  },
  project: {
    loading: "Loading project…",
    loadFailed: "Project could not be loaded.",
    crumbsOrganization: "Organization",
    sidebarProject: "Project",
    sidebarOverview: "Overview",
    sidebarAnalytics: "Analytics",
    sidebarInsights: "AI knowledge",
    sidebarActivities: "Activities",
    sidebarBrief: "Activity Brief",
    sidebarUpload: "Upload",
    viewInsights: "Open AI knowledge",
    eyebrow: "Project",
    noDescription: "No project goal captured yet.",
    readOnlyBannerTitle: "Viewing as Organization Admin",
    readOnlyBannerDescription:
      "This project is owned by {{owner}}. You can review it here, but edits remain restricted to the owner.",
    unknownOwner: "another project manager",
    stats: {
      activities: "Activities",
      activitiesDelta: "Tracked inside this project",
      status: "Project status",
      statusDelta: "Current delivery stage",
      uploads: "Evidence uploaded",
      uploadsDelta: "Across all activities",
      lastUpdated: "Last updated",
      lastUpdatedDelta: "Latest project change",
    },
    dashboard: {
      health: "Project health",
      evidenceCompleteness: "Evidence completeness",
      insightsGenerated: "AI knowledge ready",
      lastEvidenceUpload: "Last evidence upload",
      whatNeedsAttention: "What needs attention",
      recentActivity: "Recent activity",
      noRecentActivity: "No project changes yet.",
      healthStates: {
        strong: "Strong",
        progress: "In progress",
        attention: "Needs attention",
      },
      healthDescriptions: {
        strong: "Evidence is uploaded, and AI knowledge is already available.",
        progress:
          "Evidence has started flowing and AI processing is still underway.",
        attention:
          "This project still needs evidence uploads or review before AI knowledge is ready.",
      },
      completenessValue: "{{withEvidence}}/{{total}} activities",
      completenessDelta: "{{percent}}% already have evidence",
      insightsDelta: "{{count}} pending",
      insightsReadyDelta: "Ready to open",
      noInsightsDelta: "No AI knowledge ready yet",
      noUploadValue: "None yet",
      noUploadDelta: "Upload evidence to start the pipeline",
      attentionItems: {
        noEvidence: "No evidence has been uploaded yet.",
        partialEvidence: "{{count}} activities still need evidence uploads.",
        pendingInsights: "{{count}} AI knowledge runs are still in progress.",
        failedJobs: "{{count}} processing jobs need attention.",
        healthy:
          "Every activity has evidence, and no issues need review right now.",
      },
      recentActivityTypes: {
        activity_created: "Activity created",
        dataset_uploaded: "Dataset uploaded",
        job_completed: "Processing completed",
        job_failed: "Processing needs review",
        insight_generated: "AI knowledge generated",
      },
      recentActivityActivitySuffix: "for {{name}}",
    },
    emptyStateTitle: "No activities yet",
    emptyStateDescription:
      "Activities are workshops, trainings, mentoring sessions, or other interventions where you upload evidence.",
    emptyStateSupporting:
      "Create the first activity to keep uploads, analytics, and AI knowledge separate for each intervention.",
    emptyStateAction: "Create your first activity",
    addAnotherActivity: "Add another activity",
    activityNamePlaceholder: "Activity name",
    activityDescriptionPlaceholder: "Optional short description",
    addingActivity: "Adding…",
    addActivity: "Add activity",
    activitiesHeading: "Activities",
    activitiesDescription: "Each activity owns its upload and job history.",
    noActivityDescription: "No activity description yet.",
    brief: "Brief",
    upload: "Upload",
    open: "Open",
    privacyTitle: "Your evidence stays private",
    privacyDescription:
      "Personal identifiers stay out of the AI layer. The backend already stores uploads and mocked job progression; semantic interpretation comes later.",
    programmeAnalytics: "Programme analytics",
  },
  projectWorkspace: {
    noDescription: "No project summary has been added yet.",
    tabs: {
      overview: "Overview",
      activities: "Activities",
      evidence: "Evidence",
      interpretation: "Interpretation",
      analytics: "Analytics",
      comingSoon: "Soon",
    },
    overview: {
      title: "Overview",
      description:
        "Review the full project profile, logic model, and reporting context. Edit the programme details here when needed.",
    },
    activities: {
      title: "Activities",
      description:
        "Plan and manage the interventions that structure evidence collection and reporting for this project.",
      emptyTitle: "No activities yet",
      emptyDescription:
        "Activities are workshops, mentoring sessions, trainings, or other interventions where evidence is collected.",
      emptyAction: "Create first activity",
      defaultType: "Activity",
      noDescription: "No activity description yet.",
      noDate: "No date set yet",
      evidenceCount: "{{count}} evidence files",
      uploadCount: "{{count}} uploads",
      insightCount: "{{count}} insights",
      openActivity: "Open activity",
      editActivity: "Edit",
      deleteActivity: "Delete",
      deleteConfirmation:
        "Delete the activity “{{name}}”? All linked evidence will also be removed.",
      deleteSuccess: "Activity deleted.",
      deleteFailure: "Activity could not be deleted.",
    },
    evidence: {
      title: "Evidence",
      description:
        "Manage uploaded files by activity. Evidence stays grouped by the work it belongs to.",
      emptyTitle: "No activities available for evidence yet",
      emptyDescription:
        "Create an activity first. Every evidence upload in Impact Atlas belongs to a specific activity.",
      openActivity: "Open activity",
      uploadAction: "Upload evidence",
      uploading: "{{name}} is being uploaded…",
      loading: "Loading evidence…",
      noFiles: "No evidence uploaded yet for this activity.",
      openFile: "Open file",
      analyzeFile: "Analyze",
      retryAnalysis: "Retry analysis",
      reviewPrivacy: "Review privacy",
      approvePrivacy: "Approve and continue",
      approvingPrivacy: "Approving…",
      analysisInProgress: "Processing…",
      analysisCompleted: "Processing complete",
      reviewedStatus: "Reviewed",
      analysisStarted: "Evidence analysis started.",
      analysisStartFailed: "Evidence analysis could not be started.",
      privacyApprovalSuccess: "Privacy review approved.",
      privacyApprovalFailed: "Privacy review could not be approved.",
      privacyReviewTitle: "Privacy review",
      privacyReviewDescription:
        "Confirm how detected names and addresses should be handled before Impact Atlas continues with the privacy-safe representation.",
      loadingPrivacyReview: "Loading privacy review…",
      noPrivacyFindings: "No privacy findings available yet.",
      privacyFindingSummary:
        "{{entityType}} detected {{count}} time(s). Recommended action: {{action}}.",
      analysisDialogAnalyzingTitle: "Analyzing your file…",
      analysisDialogAnalyzingDescription:
        "Impact Atlas is parsing the file and checking for names and addresses. You can close this and keep working — it'll keep running in the background.",
      analysisDialogReadyTitle: "Ready for privacy review",
      analysisDialogReadyDescription:
        "Impact Atlas finished analyzing this file. Review the detected findings before it continues.",
      analysisDialogFailedTitle: "Analysis failed",
      analysisDialogFailedFallback:
        "The file could not be analyzed due to an unexpected error.",
      reviewFile: "File",
      reviewActivity: "Activity",
      reviewStatus: "Review status",
      reviewStates: {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
      },
      reviewUnknownFile: "Unknown file",
      reviewUnknownActivity: "Unknown activity",
      detectedFindingsTitle: "Detected findings",
      detectedFindingsDescription:
        "{{count}} findings detected. {{decisions}} item(s) still require an explicit transformation choice.",
      decisionRequired: "Decision required",
      gdprNoticeIntro:
        "We found names or addresses in this dataset. For each item below, choose how Impact Atlas should transform it before the dataset continues into privacy-safe processing.",
      recommendationSentence:
        "We recommend that Impact Atlas {{verb}} this {{entityType}} data before the dataset is used further.",
      recommendationSentenceWithExample:
        'We recommend that Impact Atlas {{verb}} this {{entityType}} data before the dataset is used further. Example value: "{{example}}".',
      recommendationVerbKeep: "keep",
      recommendationVerbTokenize: "replace it with a stable pseudonymous token",
      recommendationVerbGeneralize: "reduce it to a broader non-specific value",
      recommendationVerbRemove: "remove",
      recommendationVerbRestrict: "redact the risky parts of",
      recommendedActionBadge: "Recommended",
      keepOverrideWarning:
        "Impact Atlas will keep this data unchanged. If you refuse tokenization, you must confirm that you understand this decision and agree to the applicable terms and conditions.",
      keepUnchangedAcknowledgementLabel:
        "I am intentionally refusing the recommended tokenization and confirm that I accept responsibility for this decision and agree to Impact Atlas terms and conditions.",
      keepUnchangedAcknowledgementRequired:
        "Confirm this warning if you want to keep the data unchanged.",
      overrideFindingWarning:
        "You selected a different transformation than the recommendation. Explain why this override is appropriate.",
      overrideReasonLabel: "Reason for this override (required)",
      overrideReasonPlaceholder:
        'Explain why this alternate transformation is appropriate, e.g. "this PERSON match is a project name, not a real person."',
      overrideReasonTooShort:
        "Please provide a more detailed reason (at least 10 characters).",
      reviewDecisionsIncomplete:
        "Choose a transformation for every flagged finding above before continuing.",
      reviewApprovalLocked:
        "Approval is only available while the job is waiting for privacy review.",
      transformation: {
        keep: "Keep",
        tokenize: "Tokenize",
        generalize: "Generalize",
        remove: "Remove",
        restrict: "Restrict",
      },
      reviewUnavailableTitle: "Privacy review unavailable",
      reviewUnavailableDescription:
        "This processing job could not be loaded or is no longer available for review.",
      reviewCompletedTitle: "Privacy review completed",
      reviewCompletedDescription:
        "This file has already been approved and converted into a privacy-safe representation.",
      reviewTransformingTitle: "Privacy-safe representation in progress",
      reviewTransformingDescription:
        "The privacy review is approved. Impact Atlas is currently creating the privacy-safe representation.",
      parsedRepresentationTitle: "Parsed representation",
      parsedRepresentationDescription:
        "Inspect the deterministic structure extracted from the uploaded file. This preview never shows raw personal values or paragraph text.",
      noParsedRepresentation:
        "No parsed representation is available for this review yet.",
      parsedFileType: "Parsed file type",
      parsedTableCount: "Tables",
      parsedParagraphCount: "Paragraphs",
      parsedSourceType: "File extension",
      parsedTableFallback: "Table {{index}}",
      parsedRowCount: "Rows",
      parsedColumnCount: "Columns",
      parsedColumnsLabel: "Columns",
      parsedParagraphSummaryTitle: "Paragraph structure",
      parsedParagraphLabel: "Paragraph {{index}}",
      parsedCharacterCount: "Characters",
      parsedPageLabel: "Page",
      parsedNone: "None",
      analysisStatus: "Analysis",
      notStarted: "Not started",
      analysisStates: {
        queued: "Queued",
        processing: "Processing",
        awaiting_privacy_review: "Awaiting privacy review",
        transforming: "Creating privacy-safe representation",
        completed: "Processing complete",
        failed: "Failed",
        cancelled: "Cancelled",
      },
      removeFile: "Remove",
      removeSuccess: "Evidence removed.",
      removeFailed: "Evidence could not be removed.",
      openFailed: "{{name}} could not be opened.",
      metadataType: "Type",
      metadataSize: "Size",
      metadataUploadedAt: "Uploaded at",
      metadataUploadedBy: "Uploaded by",
      metadataStatus: "Status",
      unknownType: "Unknown type",
      unknownSize: "Unknown size",
      unknownUploader: "Unknown user",
    },
    interpretation: {
      understoodEmpty:
        'No interpretation results yet. Run "Interpret with AI" on an activity\'s evidence once its privacy review is approved.',
      questionDomainPreparationLabel: "Preparation",
      questionDomainInterpretationLabel: "Interpretation",
      questionAnsweredLabel: "Answered: {{value}}",
      questionRequiredLabel: "Required for review",
      questionOptionalLabel: "Optional",
      questionEdit: "Edit answer",
      questionSave: "Save answer",
      questionCancel: "Cancel",
      questionFreeTextPlaceholder: "Type your answer…",
      questionSubmit: "Submit",
      questionSubmitting: "Submitting…",
      reviewPrivacyAction: "Review privacy",
      noEvidenceYet: "No evidence uploaded yet.",
      simplified: {
        pageTitle: "AI knowledge",
        heroTitle: "One AI knowledge flow per activity.",
        heroDescription:
          "Add evidence to an activity, run one AI analysis, and then open one AI knowledge view for the activity as a whole.",
        statActivities: "Activities",
        statReady: "AI knowledge ready",
        statAttention: "Need attention",
        activitiesTitle: "Activities",
        activitySummary: {
          privacyReview:
            "{{count}} file in this activity is still waiting for privacy review.",
          privacyReview_other:
            "{{count}} files in this activity are still waiting for privacy review.",
          processing:
            "AI analysis is currently running across this activity's evidence.",
          questions:
            "{{count}} clarification question is still open before AI knowledge can be completed.",
          questions_other:
            "{{count}} clarification questions are still open before AI knowledge can be completed.",
          ready: "AI knowledge can now be generated for this activity.",
          reviewed: "AI knowledge is available for this activity.",
          notStarted: "AI analysis has not been started for this activity yet.",
        },
        activityMeta: "{{uploads}} files · {{interpreted}} interpreted",
        activityNoFiles: "No evidence has been uploaded for this activity yet.",
        questionsTitle: "Clarification questions",
        actionRunning: "Analyzing…",
        actionRunKnowledge: "Analyze with AI",
        actionRefreshKnowledge: "Refresh AI knowledge",
        actionOpenKnowledge: "Open AI knowledge",
        actionOpeningKnowledge: "Opening AI knowledge…",
        knowledgeDialogTitle: "AI knowledge",
        knowledgeDialogDescription:
          "Impact Atlas combined the interpreted evidence of this activity into one activity-level knowledge view.",
        knowledgeDialogLoading: "Loading AI knowledge…",
        knowledgeDialogError: "AI knowledge could not be loaded.",
        knowledgeDialogMeta:
          "{{count}} insights from {{evidenceCount}} evidence files",
        knowledgeDialogEmpty:
          "No activity-level AI knowledge is available yet.",
        status: {
          no_evidence: "No evidence",
          privacy_review: "Privacy review",
          processing: "In progress",
          questions: "Questions open",
          ready: "Ready",
          reviewed: "Available",
          not_started: "Not started",
        },
      },
    },
    analytics: {
      title: "Analytics",
      description:
        "Review deterministic metrics and charts generated from interpreted evidence.",
      notReadyTitle: "Analytics are not ready yet",
      notReadyDescription:
        "Analytics become available once enough evidence has been uploaded and interpreted successfully.",
    },
    insights: {
      title: "Insights",
      description:
        "Translate analytics into narrative findings, risks, and recommendations for reporting and decision-making.",
      notReadyTitle: "Insights are not ready yet",
      notReadyDescription:
        "Insights appear after evidence has been interpreted and at least one insight has been generated for this project.",
      executiveSummary: "Executive summary",
      nextSteps: "Suggested next steps",
    },
  },
  analytics: {
    aiCurated: "AI-curated",
    notDeduplicatedNote: "Sum across sources — not a deduplicated count.",
    narrativeTitle: "What the data suggests",
    fullCatalogTitle: "Explore more metrics",
    barChartSectionTitle: "Additional metrics in bar charts",
    qualitativeSignalsTitle: "Additional qualitative signals",
    featured: "Featured on this dashboard",
    notFeatured: "Not featured this time",
    omittedTitle: "Not yet calculable",
    quoteCount: "{{count}} supporting quote",
    quoteCount_other: "{{count}} supporting quotes",
    dataQualityTitle: "Data quality",
    groundingFallbackNotice:
      "Analytics were generated, but the automatic curation could not be confirmed; only metrics are shown, without narrative.",
    generatedAt: "Generated {{date}}",
    actions: {
      generate: "Refresh analytics",
      generating: "Generating…",
    },
    status: {
      NOT_STARTED: "Analytics have not been generated yet.",
      QUEUED: "Analytics are queued.",
      RUNNING: "Analytics are being generated…",
      COMPLETED: "Analytics are up to date.",
      COMPLETED_WITH_WARNINGS:
        "Analytics were generated. Some values are based on incomplete data.",
      FAILED: "Analytics could not be generated.",
      STALE:
        "New or changed verified evidence is available since the last calculation.",
    },
    dashboard: {
      eyebrow: "Configurable dashboard",
      title: "Evidence dashboard",
      exportLabel: "Export",
      exportJson: "Export JSON",
      exportText: "Export text",
      exportDocumentTitle: "Impact Atlas dashboard export",
      exportDocumentScopeLabel: "Scope",
      exportDocumentProjectLabel: "Project",
      exportDocumentActivityLabel: "Activity",
      exportDocumentSchemaLabel: "Schema",
      exportDocumentCompatibilitySourceLabel: "Compatibility source",
      exportDocumentWarningsTitle: "Data quality warnings",
      exportSuccess: "Dashboard export created.",
      exportFailed: "Dashboard export could not be created.",
      compatibilityFallback: "Legacy analytics record",
      showCustomizer: "Customize widgets",
      hideCustomizer: "Hide customizer",
      restoreRecommended: "Restore recommended layout",
      customizerTitle: "Visible widgets",
      customizerDescription:
        "Show, hide, and reorder widgets to match how this project should be reviewed.",
      savingLayout: "Saving layout…",
      hideWidget: "Hide widget",
      hiddenBadge: "Hidden",
      visibleBadge: "Visible",
      hiddenWidgetsTitle: "{{count}} hidden widget",
      hiddenWidgetsTitle_other: "{{count}} hidden widgets",
      fallbackSummaryTitle: "In plain language",
      fallbackSummaryDescription:
        "A grounded summary assembled from the deterministic evidence catalog.",
      fallbackThemesDescription:
        "Repeated themes surfaced in the current catalog.",
      hiddenWidgetsDescription:
        "Keep this area compact, then review hidden widgets in a clearer library with labels, context, and restore actions.",
      hiddenWidgetsPreview: "Recently hidden",
      hiddenWidgetsManage: "Browse hidden widgets",
      hiddenWidgetsManagerTitle: "{{count}} hidden widgets",
      hiddenWidgetsManagerDescription:
        "Search and review hidden widgets by widget type before adding them back to the dashboard.",
      hiddenWidgetsSearchPlaceholder:
        "Search by widget title, subtitle, or description…",
      hiddenWidgetsNoResults: "No hidden widgets match this search.",
      hiddenWidgetsNoResultsHint:
        "Try fewer words or search for a broader topic.",
      hiddenWidgetShow: "Show widget",
      hiddenWidgetTypeHorizontalBar: "Distribution chart",
      hiddenWidgetTypeLineSeries: "Timeline chart",
      hiddenWidgetTypeCategoryRank: "Ranking chart",
      hiddenWidgetTypeKpi: "KPI card",
      hiddenWidgetTypeThemeList: "Theme list",
      hiddenWidgetTypeSummary: "Narrative summary",
      hiddenWidgetSectionHorizontalBarTitle: "Distribution charts",
      hiddenWidgetSectionHorizontalBarDescription:
        "Comparisons across categories that are easier to scan as horizontal bars.",
      hiddenWidgetSectionLineSeriesTitle: "Timeline charts",
      hiddenWidgetSectionLineSeriesDescription:
        "Changes over time, milestones, and other time-based patterns.",
      hiddenWidgetSectionCategoryRankTitle: "Ranking charts",
      hiddenWidgetSectionCategoryRankDescription:
        "Top segments, strongest categories, and sorted comparisons.",
      hiddenWidgetSectionKpiTitle: "KPI cards",
      hiddenWidgetSectionKpiDescription:
        "Single headline values for fast reference and reporting.",
      hiddenWidgetSectionThemeListTitle: "Theme lists",
      hiddenWidgetSectionThemeListDescription:
        "Repeated qualitative patterns and supporting evidence themes.",
      hiddenWidgetSectionSummaryTitle: "Narrative summaries",
      hiddenWidgetSectionSummaryDescription:
        "Plain-language interpretations generated for this dashboard.",
      summaryEyebrow: "Plain-language view",
      comparisonTitle: "Comparable metrics",
      timelineTitle: "Timeline",
      rankTitle: "Strongest segments",
      themesTitle: "Qualitative signals",
      goalLinked: "Goal-linked: {{value}}",
      usageTitle: "Dashboard usage",
      usageDescription:
        "Internal telemetry from this dashboard view, based on persisted widget interactions.",
      usageViews: "Views",
      usageHidden: "Hidden",
      usageShown: "Shown",
      usageReordered: "Reordered",
      usageRestored: "Restored",
      usageLastViewed: "Last viewed: {{value}}",
      usageLastUpdated: "Last interaction: {{value}}",
      usageNoDate: "No data yet",
      usageEmpty: "No dashboard interactions have been recorded yet.",
    },
  },
  projectAnalytics: {
    loading: "Loading analytics…",
    loadFailed: "Analytics could not be loaded.",
    eyebrow: "Programme Analytics",
    title: "Analytics",
    subtitle:
      "Analytics are based exclusively on privacy-safe, structured evidence.",
    noVerifiedEvidenceTitle: "No suitable evidence yet",
    noVerifiedEvidenceDescription:
      "This project does not yet have structured evidence that is ready for analytics generation.",
    awaitingPreparationTitle: "Resolve interpretation questions first",
    awaitingPreparationDescription:
      "{{count}} dataset is still blocked on preparation questions. Answer the remaining questions on the interpretation page before generating the dashboard.",
    awaitingPreparationDescription_other:
      "{{count}} datasets are still blocked on preparation questions. Answer the remaining questions on the interpretation page before generating the dashboard.",
    awaitingAnalysisTitle: "Deterministic analysis is still in progress",
    awaitingAnalysisDescription:
      "{{count}} prepared dataset still needs deterministic analysis before the dashboard can be assembled.",
    awaitingAnalysisDescription_other:
      "{{count}} prepared datasets still need deterministic analysis before the dashboard can be assembled.",
    readyToGenerateTitle: "Dashboard is ready to generate",
    readyToGenerateDescription:
      "Preparation and deterministic analysis are in place. Generate analytics to assemble the dashboard view.",
    noVerifiedEvidenceCta: "Go to Interpretation",
    dashboard: {
      summaryEyebrow: "Plain-language view",
      summaryTitle: "What stands out in this project",
      comparisonTitle: "Comparable metrics",
      comparisonDescription:
        "A fixed comparison of deterministic metrics that share the same unit.",
      timelineTitle: "Timeline",
      rankTitle: "Strongest segments",
      themesTitle: "Qualitative signals",
      themesDescription:
        "The most repeated themes carried into the project knowledge model.",
      latestValue: "Latest value: {{value}}",
    },
  },
  activityTabs: {
    brief: "Overview",
    schema: "Data Review",
    analytics: "Analysis",
    insights: "AI knowledge",
    settings: "Settings",
  },
  activityBrief: {
    loading: "Loading activity…",
    loadFailed: "Activity could not be loaded.",
    redirectingToOverview: "Redirecting…",
    crumb: "Overview",
    eyebrow: "Activity",
    noDescription: "No activity description has been added yet.",
    hero: {
      badges: {
        empty: "Evidence setup",
        uploading: "Uploading",
        processing: "AI in progress",
        ready: "Ready for review",
        attention: "Needs attention",
      },
      titles: {
        empty: "Upload your first dataset",
        uploading: "Uploading your dataset",
        processing: "Impact Atlas is preparing your evidence",
        ready: "Your evidence is ready for the next step",
        attention: "This dataset needs another look",
      },
      descriptions: {
        empty: "Upload CSV or Excel monitoring data to start AI analysis.",
        uploading: "Your file is on its way into the evidence workflow now.",
        processing:
          "The latest dataset is being checked for structure, privacy risks, and analysis readiness.",
        ready:
          "{{fileName}} has been understood by AI. {{count}} review item is still visible before analysis continues.",
        attention:
          "The latest evidence run did not finish cleanly. Upload the file again to continue the workflow.",
      },
      supporting:
        "Supported formats: CSV, XLSX, drag and drop, or browse files.",
      processingMeta: "Current pipeline state: {{status}}",
      reviewData: "Review Data",
      continueToAnalysis: "Continue to Analysis",
      uploadAnother: "Upload another dataset",
      uploadFirstDataset: "Upload dataset",
    },
    uploading: {
      title: "Uploading dataset…",
      inProgress: "In progress",
      description:
        "Stay on this page. The activity overview will guide you to the next step automatically.",
    },
    metrics: {
      activityStatus: "Activity status",
      project: "Project",
      lastUpload: "Last upload",
      aiStatus: "AI status",
      noUpload: "None yet",
      noUploadDescription: "Upload evidence to begin the workflow",
      stateDescriptions: {
        empty: "No evidence has been uploaded yet",
        uploading: "A dataset is being uploaded now",
        processing: "AI is checking the uploaded evidence",
        ready: "Evidence is ready for review or analysis",
        attention: "A dataset needs another upload or check",
      },
      aiStatusValues: {
        empty: "Waiting for data",
        uploading: "Uploading",
        processing: "Understanding data",
        ready: "Ready for review",
        attention: "Issue detected",
      },
      aiStatusDescription:
        "{{reviewCount}} review item visible · {{insights}} AI knowledge items currently available",
    },
    uploader: {
      eyebrow: "Add evidence",
      title: "Bring monitoring data into this activity",
      description:
        "Upload one CSV, Excel, PDF, or DOCX file and Impact Atlas will guide you through review, analysis, and AI knowledge from here.",
      cta: "Upload evidence",
      remove: "Remove",
    },
    detail: {
      projectGoal: "Project context",
      noProjectGoal: "No project impact or outcomes have been recorded yet.",
    },
    pipeline: {
      title: "AI evidence workflow",
      description:
        "You do not need to switch tabs while AI prepares the data. We will guide you to review when it is ready.",
      stages: [
        "Upload received",
        "Validating data",
        "Understanding columns",
        "Detecting privacy risks",
        "Preparing analysis",
      ],
    },
    nextStep: {
      title: "What do I do next?",
      reviewData: "Review Data",
      continueToAnalysis: "Continue to Analysis",
      addAnotherDataset: "Upload another dataset",
      descriptions: {
        empty:
          "Start by uploading one dataset for this activity. Once it arrives, AI will inspect it automatically.",
        uploading:
          "The upload is underway. Once the file lands, this page will move straight into AI processing.",
        processing:
          "Wait for AI to finish understanding the file. You will then be guided to data review or analysis.",
        ready:
          "The evidence is ready. Review the data understanding first if needed, then continue to analysis.",
        attention:
          "The current evidence run needs attention. Upload a fresh file to continue the workflow.",
      },
      items: {
        empty: [
          "Upload a CSV, Excel, PDF, or DOCX file from your monitoring process.",
          "Keep one clear evidence file per activity for the cleanest review flow.",
        ],
        uploading: [
          "Keep this page open while the upload completes.",
          "You will be guided automatically once AI begins reading the file.",
        ],
        processing: [
          "AI is validating structure, privacy, and analysis readiness.",
          "You do not need to manually open another technical step.",
        ],
        ready: [
          "Check whether AI understood the most important columns correctly.",
          "Move on to analysis once unresolved review items are cleared.",
        ],
        attention: [
          "Re-upload the dataset if the last run stalled or failed.",
          "Use Data Review to inspect what AI understood before trying again.",
        ],
      },
    },
    evidence: {
      title: "Evidence status",
      datasets: "Datasets",
      dataReview: "Data Review",
      analysis: "Analysis",
      insights: "AI knowledge",
      qualityIssues: "Data quality",
      latestFile: "Latest file",
      noFile: "No file uploaded yet",
      reviewValue: "{{count}} item needs review",
      analysisValue: "{{status}}",
      insightsValue: "{{count}} AI knowledge items available",
      notYetAvailable: "Not yet available",
    },
  },
  upload: {
    loading: "Loading upload screen…",
    loadFailed: "Upload screen could not be loaded.",
    crumb: "Upload",
    eyebrow: "Upload Evidence",
    title: "Upload evidence for {{name}}",
    description:
      "Drop your CSV, Excel, PDF, or DOCX file to attach evidence to this activity.",
    dropzoneTitle: "Drag & drop your evidence file",
    dropzoneBrowsePrefix: "or",
    dropzoneBrowseAction: "browse from your computer",
    accepts: "Accepts .csv, .xlsx, .xls, .pdf, .docx",
    storageNote:
      "Uploaded evidence stays connected to this activity and can be analysed in a later step.",
    existingCounts: "Existing files: {{uploads}} · jobs: {{jobs}}",
    readyToUpload: "Ready to upload",
    ready: "Ready",
    removeFileAria: "Remove file",
    uploading: "Uploading…",
    createProcessingJob: "Analyse evidence",
    successToast: "Evidence uploaded.",
    failedToast: "Upload failed.",
    unsupportedFileTypeToast:
      "Unsupported file type. Please upload a CSV, Excel (.xlsx/.xls), PDF, or Word (.docx) file.",
  },
  processing: {
    loading: "Loading job status…",
    loadFailed: "Job status could not be loaded.",
    crumb: "Interpret",
    title: "Interpretation status: {{status}}",
    description:
      "AI is reading the uploaded file, mapping its structure, and preparing an interpretation layer you can review before deeper analysis.",
    pipeline: "Interpretation progress",
    stages: [
      "Uploading dataset",
      "Recording upload metadata",
      "Creating interpretation job",
      "Queueing AI processing",
      "Reading file structure",
      "Preparing review state",
    ],
    backToUpload: "Back to upload",
    continueToReview: "Continue to review",
  },
  schemaReview: {
    loading: "Loading schema review…",
    loadFailed: "Schema review could not be loaded.",
    crumb: "Dataset Review",
    eyebrow: "AI Dataset Review",
    title: "Did the AI understand your dataset correctly?",
    description:
      "Impact Atlas maps each uploaded column, flags personal data, and recommends safe transformations before interpretation continues.",
    cta: {
      uploadDataset: "Upload dataset",
      reviewRequired: "Review required ({{count}})",
      continueToAnalysis: "Continue to Analysis",
      awaitingInterpretation: "Awaiting interpretation",
      reviewComplete: "Review complete",
    },
    empty: {
      eyebrow: "AI Data Interpretation",
      title: "We haven't analysed a dataset yet.",
      description:
        "Once you upload a CSV or Excel file, Impact Atlas will read the structure, understand each field, identify personal data, and prepare it for interpretation.",
      benefits: [
        "Detect every column automatically",
        "Understand what each field most likely means",
        "Flag personal or sensitive information",
        "Recommend anonymisation before analysis",
        "Prepare the dataset for AI interpretation",
      ],
      cta: "Upload dataset",
    },
    notReady: {
      title: "Dataset review is not available yet",
      description:
        "Automated column-by-column dataset review is still being built. Check back in a future update.",
      cta: "Back to Overview",
    },
    datasetStatus: {
      readyTitle: "Dataset successfully interpreted",
      readyDescription:
        "AI identified {{count}} fields and prepared them for the next interpretation step.",
      reviewTitle: "AI needs your review before continuing",
      reviewDescription:
        "Most fields were classified automatically, but {{count}} field still needs confirmation.",
      lastUpload: "Last upload: {{date}}",
    },
    workflow: {
      upload: "Upload",
      understanding: "AI understanding",
      review: "Review",
      analysis: "Analysis",
    },
    summary: {
      columnsDetected: "Columns detected",
      autoClassified: "Automatically classified",
      reviewedByYou: "Reviewed by you",
      needsReview: "Need review",
      overallConfidence: "Overall confidence",
    },
    mapping: {
      title: "Column mapping",
      description:
        "{{count}} columns in view. Select one to inspect how AI read it.",
    },
    quality: {
      title: "Data quality issues",
      missingValues: "Missing values",
      duplicateRows: "Duplicate rows",
      sensitiveText: "Sensitive text",
      sensitiveTextValue: "Removed before analysis",
    },
    searchPlaceholder: "Search columns…",
    headers: {
      originalName: "Original Name",
      semanticMeaning: "AI Interpretation",
      privacyCategory: "Privacy",
      transformation: "Transformation",
      confidence: "Status",
    },
    statusLabels: {
      confirmed: "Confirmed",
      high: "High confidence",
      review: "Needs review",
      unsure: "AI unsure",
    },
    privacyLabels: {
      directIdentifier: "Personal information",
      quasiIdentifier: "Contextual data",
      highRisk: "Sensitive notes",
      operational: "Programme data",
      outcome: "Outcome data",
    },
    transformationLabels: {
      hashed: "Tokenize",
      removed: "Remove",
      generalised: "Generalise",
      kept: "Keep",
    },
    reviewCard: {
      badge: "AI needs your help",
      possibleMeanings: "Possible meanings",
      confirm: "Confirm meaning",
      confirmed: "Confirmed",
      confirmedSelection: "Confirmed as: {{value}}",
      remainingQuestions: "{{count}} review question left",
      selectionSaved: "Selected: {{value}}",
    },
    row: {
      confirmedAs: "Confirmed as {{value}}",
    },
    detail: {
      eyebrow: "AI reasoning",
      originalColumn: "Original column: {{column}}",
      confidenceScore: "{{value}}% confidence",
      privacy: "Privacy classification",
      transformation: "Recommended transformation",
      sampleValues: "Example values",
      reasoningTitle: "Why AI interpreted it this way",
      noReviewNeededTitle: "No review needed",
      noReviewNeededDescription:
        "AI found a strong pattern for this field, so no manual confirmation is required right now.",
      defaultReasoning: {
        pattern:
          "The values follow a consistent pattern that matches common monitoring datasets.",
        privacy:
          "The field was treated as {{privacy}} based on the kind of information it appears to contain.",
        transformation:
          "The recommended next step is to {{transformation}} this field before deeper interpretation.",
      },
    },
    schema: {
      participant_name: {
        semantic: "Participant Identifier",
        reasoning: [
          "Values look like full personal names rather than programme codes.",
          "Most entries are unique, which suggests direct identification.",
          "The field appears next to email, which reinforces that it refers to people.",
        ],
        sampleValues: ["A. Okafor", "J. Martin", "S. Singh"],
      },
      email: {
        semantic: "Email Address",
        reasoning: [
          "Nearly every value follows a standard email pattern with @ and domain endings.",
          "Each value identifies a single person directly.",
          "Hashing preserves linking while reducing exposure during interpretation.",
        ],
        sampleValues: [
          "mentor@ngo.org",
          "participant@gmail.com",
          "team@programme.net",
        ],
      },
      age_group: {
        semantic: "Age Band",
      },
      district: {
        semantic: "Geographic Area",
        reasoning: [
          "Values look like place labels rather than individual identifiers.",
          "Location can still narrow identity when combined with other fields.",
          "Keeping this field supports comparison across programme areas.",
        ],
        sampleValues: ["North District", "Central", "East Hub"],
      },
      sessions_attended: {
        semantic: "Attendance Metric",
      },
      total_sessions: {
        semantic: "Programme Length",
      },
      completed_program: {
        semantic: "Completion Metric",
      },
      pre_confidence_score: {
        semantic: "Outcome Metric (Baseline)",
      },
      post_confidence_score: {
        semantic: "Outcome Metric (Endline)",
      },
      mentor_match_status: {
        semantic: "Mentor Matching Status",
        clarifyingQuestion:
          'What does "mentor_match_status" describe in this dataset?',
        options: ["Matching result", "Mentor assigned", "Programme status"],
        reasoning: [
          "The values look categorical rather than numeric.",
          "The column appears beside attendance and outcome fields, so the intent is not fully clear.",
        ],
        sampleValues: ["M", "P", "X"],
      },
      case_notes: {
        semantic: "Sensitive Free Text",
        reasoning: [
          "This field appears to contain unstructured narrative text.",
          "Free text often includes names, incidents, or contextual detail that should not pass into analysis.",
          "Removing it reduces privacy risk without blocking structured interpretation.",
        ],
        sampleValues: [
          "Participant disclosed family conflict",
          "Mentor noted transport issue",
        ],
      },
    },
  },
  activityAnalytics: {
    loading: "Loading activity analytics…",
    loadFailed: "Activity analytics could not be loaded.",
    crumb: "Analysis",
    eyebrow: "Evidence Analysis",
    title: "Analysis",
    noVerifiedEvidenceTitle: "No suitable evidence yet",
    noVerifiedEvidenceDescription:
      "Analytics are not available yet because this activity has no structured evidence ready for analytics generation.",
    awaitingPreparationTitle: "Resolve interpretation questions first",
    awaitingPreparationDescription:
      "{{count}} dataset is still blocked on preparation questions for this activity. Answer the remaining questions on the interpretation page.",
    awaitingPreparationDescription_other:
      "{{count}} datasets are still blocked on preparation questions for this activity. Answer the remaining questions on the interpretation page.",
    awaitingAnalysisTitle: "Deterministic analysis is still in progress",
    awaitingAnalysisDescription:
      "{{count}} prepared dataset still needs deterministic analysis before this dashboard can be assembled.",
    awaitingAnalysisDescription_other:
      "{{count}} prepared datasets still need deterministic analysis before this dashboard can be assembled.",
    readyToGenerateTitle: "Dashboard is ready to generate",
    readyToGenerateDescription:
      "Preparation and deterministic analysis are in place. Generate analytics to assemble this activity dashboard.",
    noVerifiedEvidenceCta: "Go to Overview",
  },
  activityInsights: {
    loading: "Loading AI knowledge…",
    loadFailed: "AI knowledge could not be loaded.",
    crumb: "AI knowledge",
    eyebrow: "Activity AI knowledge",
    title: "Read the activity as one knowledge view",
    description:
      "Impact Atlas combines the interpreted evidence of this activity into one narrative AI knowledge view.",
    notReadyTitle: "AI knowledge is not ready yet",
    notReadyDescription:
      "Return to the interpretation page to finish privacy review, answer clarification questions, or run AI analysis for this activity.",
    notReadyCta: "Go to Interpretation",
  },
  activitySettings: {
    loading: "Loading activity settings…",
    loadFailed: "Activity settings could not be loaded.",
    crumb: "Settings",
    eyebrow: "Activity Settings",
    title: "Keep this activity aligned",
    description:
      "Review the core details that guide evidence collection, analysis, and reporting for this activity.",
    activityDetailsTitle: "Activity details",
    workflowGuardrailsTitle: "Workflow guardrails",
    workflowGuardrails: [
      "Use one clear dataset per activity when possible.",
      "Keep activity names and descriptions specific so AI context stays reliable.",
      "Update ownership and status when delivery changes.",
    ],
    contextTitle: "Why this context matters",
    supportTitle: "Support for future iterations",
    supportDescription:
      "This page will grow into the place for activity metadata, evidence rules, and future workflow preferences.",
    noOwner: "No owner has been assigned yet.",
    noDescription: "No activity description has been added yet.",
    noProjectGoal: "No project impact or outcomes have been recorded yet.",
    fields: {
      name: "Name",
      status: "Status",
      project: "Project",
      owner: "Owner",
      created: "Created",
      updated: "Updated",
      description: "Description",
    },
  },
  enums: {
    roles: {
      ORGANIZATION_ADMIN: "Organization Admin",
      PROJECT_MANAGER: "Project Manager",
    },
    status: {
      planning: "Planning",
      draft: "Draft",
      active: "Active",
      archived: "Archived",
      queued: "Queued",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      pending: "Pending",
      uploaded: "Uploaded",
      available: "Available",
    },
    privacyCategory: {
      directIdentifier: "Direct Identifier",
      quasiIdentifier: "Quasi Identifier",
      highRisk: "High Risk",
      operational: "Operational",
      outcome: "Outcome",
    },
    transformation: {
      hashed: "Tokenized",
      removed: "Removed",
      generalised: "Generalised",
      kept: "Kept",
    },
  },
  sidebar: {
    workspace: "Workspace",
    projects: "Projects",
    members: "Members",
    billing: "Billing",
    sectionTitle: "Projects",
    myProjectsSection: "My Projects",
    allProjectsSection: "All Projects",
    projectSingular: "Project",
    projectPlural: "Projects",
    addProject: "Add project",
    activities: "Activities",
    addActivity: "Add activity",
    noProjects: "No projects yet",
    createFirstProject: "Open the projects page to create your first project.",
    mobileNavigationTitle: "Workspace navigation",
    mobileNavigationDescription:
      "Navigate between workspace areas and projects.",
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
    noMission: "Add a mission in organization settings.",
    members: "Members",
    projects: "Projects",
    role: "Role",
    workspace: "Workspace",
    workspaceReady: "Ready",
    readOnly: "Read-only",
  },
  organizationPage: {
    eyebrow: "Organization Workspace",
    adminTitle: "Organization workspace",
    managerTitle: "My workspace",
    adminDescription:
      "Open recently updated projects, review current activity, and see where evidence is still missing across the workspace.",
    managerDescription:
      "Continue work in your projects, review recent changes, and catch missing evidence early.",
    primaryAction: "Create project",
    emptyTitle: "No projects yet",
    emptyDescription:
      "Projects are created from the projects page. That page holds the full project list for this workspace.",
    emptyManagerTitle: "Welcome to {{organization}}",
    emptyManagerDescription:
      "Start by creating your first project. Projects help you organize evidence across activities, uploads, analytics, and AI knowledge.",
    emptyAction: "Create your first project",
    myProjects: "My projects",
    continueWorking: "Continue working",
    continueWorkingDescription:
      "Pick up where evidence, activities, or reporting work last moved forward.",
    viewAllProjects: "View all projects",
    recentActivity: "Recent activity",
    recentActivityDescription:
      "These activities were updated most recently across the workspace.",
    noRecentActivity: "No activity yet in this workspace.",
    recentActivityUploads: "{{count}} uploads",
    projectsNeedingAttention: "Projects needing attention",
    projectsNeedingAttentionDescription:
      "These projects are still missing activities or evidence.",
    allProjectsOnTrack:
      "No project currently needs immediate attention in this workspace.",
    openProjectsPage: "Open projects page",
    nextActionTitle: "Next step",
    nextActionLabels: {
      openProject: "Open project",
      uploadEvidence: "Upload evidence",
    },
    nextActionStates: {
      createActivity:
        "This project still needs its first activity. Define the intervention first before evidence can be uploaded.",
      uploadEvidence:
        "{{count}} activity is still missing evidence. Upload files so privacy review and interpretation can begin.",
      uploadEvidence_other:
        "{{count}} activities are still missing evidence. Upload files so privacy review and interpretation can begin.",
      continueProject:
        "Every project already has activities and initial evidence. Open the most recently updated project to continue the next work phase.",
    },
    attentionReasons: {
      noActivities: "This project still needs its first activity.",
      noEvidence:
        "No evidence has been uploaded yet for the activities in this project.",
      partialEvidence:
        "{{missing}} of {{total}} activities are still missing evidence.",
    },
    activitiesLabel: "activities",
    noProjectDescription: "No project profile captured yet.",
  },
  organizationSettings: {
    eyebrow: "Workspace Settings",
    title: "Organization Settings",
    description:
      "Maintain your organization metadata here. Project data stays separate, but these details update across the workspace immediately.",
    readOnlyNotice:
      "You can view this information, but only organization admins can edit it.",
    generalSection: "General Information",
    generalDescription:
      "Manage your organization's core information. This information will be used for projects, analytics, and future funding reports.",
    organizationNameLabel: "Organization name",
    organizationNamePlaceholder: "PHINEO",
    legalFormLabel: "Legal form",
    legalFormPlaceholder: "Public-benefit foundation",
    foundingYearLabel: "Founding year",
    foundingYearPlaceholder: "2010",
    countryLabel: "Country",
    countryPlaceholder: "Germany",
    employeeCountLabel: "Employee count",
    employeeCountPlaceholder: "25",
    missionSection: "Mission & Areas of Work",
    missionDescription:
      "Describe what your organization stands for, which fields it works in, and who it serves.",
    missionLabel: "Mission",
    missionPlaceholder:
      "Briefly explain what your organization does and how your team uses evidence.",
    activityAreasLabel: "Areas of work",
    activityAreasPlaceholder: "Education\nDemocracy",
    targetGroupsLabel: "Target groups",
    targetGroupsPlaceholder: "Young people\nFamilies",
    operatingRegionsLabel: "Operating regions",
    operatingRegionsPlaceholder: "Berlin\nBrandenburg",
    listFieldHint:
      "Enter multiple values on separate lines or separated by commas.",
    nonProfitSection: "Non-profit Status",
    nonProfitDescription:
      "Record the current non-profit recognition status of your organization.",
    isRecognizedNonProfitLabel: "Recognized as non-profit?",
    nonProfitYes: "Yes",
    nonProfitNo: "No",
    nonProfitUnknown: "Not set",
    taxExemptionValidFromLabel: "Tax exemption valid from",
    logoLabel: "Organization logo",
    logoDescription:
      "PNG, JPG, JPEG, or WebP. Drag a file here or choose one from your computer.",
    replaceLogo: "Replace logo",
    selectedLogo: "Selected logo",
    summaryMissionLabel: "Mission",
    summaryActivityAreasLabel: "Areas of work",
    summaryNonProfitLabel: "Non-profit status",
    summaryNonProfitYes: "Recognized as non-profit",
    summaryNonProfitNo: "Not a non-profit",
    summaryNotProvided: "Not provided yet",
    optionalLabel: "optional",
    save: "Save changes",
    saving: "Saving…",
    success: "Organization updated.",
    failure: "Organization update failed.",
    invalidFile: "Please upload a PNG, JPG, JPEG, or WebP image.",
    dropzoneTitle: "Drop your logo here",
    dropzoneAction: "Choose a file from your computer",
    validationOrganizationName: "Please enter an organization name.",
    validationFoundingYear: "Please enter a four-digit founding year.",
    validationEmployeeCount: "Please enter a valid employee count.",
    validationTaxExemptionValidFrom: "Please use a valid date.",
  },
  organizationProjects: {
    eyebrow: "Projects",
    title: "Projects in this workspace",
    description:
      "Open an existing project or create the next one you want to manage.",
    primaryAction: "Create project",
    emptyTitle: "No projects in this workspace yet",
    emptyDescription:
      "Once projects are created, this page becomes the main place to open them and move into activities, uploads, analytics, and AI knowledge.",
    noDescription: "No project goal captured yet.",
    activities: "activities",
  },
  projectCard: {
    activities: "activities",
    updated: "Updated",
  },
  organizationActivities: {
    eyebrow: "Activities",
    title: "Activities across my projects",
    description:
      "Open any activity you own to continue uploading evidence or reviewing AI knowledge.",
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
    copyInviteLink: "Copy invitation link",
    copyInviteLinkSuccess: "Invitation link copied.",
    copyInviteLinkFailure: "Invitation link could not be copied.",
    resendInvitation: "Resend",
    resendInvitationSuccess: "Invitation resent.",
    resendInvitationFailure: "Invitation could not be resent.",
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
    viewInsights: "Open AI knowledge",
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
    readOnlyNotice:
      "You can review these values, but only the responsible project lead can edit them.",
    editAction: "Edit",
    cancelEditAction: "Cancel editing",
    saveAction: "Save changes",
    savingAction: "Saving…",
    success: "Project updated.",
    failure: "Project update failed.",
    optionalLabel: "optional",
    requiredField: "Please complete this required field.",
    requiredMonth: "Please select a month.",
    dangerTitle: "Delete project",
    dangerDescription:
      "Deleting a project permanently removes all activities, uploads, jobs, review outputs, analyses, and AI knowledge linked to it.",
    deleteAction: "Delete project",
    notSet: "Not set",
    noProjectDescription: "No project profile captured yet.",
    sections: {
      description: "Description",
      fundingContext: "Funding context",
      projectContext: "Project context",
    },
    fields: {
      timeline: "Timeline",
      fundingProgram: "Funding programme",
      fundingOrganization: "Funding organization",
      targetGroups: "Target groups",
      areaOfOperation: "Area of operation",
      partnerships: "Partnerships",
      sdgs: "SDGs",
      successIndicators: "Success indicators",
      inputs: "Inputs",
      activities: "Activities",
      outputs: "Outputs",
      impact: "Impact",
      outcomes: "Outcomes",
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
      insights: "all AI knowledge",
    },
  },
  dialogs: {
    cancel: "Cancel",
    create: "Create",
    createProjectTitle: "Create project",
    createProjectDescription:
      "Capture the project profile, target groups, and logic model for this project.",
    createActivityTitle: "Add activity",
    createActivityDescription:
      "Capture the delivery details for a project activity.",
    editActivityTitle: "Edit activity",
    editActivityDescription:
      "Update the delivery details for this project activity.",
    project: {
      submit: "Create project",
      creating: "Creating project…",
      success: "Project created.",
      failure: "Project creation failed.",
      projectProfile: "Project profile",
      name: "Project name",
      namePlaceholder: "Mentoring Programme 2026",
      startMonth: "Start month / year",
      endMonth: "End month / year",
      fundingProgram: "Funding programme",
      fundingProgramPlaceholder: "Erasmus+",
      fundingOrganization: "Funding organization",
      fundingOrganizationPlaceholder: "European Commission",
      sdgs: "SDGs",
      sdgsPlaceholder: "SDG 4, SDG 10",
      sdgsHint: "Optional. Separate multiple entries with commas or new lines.",
      targetGroups: "Target groups",
      targetGroupsPlaceholder: "Select one or more target groups",
      targetGroupsValidation: "Please select at least one target group.",
      customTargetGroupValidation:
        "Please add a custom target group for Other.",
      targetGroupsSelectedSingle: "1 target group selected",
      targetGroupsSelectedMultiple: "{{count}} target groups selected",
      customTargetGroupPlaceholder: "Add a custom target group",
      areaOfOperation: "Area of operation",
      areaOfOperationPlaceholder: "Where is the project being delivered?",
      partnerships: "Cooperations / Partnerships",
      partnershipsPlaceholder:
        "Optional. Add important cooperation partners or delivery partnerships.",
      impactModel: "Impact model (I-O-O-I model)",
      impactModelDescription:
        "Capture the core building blocks of your project logic.",
      impactModelTooltipLabel: "Explain logic model fields",
      impactModelTooltip: {
        inputs: "Inputs: Which resources do you use for the project?",
        activities: "Activities: Which measures do you carry out?",
        outputs: "Outputs: Which direct results are created?",
        impact:
          "Impact: Which longer-term or higher-level change should the project contribute to?",
        outcomes:
          "Outcomes: Which changes do you want to achieve for your target group?",
      },
      inputs: "Inputs",
      inputsPlaceholder:
        "Which resources, staff, budget, or infrastructure do you use?",
      activities: "Activities",
      activitiesPlaceholder:
        "Which concrete measures, formats, or interventions will you run?",
      outputs: "Outputs",
      outputsPlaceholder:
        "Which direct and countable results will the project produce?",
      impact: "Impact",
      impactPlaceholder:
        "Which broader or longer-term impact should the project support?",
      outcomes: "Outcomes",
      outcomesPlaceholder:
        "Which changes should happen for the target groups through the project?",
      successIndicatorsSection: "Success indicators",
      successIndicators: "Success indicators",
      successIndicatorsPlaceholder:
        "How will you know that the project was successful?",
    },
    activity: {
      submit: "Create activity",
      updateSubmit: "Save changes",
      creating: "Creating activity…",
      updating: "Saving activity…",
      success: "Activity created.",
      failure: "Activity creation failed.",
      updateSuccess: "Activity updated.",
      updateFailure: "Activity update failed.",
      sectionTitle: "Activities",
      name: "Activity name",
      namePlaceholder: "Senior Mentor Training",
      description: "Description",
      descriptionPlaceholder: "Two-day training for volunteer mentors.",
      activityType: "Activity type",
      activityTypeCustomPlaceholder: "Describe the activity type",
      owner: "Owner",
      ownerPlaceholder: "Programme Manager",
      startDate: "Start date",
      endDate: "End date",
      objectives: "Objectives",
      objectivesTooltipLabel: "Guidance on writing objectives",
      objectivesTooltip:
        "Describe the objective from the target group's perspective in the present tense, as if it has already been achieved. Phrase the desired state or intended change concretely, positively, and with a clear outcome focus.",
      objectivesPlaceholder:
        "Seniors are actively engaged as mentors and experience greater social participation through regular contact with young people.",
      successIndicators: "Outcome indicator(s)",
      successIndicatorsTooltipLabel: "Guidance on outcome indicators",
      successIndicatorsTooltip:
        "How you will know that the change has occurred.",
      successIndicatorsPlaceholder:
        "Outcome indicator for objective + target group 1:\n85% of participating seniors report feeling less lonely as a result of the mentoring.",
      targetAudience: "Target group",
      targetAudiencePlaceholder: "Returning volunteer mentors",
      status: "Status",
    },
    options: {
      targetGroups: [
        "Children",
        "Youth",
        "Adults",
        "Seniors",
        "Families",
        "People with disabilities",
        "Refugees",
        "Migrants",
        "Unemployed people",
        "Volunteers",
        "Companies",
        "Political actors",
        "Other",
      ],
      customTargetGroupOption: "Other",
      activityTypes: [
        "Workshop",
        "Information session",
        "Consultation",
        "Mentoring",
        "Training",
        "Event",
        "Networking meeting",
        "Campaign",
      ],
      customActivityTypeOption: "Other",
    },
  },
  errorPage: {
    title: `This page didn't load`,
    description:
      "Something went wrong on our end. You can try refreshing or head back home.",
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

export type TranslationDictionary = DeepStringShape<typeof en>;

export default en;
