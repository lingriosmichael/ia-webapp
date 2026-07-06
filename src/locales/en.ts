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
    back: "Back",
    continue: "Continue",
    notFoundTitle: "Page not found",
    notFoundDescription:
      "The requested page does not exist or is no longer available.",
    backToHome: "Back to home",
  },
  landing: {
    badge: "AI-supported impact analysis",
    title: "Organizations, projects, and activities before AI processing.",
    description:
      "Start with the workflow your team will actually use: onboard an organization, create projects, track activities, upload evidence, and store job metadata on a real backend. Impact Atlas automatically interprets your project data and turns evidence into meaningful analyses, visualizations, and reports for sound decisions, effective communication, and reliable funder reporting.",
    createWorkspace: "Create workspace",
    useExistingAccount: "Use existing account",
    features: {
      organizations: {
        title: "Organizations",
        description:
          "Each account starts inside an organization workspace with scoped access and ownership. The AI identifies content and connections across your project data.",
      },
      projects: {
        title: "Projects",
        description:
          "Projects become the funding or programme containers where evidence work is organized. Automatically calculated metrics and clear visualizations show actual project progress.",
      },
      activities: {
        title: "Activities",
        description:
          "Activities sit under projects and become the target for uploads, jobs, and result history. Prepare impact evidence and reports efficiently for funders, partners, and public communications.",
      },
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
    sidebarInsights: "Insights",
    sidebarActivities: "Activities",
    sidebarBrief: "Activity Brief",
    sidebarUpload: "Upload",
    viewInsights: "View insights",
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
      insightsGenerated: "AI insights generated",
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
        strong: "Evidence is uploaded, and insights are already available.",
        progress:
          "Evidence has started flowing and AI processing is still underway.",
        attention:
          "This project still needs evidence uploads or review before insights are ready.",
      },
      completenessValue: "{{withEvidence}}/{{total}} activities",
      completenessDelta: "{{percent}}% already have evidence",
      insightsDelta: "{{count}} pending",
      insightsReadyDelta: "Ready to review",
      noInsightsDelta: "No insights generated yet",
      noUploadValue: "None yet",
      noUploadDelta: "Upload evidence to start the pipeline",
      attentionItems: {
        noEvidence: "No evidence has been uploaded yet.",
        partialEvidence: "{{count}} activities still need evidence uploads.",
        pendingInsights: "{{count}} insight jobs are still running.",
        failedJobs: "{{count}} processing jobs need attention.",
        healthy:
          "Every activity has evidence, and no issues need review right now.",
      },
      recentActivityTypes: {
        activity_created: "Activity created",
        dataset_uploaded: "Dataset uploaded",
        job_completed: "Processing completed",
        job_failed: "Processing needs review",
        insight_generated: "AI insights generated",
      },
      recentActivityActivitySuffix: "for {{name}}",
    },
    emptyStateTitle: "No activities yet",
    emptyStateDescription:
      "Activities are workshops, trainings, mentoring sessions, or other interventions where you upload evidence.",
    emptyStateSupporting:
      "Create the first activity to keep uploads, analytics, and insights separate for each intervention.",
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
      insights: "Insights",
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
      analyzeDisabledHint: "Available in a later phase.",
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
      title: "Interpretation",
      description:
        "Review how Impact Atlas understands uploaded evidence, where confidence is strong, and where clarification is still needed.",
      metrics: {
        understanding: "Evidence understanding",
        uploads: "Uploads interpreted",
        indicators: "Indicators detected",
        questions: "Questions remaining",
      },
      progress: {
        title: "Progress",
        read: "Read files",
        detect: "Detect schema and entities",
        link: "Link activities and outputs",
        ready: "Ready for analytics",
      },
      datasetSummaryTitle: "Dataset summary",
      datasetSummaryFiles: "{{count}} files linked",
      datasetSummaryActivities: "{{count}} activities linked",
      ready: "Ready for analytics",
      notReady: "Still waiting for confirmation",
      understoodTitle: "Things Impact Atlas understands",
      empty: "No activities are available yet. Add an activity and upload evidence to begin interpretation.",
      questionsTitle: "Things Impact Atlas still needs help with",
      defaultQuestion:
        "This activity still has evidence that has not been fully interpreted. Review how the uploaded data should be classified.",
      noQuestions: "No open interpretation questions right now.",
      askPanelTitle: "Ask Impact Atlas",
      askPanelDescription:
        "Use this panel to challenge classifications, rename indicators, or request a different interpretation.",
      askPanelPlaceholder:
        "Why was this classified as attendance? Ignore this column. Treat this as a participant identifier.",
      askPanelNote:
        "This conversational layer is currently a lightweight placeholder for the future analyst workflow.",
      prompts: {
        attendance: "Why was this classified as attendance?",
        ignoreColumn: "Ignore this column.",
        renameIndicator: "Rename this indicator.",
        excludeCancelled: "Exclude cancelled sessions.",
      },
      cardMeaning: "Detected meaning",
      cardMeaningResolved: "Meaning resolved",
      cardMeaningPending: "Waiting for review",
      cardConfidence: "Confidence",
      cardReason: "Reason",
      cardReasonResolved: "Backed by interpreted evidence",
      cardReasonPending: "Needs confirmation before analytics",
      confidenceHigh: "High",
      confidenceMedium: "Medium",
      confidenceLow: "Low",
      noEvidenceYet: "No evidence uploaded yet.",
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
  projectAnalytics: {
    loading: "Loading analytics…",
    loadFailed: "Analytics could not be loaded.",
    crumbsProjects: "Projects",
    crumbsAnalytics: "Analytics",
    eyebrow: "Programme Analytics",
    title: "Placeholder analytics view",
    description:
      "This screen is still using representative charts because AI analytics are not implemented yet. Live project and activity metadata are already coming from the backend for {{count}} activities.",
    charts: {
      attendanceTrend: "Attendance Trend",
      confidenceImprovement: "Confidence Improvement",
      attendanceDistribution: "Attendance Distribution",
      completionByAgeGroup: "Completion by Age Group",
      mentorMatching: "Mentor Matching",
      backendStatus: "Backend status",
      mockDataset: "Mock dataset",
    },
    backendStatus: {
      projectLoaded: "Project loaded",
      activitiesLoaded: "Activities loaded",
      aiAnalytics: "AI analytics",
      notImplemented: "Not implemented yet",
      yes: "Yes",
    },
    metrics: {
      participants: { label: "Participants", delta: "+12 vs last cycle" },
      attendanceRate: { label: "Attendance Rate", delta: "+4 pts" },
      programmeCompletion: { label: "Programme Completion", delta: "+6 pts" },
      confidenceImprovement: {
        label: "Confidence Improvement",
        delta: "scale 1–10",
      },
      missingValues: { label: "Missing Values", delta: "1.1% of cells" },
      duplicateRows: { label: "Duplicate Rows", delta: "auto-flagged" },
    },
    mentorMatching: {
      matched: "Matched",
      pending: "Pending",
      unmatched: "Unmatched",
    },
    series: {
      attendance: "Attendance",
      preConfidence: "Baseline confidence",
      postConfidence: "Endline confidence",
      count: "Count",
      completed: "Completed",
      dropped: "Dropped",
      mentorMatches: "Mentor matches",
    },
  },
  projectInsights: {
    loading: "Loading insights…",
    loadFailed: "Insights could not be loaded.",
    crumbsProjects: "Projects",
    crumbsInsights: "Insights",
    eyebrow: "AI Insights",
    title: "Placeholder insights view",
    description:
      "The project and {{count}} activities are live from the backend. The narrative insights below remain mocked until the Python interpretation service is integrated.",
    executiveSummaryTitle: "Executive Summary",
    executiveSummary:
      "The Mentoring Programme Q3 2026 is performing on track. Attendance remains strong across all workshops, and confidence scores improved by an average of 2.3 points across the 12-week cycle. Mentor matching is highly successful, but long-term outcomes beyond programme close are not yet measured.",
    keyFindingsTitle: "Key Findings",
    interestingPatternsTitle: "Interesting Patterns",
    interestingPatternsDescription: "Signals worth a closer look",
    evidenceGapsTitle: "Evidence Gaps",
    evidenceGapsDescription: "What your current data cannot yet answer",
    recommendationsTitle: "Recommendations",
    privacyTitle: "Privacy Summary",
    privacyDescription:
      "How your evidence will be prepared before AI interpretation",
    keyFindings: [
      "Attendance remains strong across all workshops, averaging 82% over 12 weeks.",
      "Confidence improved significantly after programme completion (+2.3 points on a 10-point scale).",
      "Mentor matching is successful at 91%, with only 5 unmatched participants at week 12.",
      "Older participants (18+) complete the programme at a higher rate than the 14–15 group.",
    ],
    interestingPatterns: [
      "Attendance decreases after week four, suggesting an engagement dip mid-cycle.",
      "Districts with in-person mentor training show 8% higher completion than online-only districts.",
      "Confidence uplift accelerates between weeks 3 and 6, then plateaus.",
    ],
    evidenceGaps: [
      "Long-term outcomes (3, 6, 12 months post-programme) are not yet measured.",
      "Mentor-side feedback is not collected in the current dataset.",
      "Reasons for drop-off after week 4 are not captured.",
    ],
    recommendations: [
      "Introduce a lightweight mid-cycle check-in at week 4 to address the engagement dip.",
      "Add a 3-month post-programme follow-up survey to track sustained confidence.",
      "Collect mentor-side session logs to triangulate participant outcomes.",
    ],
    privacy: [
      "Personal identifiers (participant_name, email) were hashed before AI interpretation.",
      "Sensitive free-text (case_notes) was removed before analysis.",
      "Quasi identifiers (age_group, district) were generalised to reduce re-identification risk.",
    ],
  },
  activityTabs: {
    brief: "Overview",
    schema: "Data Review",
    analytics: "Analysis",
    insights: "Insights",
    settings: "Settings",
  },
  activityBrief: {
    loading: "Loading activity…",
    loadFailed: "Activity could not be loaded.",
    redirectingToOverview: "Returning to activity overview…",
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
        "{{reviewCount}} review item visible · {{insights}} insights currently available",
    },
    uploader: {
      eyebrow: "Add evidence",
      title: "Bring monitoring data into this activity",
      description:
        "Upload one CSV or Excel file and Impact Atlas will guide you through review, analysis, and insights from here.",
      cta: "Start AI review",
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
          "Upload a CSV or Excel file from your monitoring process.",
          "Keep one clean dataset per activity for the clearest AI review.",
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
      insights: "Insights",
      qualityIssues: "Data quality",
      latestFile: "Latest file",
      noFile: "No file uploaded yet",
      reviewValue: "{{count}} item needs review",
      analysisValue: "{{status}}",
      insightsValue: "{{count}} insights available",
      qualityIssuesValue:
        "{{missing}} missing values · {{duplicates}} duplicate rows",
    },
  },
  upload: {
    loading: "Loading upload screen…",
    loadFailed: "Upload screen could not be loaded.",
    crumb: "Upload",
    eyebrow: "Upload Evidence",
    title: "Upload evidence for {{name}}",
    description:
      "Drop your CSV or Excel file to start the activity evidence workflow.",
    dropzoneTitle: "Drag & drop your CSV or Excel file",
    dropzoneBrowsePrefix: "or",
    dropzoneBrowseAction: "browse from your computer",
    accepts: "Accepts .csv, .xlsx, .xls",
    storageNote:
      "Uploaded evidence is prepared for AI review and stays connected to this activity.",
    existingCounts: "Existing datasets: {{uploads}} · AI runs: {{jobs}}",
    readyToUpload: "Ready to upload",
    ready: "Ready",
    removeFileAria: "Remove file",
    uploading: "Uploading…",
    createProcessingJob: "Start AI review",
    successToast: "Dataset uploaded. AI review has started.",
    failedToast: "Upload failed.",
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
      hashed: "Hash",
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
    title: "Turn reviewed evidence into findings",
    description:
      "This page summarizes the dataset once AI has prepared it for analysis.",
    gates: {
      noDataset: {
        title: "Analysis starts after the first dataset arrives",
        description:
          "Upload monitoring data from the activity overview first. Once AI has read the evidence, this page will be ready.",
        cta: "Go to Overview",
      },
      processing: {
        title: "AI is still preparing this dataset",
        description:
          "Stay in the guided workflow until the evidence is ready. Analysis opens automatically once review is complete.",
        cta: "Back to Overview",
      },
    },
    summary: {
      rows: "Rows",
      columns: "Columns",
      review: "Data Review",
      reviewValue: "{{count}} item pending",
      insights: "Insights",
      insightsValue: "{{count}} available",
    },
    metricsTitle: "Current analysis view",
    storyTitle: "What this analysis is showing",
    storyPoints: [
      "The uploaded evidence can already be summarised into key monitoring metrics.",
      "This first pass highlights participation, completion, and data quality trends.",
      "Use the insights page for narrative interpretation and suggested actions.",
    ],
    nextActionTitle: "Next action",
    nextActionReady:
      "The dataset is analysis-ready. Move into insights when you want narrative interpretation and recommendations.",
    nextActionBlocked:
      "Clear the remaining review items before relying on downstream analysis or insights.",
    reviewDataCta: "Review Data",
    openInsightsCta: "Open Insights",
  },
  activityInsights: {
    loading: "Loading activity insights…",
    loadFailed: "Activity insights could not be loaded.",
    crumb: "Insights",
    eyebrow: "AI Insights",
    title: "Read the story inside the evidence",
    description:
      "Insights help NGO teams move from evidence to interpretation, recommendations, and next actions.",
    emptyTitle: "No insights available yet",
    emptyDescription:
      "Upload a dataset and complete data review to unlock AI-generated insights.",
    emptyCta: "Go to Overview",
    summary: {
      generated: "Generated insights",
      keyFindings: "Key findings",
      privacyChecks: "Privacy checks",
    },
    executiveSummaryTitle: "Executive summary",
    keyFindingsTitle: "Key findings",
    recommendationsTitle: "Recommendations",
    privacyBoundaryTitle: "Privacy boundary",
    privacyBoundaryDescription:
      "Personal identifiers are reduced before analysis so the insight layer focuses on programme evidence rather than exposed participant data.",
  },
  activitySettings: {
    loading: "Loading activity settings…",
    loadFailed: "Activity settings could not be loaded.",
    crumb: "Settings",
    eyebrow: "Activity Settings",
    title: "Keep this activity aligned",
    description:
      "Review the core details that guide evidence collection, AI review, and reporting for this activity.",
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
      hashed: "Hashed",
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
      "Start by creating your first project. Projects help you organize evidence across activities, uploads, analytics, and insights.",
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
      "Once projects are created, this page becomes the main place to open them and move into activities, uploads, analytics, and insights.",
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
      "Deleting a project permanently removes all activities, uploads, jobs, review outputs, analyses, and insights linked to it.",
    deleteAction: "Delete project",
    notSet: "Not set",
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
      insights: "all insights",
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
        "Mentoring Session",
        "Workshop",
        "Training",
        "Outreach",
        "Assessment",
        "Other",
      ],
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
