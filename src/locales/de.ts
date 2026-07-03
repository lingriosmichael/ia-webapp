import type { TranslationDictionary } from "./en";

const de: TranslationDictionary = {
  language: {
    switcherLabel: "Sprache",
    german: "DE",
    english: "EN",
  },
  common: {
    brand: "Impact Atlas",
    evidenceWorkspace: "Evidenz-Arbeitsbereich",
    logIn: "Anmelden",
    register: "Registrieren",
    logOut: "Abmelden",
    search: "Suchen…",
    searchAria: "Suche",
    create: "Erstellen",
    loading: "Wird geladen…",
    tryAgain: "Erneut versuchen",
    goHome: "Zur Startseite",
    yes: "Ja",
    no: "Nein",
    other: "Sonstiges",
    now: "Jetzt",
    open: "Öffnen",
    ready: "Bereit",
    optional: "Optional",
    back: "Zurück",
    continue: "Weiter",
    notFoundTitle: "Seite nicht gefunden",
    notFoundDescription:
      "Die angeforderte Seite existiert nicht oder ist nicht mehr verfügbar.",
    backToHome: "Zur Startseite",
  },
  landing: {
    badge: "KI-gestützte Wirkungsanalyse",
    title: "Organisationen, Projekte und Aktivitäten vor der KI-Verarbeitung.",
    description:
      "Starten Sie mit dem tatsächlichen Arbeitsablauf Ihres Teams: Organisation anlegen, Projekte erstellen, Aktivitäten verwalten, Nachweise hochladen und Job-Metadaten in einem echten Backend speichern. ImpactPilot interpretiert Ihre Projektdaten automatisch und verwandelt Nachweise in aussagekräftige Analysen, Visualisierungen und Berichte - für fundierte Entscheidungen, eine wirkungsvolle Kommunikation und belastbare Förderberichte.",
    createWorkspace: "Workspace erstellen",
    useExistingAccount: "Vorhandenes Konto nutzen",
    features: {
      organizations: {
        title: "Organisationen",
        description:
          "Jedes Konto startet in einem Organisations-Workspace mit klaren Rollen und Zugriffsrechten. Die KI erkennt Inhalte und Zusammenhänge in Ihren Projektdaten.",
      },
      projects: {
        title: "Projekte",
        description:
          "Projekte bilden die Förder- oder Programmstruktur, in der die Evidenzarbeit organisiert wird. Automatisch berechnete Kennzahlen und verständliche Visualisierungen zeigen den tatsächlichen Projektfortschritt.",
      },
      activities: {
        title: "Aktivitäten",
        description:
          "Aktivitäten gehören zu Projekten und sind der Anker für Uploads, Jobs und Ergebnisverläufe. Bereiten Sie Wirkungsnachweise und Berichte effizient für Fördernde, Partner und die öffentliche Kommunikation auf.",
      },
    },
  },
  auth: {
    loginMarketingTitle:
      "Bauen Sie einen Fördernachweis-Workspace vor der KI-Ebene auf.",
    loginMarketingDescription:
      "Starten Sie mit Organisationen, Projekten, Aktivitäten, Authentifizierung und einem belastbaren Backend. Die semantische Verarbeitung kommt später.",
    registerMarketingTitle: "Ihre Projekte erzählen bereits eine Geschichte",
    registerMarketingDescription:
      "In wenigen Minuten richten Sie Ihren Workspace ein und können anschließend Projektdaten hochladen, analysieren und Wirkung sichtbar machen.",
    loginTitle: "Anmelden",
    loginDescription:
      "Melden Sie sich an, um auf Ihren Organisations-Workspace zuzugreifen.",
    registerTitle: "Konto erstellen",
    registerDescription:
      "Nach der Registrierung können Sie Projekte anlegen, Nachweise hochladen und die Wirkung Ihrer Programme mit aussagekräftigen Analysen, Visualisierungen und Berichten nachvollziehbar darstellen.",
    email: "E-Mail",
    password: "Passwort",
    fullName: "Vollständiger Name",
    organizationName: "Name der Organisation",
    emailPlaceholder: "team@organisation.de",
    passwordPlaceholder: "Mindestens 8 Zeichen",
    hiddenPasswordPlaceholder: "••••••••",
    fullNamePlaceholder: "Max Mustermann",
    organizationPlaceholder: "Beispiel Stiftung",
    loggingIn: "Anmeldung läuft…",
    creatingAccount: "Konto wird erstellt…",
    creatingWorkspace: "Workspace wird erstellt…",
    createAccount: "Konto erstellen",
    newHere: "Neu hier?",
    createAnAccount: "Konto erstellen",
    alreadyHaveAccount: "Sie haben bereits ein Konto?",
    noOrganizationToast: "Diesem Konto ist noch keine Organisation zugeordnet.",
    loginSuccessToast: "Anmeldung erfolgreich.",
    loginFailed: "Anmeldung fehlgeschlagen.",
    registerSuccessToast: "Konto wurde erstellt.",
    registerFailed: "Registrierung fehlgeschlagen.",
    workspaceProvisioningTitle:
      "Erstellen Sie zuerst den Organisations-Workspace.",
    workspaceProvisioningDescription:
      "Legen Sie zuerst die Organisation an, bevor Sie Projektleitungen einladen und in den Workspace führen.",
    workspaceProvisioningCardTitle: "Workspace erstellen",
    workspaceProvisioningCardDescription:
      "Verwenden Sie den Organisationsnamen genau so, wie Ihr Team ihn in Impact Atlas sehen soll.",
    workspaceCreatedToast: "Workspace wurde erstellt.",
    workspaceCreateFailed: "Workspace konnte nicht erstellt werden.",
    welcomeTitle: "Willkommen bei Impact Atlas.",
    welcomeDescription:
      "Ihr Workspace ist bereit. Konfigurieren Sie zuerst die Organisation, bevor Sie Ihr Team einladen.",
    welcomeCardTitle: "Ihr Workspace ist bereit.",
    welcomeCardDescription:
      "Konfigurieren Sie jetzt Ihre Organisation, bevor Sie Ihr Team einladen.",
    profileTitle: "Geben Sie dem Workspace eine klare Identität.",
    profileDescription:
      "Halten Sie das Organisationsprofil bewusst leichtgewichtig: Name, Mission und Logo.",
    inviteTitle: "Laden Sie Ihr Team ein.",
    inviteDescription:
      "Laden Sie Ihre Projektleitungen ein, damit sie Projekte anlegen und Nachweise hochladen können.",
    inviteCardTitle: "Projektleitungen einladen",
    inviteCardDescription:
      "Der E-Mail-Versand kann vorerst simuliert bleiben. Wichtig sind Einladungsdatensätze und ein funktionierender Annahmefluss.",
    inviteSuccessToast: "Einladung wurde gesendet.",
    inviteFailedToast: "Einladung konnte nicht erstellt werden.",
    projectManagerOnly: "Rolle: Projektleitung",
    inviting: "Einladung wird gesendet…",
    sendInvitation: "Einladung senden",
    pendingInvitation: "Wartet auf Annahme",
    finishOnboarding: "Onboarding abschließen",
    invitationTitle: "Einladung annehmen.",
    invitationDescription:
      "Treten Sie der Organisation bei, erstellen Sie Ihr Passwort und melden Sie sich dann an.",
    invitationCardTitle: "Einladung annehmen",
    invitationCardDescription: "Sie treten {{organization}} mit {{email}} bei.",
    invitationExistingAccountDescription:
      "Diese Einladung gehört zu einem bestehenden Konto. Melden Sie sich als {{email}} an, um {{organization}} beizutreten.",
    invitationExistingAccountMismatch:
      "Sie sind als {{signedInEmail}} angemeldet. Melden Sie sich als {{invitedEmail}} an, um die Einladung anzunehmen.",
    acceptingInvitation: "Einladung wird angenommen…",
    acceptInvitation: "Einladung annehmen",
    signInToAcceptInvitation: "Zum Annehmen anmelden",
    invitationAccepted: "Einladung angenommen. Sie können sich jetzt anmelden.",
    invitationAcceptedExistingAccount:
      "Einladung angenommen. Weiterleitung in den Workspace.",
    invitationAcceptFailed: "Einladung konnte nicht angenommen werden.",
  },
  organization: {
    loading: "Workspace wird geladen…",
    loadFailed: "Workspace konnte nicht geladen werden.",
    eyebrow: "Organisations-Workspace",
    description:
      "Erstellen Sie Projekte, fügen Sie Aktivitäten hinzu und führen Sie Nutzer in den Evidenz-Workspace.",
    stats: {
      projects: "Projekte",
      activities: "Aktivitäten",
      role: "Rolle",
      status: "Status",
      ready: "Bereit",
      backendConnected: "Backend verbunden",
    },
    createProject: "Projekt erstellen",
    projectName: "Projektname",
    projectNamePlaceholder: "Jugend-Mentoring-Programm",
    descriptionLabel: "Beschreibung",
    projectDescriptionPlaceholder: "Optionale Zusammenfassung für das Team",
    creatingProject: "Wird erstellt…",
    createProjectToast: "Projekt wurde erstellt.",
    createProjectFailed: "Projekt konnte nicht erstellt werden.",
    noProjectsTitle: "Noch keine Projekte",
    noProjectsDescription:
      "Erstellen Sie das erste Projekt für diese Organisation, um die Workspace-Routen freizuschalten.",
    projectEyebrow: "Projekt",
    noProjectDescription: "Es wurde noch keine Beschreibung hinzugefügt.",
    openProject: "Projekt öffnen",
    noActivityDescription: "Noch keine Aktivitätsbeschreibung vorhanden.",
    uploads: "Uploads",
    jobs: "Jobs",
    results: "Ergebnisse",
    addActivityNamePlaceholder: "Aktivitätsname hinzufügen",
    addActivityDescriptionPlaceholder: "Optionale Kurzbeschreibung",
    addingActivity: "Wird hinzugefügt…",
    addActivity: "Aktivität hinzufügen",
    createActivityToast: "Aktivität wurde erstellt.",
    createActivityFailed: "Aktivität konnte nicht erstellt werden.",
  },
  project: {
    loading: "Projekt wird geladen…",
    loadFailed: "Projekt konnte nicht geladen werden.",
    crumbsOrganization: "Organisation",
    sidebarProject: "Projekt",
    sidebarOverview: "Übersicht",
    sidebarAnalytics: "Analysen",
    sidebarInsights: "Erkenntnisse",
    sidebarActivities: "Aktivitäten",
    sidebarBrief: "Aktivitätsübersicht",
    sidebarUpload: "Hochladen",
    viewInsights: "Erkenntnisse anzeigen",
    eyebrow: "Projekt",
    noDescription: "Noch keine Projektbeschreibung vorhanden.",
    readOnlyBannerTitle: "Ansicht als Organisationsadministration",
    readOnlyBannerDescription:
      "Dieses Projekt gehört {{owner}}. Sie können es hier prüfen, Bearbeitungen bleiben aber der verantwortlichen Person vorbehalten.",
    unknownOwner: "einer anderen Projektleitung",
    stats: {
      activities: "Aktivitäten",
      activitiesDelta: "Innerhalb dieses Projekts erfasst",
      status: "Projektstatus",
      statusDelta: "Aktuelle Umsetzungsphase",
      uploads: "Nachweise hochgeladen",
      uploadsDelta: "Über alle Aktivitäten",
      lastUpdated: "Zuletzt aktualisiert",
      lastUpdatedDelta: "Letzte Projektänderung",
    },
    dashboard: {
      health: "Projektstatus",
      evidenceCompleteness: "Evidenz-Vollständigkeit",
      insightsGenerated: "KI-Erkenntnisse",
      lastEvidenceUpload: "Letzter Evidenz-Upload",
      whatNeedsAttention: "Was Aufmerksamkeit braucht",
      recentActivity: "Letzte Aktivität",
      noRecentActivity: "Noch keine Projektänderungen.",
      healthStates: {
        strong: "Stark",
        progress: "In Arbeit",
        attention: "Handlungsbedarf",
      },
      healthDescriptions: {
        strong:
          "Evidenz wurde hochgeladen und Erkenntnisse sind bereits verfügbar.",
        progress:
          "Die ersten Nachweise sind da und die KI-Verarbeitung läuft noch.",
        attention:
          "Dieses Projekt braucht noch Uploads oder Prüfung, bevor Erkenntnisse bereitstehen.",
      },
      completenessValue: "{{withEvidence}}/{{total}} Aktivitäten",
      completenessDelta: "{{percent}} % haben bereits Evidenz",
      insightsDelta: "{{count}} ausstehend",
      insightsReadyDelta: "Bereit zur Prüfung",
      noInsightsDelta: "Noch keine Erkenntnisse erzeugt",
      noUploadValue: "Noch keiner",
      noUploadDelta: "Laden Sie Evidenz hoch, um die Pipeline zu starten",
      attentionItems: {
        noEvidence: "Es wurde noch keine Evidenz hochgeladen.",
        partialEvidence:
          "{{count}} Aktivitäten benötigen noch Evidenz-Uploads.",
        pendingInsights: "{{count}} Erkenntnis-Jobs laufen noch.",
        failedJobs: "{{count}} Verarbeitungsjobs benötigen Aufmerksamkeit.",
        healthy:
          "Jede Aktivität hat Evidenz, und derzeit gibt es keine offenen Probleme.",
      },
      recentActivityTypes: {
        activity_created: "Aktivität erstellt",
        dataset_uploaded: "Datensatz hochgeladen",
        job_completed: "Verarbeitung abgeschlossen",
        job_failed: "Verarbeitung benötigt Prüfung",
        insight_generated: "KI-Erkenntnisse erzeugt",
      },
      recentActivityActivitySuffix: "für {{name}}",
    },
    emptyStateTitle: "Willkommen bei {{name}}",
    emptyStateDescription: "Jedes Projekt besteht aus Aktivitäten.",
    emptyStateSupporting:
      "In Aktivitäten laden Sie Monitoring-Daten hoch, interpretieren Evidenz und erzeugen Erkenntnisse.",
    emptyStateAction: "Erste Aktivität erstellen",
    addAnotherActivity: "Weitere Aktivität hinzufügen",
    activityNamePlaceholder: "Aktivitätsname",
    activityDescriptionPlaceholder: "Optionale Kurzbeschreibung",
    addingActivity: "Wird hinzugefügt…",
    addActivity: "Aktivität hinzufügen",
    activitiesHeading: "Aktivitäten",
    activitiesDescription:
      "Jede Aktivität besitzt ihre eigene Upload- und Job-Historie.",
    noActivityDescription: "Noch keine Aktivitätsbeschreibung vorhanden.",
    brief: "Übersicht",
    upload: "Hochladen",
    open: "Öffnen",
    privacyTitle: "Ihre Nachweise bleiben privat",
    privacyDescription:
      "Personenbezogene Merkmale bleiben außerhalb der KI-Ebene. Das Backend speichert bereits Uploads und simulierte Job-Fortschritte; die semantische Interpretation folgt später.",
    programmeAnalytics: "Programm-Analysen",
  },
  projectAnalytics: {
    loading: "Analysen werden geladen…",
    loadFailed: "Analysen konnten nicht geladen werden.",
    crumbsProjects: "Projekte",
    crumbsAnalytics: "Analysen",
    eyebrow: "Programm-Analysen",
    title: "Platzhalteransicht für Analysen",
    description:
      "Diese Ansicht verwendet noch repräsentative Diagramme, da KI-Analysen noch nicht implementiert sind. Live-Metadaten für {{count}} Aktivitäten kommen bereits aus dem Backend.",
    charts: {
      attendanceTrend: "Teilnahmetrends",
      confidenceImprovement: "Entwicklung des Vertrauens",
      attendanceDistribution: "Verteilung der Teilnahme",
      completionByAgeGroup: "Abschluss nach Altersgruppe",
      mentorMatching: "Mentor-Zuordnung",
      backendStatus: "Backend-Status",
      mockDataset: "Beispieldatensatz",
    },
    backendStatus: {
      projectLoaded: "Projekt geladen",
      activitiesLoaded: "Aktivitäten geladen",
      aiAnalytics: "KI-Analysen",
      notImplemented: "Noch nicht implementiert",
      yes: "Ja",
    },
    metrics: {
      participants: {
        label: "Teilnehmende",
        delta: "+12 gegenüber letztem Zyklus",
      },
      attendanceRate: { label: "Teilnahmequote", delta: "+4 Punkte" },
      programmeCompletion: { label: "Programmabschluss", delta: "+6 Punkte" },
      confidenceImprovement: {
        label: "Vertrauenszuwachs",
        delta: "Skala 1–10",
      },
      missingValues: { label: "Fehlende Werte", delta: "1,1 % der Zellen" },
      duplicateRows: {
        label: "Doppelte Zeilen",
        delta: "automatisch markiert",
      },
    },
    mentorMatching: {
      matched: "Zugeordnet",
      pending: "Ausstehend",
      unmatched: "Nicht zugeordnet",
    },
    series: {
      attendance: "Teilnahme",
      preConfidence: "Ausgangsvertrauen",
      postConfidence: "Vertrauen am Ende",
      count: "Anzahl",
      completed: "Abgeschlossen",
      dropped: "Abgebrochen",
      mentorMatches: "Mentor-Zuordnungen",
    },
  },
  projectInsights: {
    loading: "Erkenntnisse werden geladen…",
    loadFailed: "Erkenntnisse konnten nicht geladen werden.",
    crumbsProjects: "Projekte",
    crumbsInsights: "Erkenntnisse",
    eyebrow: "KI-Erkenntnisse",
    title: "Platzhalteransicht für Erkenntnisse",
    description:
      "Das Projekt und {{count}} Aktivitäten kommen live aus dem Backend. Die folgenden narrativen Erkenntnisse bleiben simuliert, bis der Python-Interpretationsservice integriert ist.",
    executiveSummaryTitle: "Kurzfassung",
    executiveSummary:
      "Das Mentoring-Programm Q3 2026 liegt im Plan. Die Teilnahme bleibt über alle Workshops hinweg stabil und die Vertrauenswerte haben sich über den 12-Wochen-Zyklus im Durchschnitt um 2,3 Punkte verbessert. Die Mentor-Zuordnung ist sehr erfolgreich, langfristige Ergebnisse nach Programmende werden jedoch noch nicht gemessen.",
    keyFindingsTitle: "Wesentliche Erkenntnisse",
    interestingPatternsTitle: "Auffällige Muster",
    interestingPatternsDescription:
      "Signale, die genauer betrachtet werden sollten",
    evidenceGapsTitle: "Evidenzlücken",
    evidenceGapsDescription:
      "Was Ihre aktuellen Daten noch nicht beantworten können",
    recommendationsTitle: "Empfehlungen",
    privacyTitle: "Datenschutz-Zusammenfassung",
    privacyDescription:
      "Wie Ihre Nachweise vor der KI-Interpretation vorbereitet werden",
    keyFindings: [
      "Die Teilnahme bleibt über alle Workshops hinweg stabil und liegt über 12 Wochen im Schnitt bei 82 %.",
      "Das Vertrauen hat sich nach Programmabschluss deutlich verbessert (+2,3 Punkte auf einer 10-Punkte-Skala).",
      "Die Mentor-Zuordnung ist mit 91 % sehr erfolgreich; in Woche 12 sind nur 5 Teilnehmende ohne Zuordnung.",
      "Ältere Teilnehmende (18+) schließen das Programm häufiger ab als die Gruppe 14–15 Jahre.",
    ],
    interestingPatterns: [
      "Nach Woche vier sinkt die Teilnahme, was auf ein Motivationsloch in der Mitte des Zyklus hindeutet.",
      "Bezirke mit Präsenztraining für Mentorinnen und Mentoren zeigen eine um 8 % höhere Abschlussquote als rein digitale Bezirke.",
      "Der Vertrauenszuwachs beschleunigt sich zwischen Woche 3 und 6 und flacht danach ab.",
    ],
    evidenceGaps: [
      "Langfristige Ergebnisse (3, 6, 12 Monate nach Programmende) werden noch nicht gemessen.",
      "Rückmeldungen von Mentorinnen und Mentoren werden im aktuellen Datensatz nicht erhoben.",
      "Gründe für den Rückgang nach Woche 4 werden nicht erfasst.",
    ],
    recommendations: [
      "Führen Sie in Woche 4 einen kurzen Zwischencheck ein, um das Motivationsloch früh zu adressieren.",
      "Ergänzen Sie eine Nachbefragung 3 Monate nach Programmende, um nachhaltiges Vertrauen zu messen.",
      "Erheben Sie Sitzungsprotokolle der Mentorinnen und Mentoren, um Ergebnisse aus mehreren Blickwinkeln abzusichern.",
    ],
    privacy: [
      "Personenbezogene Merkmale (participant_name, email) wurden vor der KI-Interpretation gehasht.",
      "Sensibler Freitext (case_notes) wurde vor der Analyse entfernt.",
      "Quasi-Identifier (age_group, district) wurden verallgemeinert, um das Re-Identifikationsrisiko zu senken.",
    ],
  },
  activityTabs: {
    brief: "Übersicht",
    schema: "Datenprüfung",
    analytics: "Analyse",
    insights: "Erkenntnisse",
    settings: "Einstellungen",
  },
  activityBrief: {
    loading: "Aktivität wird geladen…",
    loadFailed: "Aktivität konnte nicht geladen werden.",
    redirectingToOverview: "Zur Aktivitätsübersicht wird zurückgekehrt…",
    crumb: "Übersicht",
    eyebrow: "Aktivität",
    noDescription:
      "Für diese Aktivität wurde noch keine Beschreibung hinzugefügt.",
    hero: {
      badges: {
        empty: "Evidenz-Start",
        uploading: "Wird hochgeladen",
        processing: "KI arbeitet",
        ready: "Bereit zur Prüfung",
        attention: "Handlungsbedarf",
      },
      titles: {
        empty: "Laden Sie Ihren ersten Datensatz hoch",
        uploading: "Ihr Datensatz wird hochgeladen",
        processing: "Impact Atlas bereitet Ihre Evidenz vor",
        ready: "Ihre Evidenz ist bereit für den nächsten Schritt",
        attention: "Dieser Datensatz braucht einen zweiten Blick",
      },
      descriptions: {
        empty:
          "Laden Sie CSV- oder Excel-Monitoringdaten hoch, um die KI-Analyse zu starten.",
        uploading:
          "Ihre Datei wird gerade in den Evidenz-Workflow aufgenommen.",
        processing:
          "Der neueste Datensatz wird auf Struktur, Datenschutzrisiken und Analysebereitschaft geprüft.",
        ready:
          "{{fileName}} wurde von der KI verstanden. {{count}} Prüfpunkte sind noch sichtbar, bevor die Analyse weitergeht.",
        attention:
          "Der letzte Evidenzlauf wurde nicht sauber abgeschlossen. Laden Sie die Datei erneut hoch, um den Workflow fortzusetzen.",
      },
      supporting:
        "Unterstützt werden CSV, XLSX, Drag & Drop oder Dateiauswahl.",
      processingMeta: "Aktueller Pipeline-Status: {{status}}",
      reviewData: "Daten prüfen",
      continueToAnalysis: "Weiter zur Analyse",
      uploadAnother: "Weiteren Datensatz hochladen",
      uploadFirstDataset: "Datensatz hochladen",
    },
    uploading: {
      title: "Datensatz wird hochgeladen…",
      inProgress: "Läuft",
      description:
        "Bleiben Sie auf dieser Seite. Die Aktivitätsübersicht führt Sie automatisch zum nächsten Schritt.",
    },
    metrics: {
      activityStatus: "Aktivitätsstatus",
      project: "Projekt",
      lastUpload: "Letzter Upload",
      aiStatus: "KI-Status",
      noUpload: "Noch keiner",
      noUploadDescription: "Laden Sie Evidenz hoch, um den Workflow zu starten",
      stateDescriptions: {
        empty: "Es wurde noch keine Evidenz hochgeladen",
        uploading: "Ein Datensatz wird gerade hochgeladen",
        processing: "Die KI prüft die hochgeladene Evidenz",
        ready: "Die Evidenz ist bereit für Prüfung oder Analyse",
        attention: "Ein Datensatz braucht einen neuen Upload oder eine Prüfung",
      },
      aiStatusValues: {
        empty: "Warten auf Daten",
        uploading: "Wird hochgeladen",
        processing: "Daten werden verstanden",
        ready: "Bereit zur Prüfung",
        attention: "Problem erkannt",
      },
      aiStatusDescription:
        "{{reviewCount}} Prüfpunkte sichtbar · {{insights}} Erkenntnisse derzeit verfügbar",
    },
    uploader: {
      eyebrow: "Evidenz hinzufügen",
      title: "Monitoring-Daten in diese Aktivität bringen",
      description:
        "Laden Sie eine CSV- oder Excel-Datei hoch. Impact Atlas führt Sie von hier aus durch Prüfung, Analyse und Erkenntnisse.",
      cta: "KI-Prüfung starten",
      remove: "Entfernen",
    },
    detail: {
      projectGoal: "Projektziel",
      noProjectGoal: "Es wurde noch kein Projektziel erfasst.",
    },
    pipeline: {
      title: "KI-Evidenz-Workflow",
      description:
        "Sie müssen nicht zwischen technischen Schritten wechseln. Wir führen Sie zur Datenprüfung, sobald alles bereit ist.",
      stages: [
        "Upload eingegangen",
        "Daten werden geprüft",
        "Spalten werden verstanden",
        "Datenschutzrisiken werden erkannt",
        "Analyse wird vorbereitet",
      ],
    },
    nextStep: {
      title: "Was mache ich als Nächstes?",
      reviewData: "Daten prüfen",
      continueToAnalysis: "Weiter zur Analyse",
      addAnotherDataset: "Weiteren Datensatz hochladen",
      descriptions: {
        empty:
          "Starten Sie mit einem Datensatz für diese Aktivität. Sobald er vorliegt, prüft die KI ihn automatisch.",
        uploading:
          "Der Upload läuft. Sobald die Datei angekommen ist, wechselt diese Seite direkt in die KI-Verarbeitung.",
        processing:
          "Warten Sie, bis die KI die Datei verstanden hat. Danach werden Sie automatisch zur Datenprüfung oder Analyse geführt.",
        ready:
          "Die Evidenz ist bereit. Prüfen Sie zuerst das Datenverständnis und gehen Sie dann in die Analyse.",
        attention:
          "Der aktuelle Evidenzlauf braucht Aufmerksamkeit. Laden Sie eine neue Datei hoch, um den Workflow fortzusetzen.",
      },
      items: {
        empty: [
          "Laden Sie eine CSV- oder Excel-Datei aus Ihrem Monitoring hoch.",
          "Ein klarer Datensatz pro Aktivität erleichtert der KI die Prüfung.",
        ],
        uploading: [
          "Lassen Sie diese Seite geöffnet, bis der Upload abgeschlossen ist.",
          "Sobald die KI die Datei liest, werden Sie automatisch weitergeführt.",
        ],
        processing: [
          "Die KI prüft Struktur, Datenschutz und Analysebereitschaft.",
          "Sie müssen keinen weiteren technischen Schritt manuell öffnen.",
        ],
        ready: [
          "Prüfen Sie, ob die KI die wichtigsten Spalten richtig verstanden hat.",
          "Gehen Sie erst dann in die Analyse, wenn offene Prüfpunkte geklärt sind.",
        ],
        attention: [
          "Laden Sie den Datensatz erneut hoch, wenn der letzte Lauf hängen blieb oder fehlschlug.",
          "Nutzen Sie die Datenprüfung, um zu sehen, was die KI bereits verstanden hat.",
        ],
      },
    },
    evidence: {
      title: "Evidenzstatus",
      datasets: "Datensätze",
      dataReview: "Datenprüfung",
      analysis: "Analyse",
      insights: "Erkenntnisse",
      qualityIssues: "Datenqualität",
      latestFile: "Neueste Datei",
      noFile: "Noch keine Datei hochgeladen",
      reviewValue: "{{count}} Punkt zur Prüfung",
      analysisValue: "{{status}}",
      insightsValue: "{{count}} Erkenntnisse verfügbar",
      qualityIssuesValue:
        "{{missing}} fehlende Werte · {{duplicates}} doppelte Zeilen",
    },
  },
  upload: {
    loading: "Seite zum Hochladen wird geladen…",
    loadFailed: "Die Seite zum Hochladen konnte nicht geladen werden.",
    crumb: "Hochladen",
    eyebrow: "Nachweise hochladen",
    title: "Nachweise für {{name}} hochladen",
    description:
      "Legen Sie Ihre CSV- oder Excel-Datei ab, um den Evidenz-Workflow dieser Aktivität zu starten.",
    dropzoneTitle: "CSV- oder Excel-Datei hierher ziehen",
    dropzoneBrowsePrefix: "oder",
    dropzoneBrowseAction: "Datei vom Computer auswählen",
    accepts: "Akzeptiert .csv, .xlsx, .xls",
    storageNote:
      "Hochgeladene Evidenz wird für die KI-Prüfung vorbereitet und bleibt mit dieser Aktivität verknüpft.",
    existingCounts: "Vorhandene Datensätze: {{uploads}} · KI-Läufe: {{jobs}}",
    readyToUpload: "Bereit zum Hochladen",
    ready: "Bereit",
    removeFileAria: "Datei entfernen",
    uploading: "Wird hochgeladen…",
    createProcessingJob: "KI-Prüfung starten",
    successToast: "Datensatz hochgeladen. Die KI-Prüfung hat begonnen.",
    failedToast: "Upload fehlgeschlagen.",
  },
  processing: {
    loading: "Job-Status wird geladen…",
    loadFailed: "Der Job-Status konnte nicht geladen werden.",
    crumb: "Interpret",
    title: "Interpretationsstatus: {{status}}",
    description:
      "Die KI liest die hochgeladene Datei, ordnet ihre Struktur ein und bereitet eine Interpretationsebene vor, die Sie vor der tieferen Analyse prüfen können.",
    pipeline: "Interpretationsfortschritt",
    stages: [
      "Datensatz wird hochgeladen",
      "Upload-Metadaten werden erfasst",
      "Interpretationsjob wird erstellt",
      "KI-Verarbeitung wird eingereiht",
      "Dateistruktur wird gelesen",
      "Prüfstatus wird vorbereitet",
    ],
    backToUpload: "Zurück zum Upload",
    continueToReview: "Weiter zur Prüfung",
  },
  schemaReview: {
    loading: "Schema-Prüfung wird geladen…",
    loadFailed: "Die Schema-Prüfung konnte nicht geladen werden.",
    crumb: "Datensatzprüfung",
    eyebrow: "KI-Datensatzprüfung",
    title: "Hat die KI Ihren Datensatz richtig verstanden?",
    description:
      "Impact Atlas ordnet jede hochgeladene Spalte ein, markiert personenbezogene Daten und empfiehlt sichere Transformationen, bevor die Interpretation weitergeht.",
    cta: {
      uploadDataset: "Datensatz hochladen",
      reviewRequired: "Prüfung erforderlich ({{count}})",
      continueToAnalysis: "Weiter zur Analyse",
      awaitingInterpretation: "Interpretation ausstehend",
      reviewComplete: "Prüfung abgeschlossen",
    },
    empty: {
      eyebrow: "KI-Dateninterpretation",
      title: "Es wurde noch kein Datensatz analysiert.",
      description:
        "Sobald Sie eine CSV- oder Excel-Datei hochladen, liest Impact Atlas die Struktur, versteht die Felder, erkennt personenbezogene Daten und bereitet alles für die Interpretation vor.",
      benefits: [
        "Jede Spalte automatisch erkennen",
        "Die wahrscheinlichste Bedeutung jedes Felds verstehen",
        "Personenbezogene oder sensible Daten markieren",
        "Anonymisierung vor der Analyse empfehlen",
        "Den Datensatz für die KI-Interpretation vorbereiten",
      ],
      cta: "Datensatz hochladen",
    },
    datasetStatus: {
      readyTitle: "Datensatz erfolgreich interpretiert",
      readyDescription:
        "Die KI hat {{count}} Felder erkannt und für den nächsten Interpretationsschritt vorbereitet.",
      reviewTitle: "Die KI braucht Ihre Prüfung, bevor es weitergeht",
      reviewDescription:
        "Die meisten Felder wurden automatisch klassifiziert, aber {{count}} Feld muss noch bestätigt werden.",
      lastUpload: "Letzter Upload: {{date}}",
    },
    workflow: {
      upload: "Upload",
      understanding: "KI-Verständnis",
      review: "Prüfung",
      analysis: "Analyse",
    },
    summary: {
      columnsDetected: "Erkannte Spalten",
      autoClassified: "Automatisch klassifiziert",
      reviewedByYou: "Von Ihnen geprüft",
      needsReview: "Zur Prüfung",
      overallConfidence: "Gesamtsicherheit",
    },
    mapping: {
      title: "Spaltenzuordnung",
      description:
        "{{count}} Spalten in der Ansicht. Wählen Sie eine Spalte aus, um die KI-Interpretation zu prüfen.",
    },
    quality: {
      title: "Datenqualitätsprobleme",
      missingValues: "Fehlende Werte",
      duplicateRows: "Doppelte Zeilen",
      sensitiveText: "Sensibler Freitext",
      sensitiveTextValue: "Vor der Analyse entfernt",
    },
    searchPlaceholder: "Spalten durchsuchen…",
    headers: {
      originalName: "Originalname",
      semanticMeaning: "KI-Interpretation",
      privacyCategory: "Datenschutz",
      transformation: "Transformation",
      confidence: "Status",
    },
    statusLabels: {
      confirmed: "Bestätigt",
      high: "Hohe Sicherheit",
      review: "Prüfung nötig",
      unsure: "KI unsicher",
    },
    privacyLabels: {
      directIdentifier: "Personenbezogene Daten",
      quasiIdentifier: "Kontextdaten",
      highRisk: "Sensible Notizen",
      operational: "Programmdaten",
      outcome: "Wirkungsdaten",
    },
    transformationLabels: {
      hashed: "Hashen",
      removed: "Entfernen",
      generalised: "Verallgemeinern",
      kept: "Behalten",
    },
    reviewCard: {
      badge: "Die KI braucht Ihre Hilfe",
      possibleMeanings: "Mögliche Bedeutungen",
      confirm: "Bedeutung bestätigen",
      confirmed: "Bestätigt",
      confirmedSelection: "Bestätigt als: {{value}}",
      remainingQuestions: "Offene Prüfungsfragen: {{count}}",
      selectionSaved: "Ausgewählt: {{value}}",
    },
    row: {
      confirmedAs: "Bestätigt als {{value}}",
    },
    detail: {
      eyebrow: "KI-Begründung",
      originalColumn: "Originalspalte: {{column}}",
      confidenceScore: "{{value}}% Sicherheit",
      privacy: "Datenschutzklassifikation",
      transformation: "Empfohlene Transformation",
      sampleValues: "Beispielwerte",
      reasoningTitle: "Warum die KI diese Interpretation gewählt hat",
      noReviewNeededTitle: "Keine Prüfung nötig",
      noReviewNeededDescription:
        "Die KI hat für dieses Feld ein starkes Muster erkannt. Deshalb ist aktuell keine manuelle Bestätigung erforderlich.",
      defaultReasoning: {
        pattern:
          "Die Werte folgen einem konsistenten Muster, das zu typischen Monitoring-Datensätzen passt.",
        privacy:
          "Das Feld wurde als {{privacy}} behandelt, basierend auf der Art der enthaltenen Informationen.",
        transformation:
          "Der empfohlene nächste Schritt ist, dieses Feld vor der tieferen Interpretation zu {{transformation}}.",
      },
    },
    schema: {
      participant_name: {
        semantic: "Teilnehmenden-ID",
        reasoning: [
          "Die Werte sehen nach vollständigen Personennamen aus und nicht nach Programmcodes.",
          "Die meisten Einträge sind eindeutig und deuten daher auf direkte Identifikation hin.",
          "Das Feld steht neben der E-Mail-Spalte, was den Personenbezug zusätzlich stützt.",
        ],
        sampleValues: ["A. Okafor", "J. Martin", "S. Singh"],
      },
      email: {
        semantic: "E-Mail-Adresse",
        reasoning: [
          "Fast alle Werte folgen einem typischen E-Mail-Muster mit @ und Domain-Endung.",
          "Jeder Wert identifiziert eine einzelne Person direkt.",
          "Hashing erhält Verknüpfbarkeit, reduziert aber die Sichtbarkeit während der Interpretation.",
        ],
        sampleValues: [
          "mentor@ngo.org",
          "participant@gmail.com",
          "team@programme.net",
        ],
      },
      age_group: {
        semantic: "Altersgruppe",
      },
      district: {
        semantic: "Geografischer Bereich",
        reasoning: [
          "Die Werte sehen nach Ortsangaben und nicht nach individuellen Kennungen aus.",
          "Standortdaten können in Kombination mit anderen Feldern dennoch Rückschlüsse auf Personen zulassen.",
          "Das Beibehalten des Felds unterstützt Vergleiche zwischen Programmregionen.",
        ],
        sampleValues: ["North District", "Central", "East Hub"],
      },
      sessions_attended: {
        semantic: "Teilnahme-Metrik",
      },
      total_sessions: {
        semantic: "Programmdauer",
      },
      completed_program: {
        semantic: "Abschluss-Metrik",
      },
      pre_confidence_score: {
        semantic: "Ergebnis-Metrik (Ausgangswert)",
      },
      post_confidence_score: {
        semantic: "Ergebnis-Metrik (Endwert)",
      },
      mentor_match_status: {
        semantic: "Status der Mentor-Zuordnung",
        clarifyingQuestion:
          'Was beschreibt "mentor_match_status" in diesem Datensatz?',
        options: [
          "Ergebnis der Zuordnung",
          "Mentor zugewiesen",
          "Programmstatus",
        ],
        reasoning: [
          "Die Werte wirken kategorial und nicht numerisch.",
          "Die Spalte steht neben Teilnahme- und Ergebnisfeldern, daher ist die genaue Bedeutung noch nicht eindeutig.",
        ],
        sampleValues: ["M", "P", "X"],
      },
      case_notes: {
        semantic: "Sensibler Freitext",
        reasoning: [
          "Dieses Feld scheint unstrukturierten narrativen Text zu enthalten.",
          "Freitext enthält oft Namen, Vorfälle oder Kontextdetails, die nicht in die Analyse eingehen sollten.",
          "Das Entfernen senkt das Datenschutzrisiko, ohne die strukturierte Interpretation zu blockieren.",
        ],
        sampleValues: [
          "Participant disclosed family conflict",
          "Mentor noted transport issue",
        ],
      },
    },
  },
  activityAnalytics: {
    loading: "Aktivitätsanalysen werden geladen…",
    loadFailed: "Aktivitätsanalysen konnten nicht geladen werden.",
    crumb: "Analyse",
    eyebrow: "Evidenzanalyse",
    title: "Geprüfte Evidenz in Erkenntnisse übersetzen",
    description:
      "Diese Seite fasst den Datensatz zusammen, sobald die KI ihn für die Analyse vorbereitet hat.",
    gates: {
      noDataset: {
        title: "Die Analyse beginnt mit dem ersten Datensatz",
        description:
          "Laden Sie zuerst Monitoring-Daten in der Aktivitätsübersicht hoch. Sobald die KI die Evidenz gelesen hat, ist diese Seite bereit.",
        cta: "Zur Übersicht",
      },
      processing: {
        title: "Die KI bereitet diesen Datensatz noch vor",
        description:
          "Bleiben Sie im geführten Workflow, bis die Evidenz bereit ist. Die Analyse öffnet sich automatisch nach der Datenprüfung.",
        cta: "Zurück zur Übersicht",
      },
    },
    summary: {
      rows: "Zeilen",
      columns: "Spalten",
      review: "Datenprüfung",
      reviewValue: "{{count}} Punkt offen",
      insights: "Erkenntnisse",
      insightsValue: "{{count}} verfügbar",
    },
    metricsTitle: "Aktuelle Analyseansicht",
    storyTitle: "Was diese Analyse bereits zeigt",
    storyPoints: [
      "Die hochgeladene Evidenz lässt sich schon jetzt in zentrale Monitoring-Kennzahlen übersetzen.",
      "Dieser erste Durchgang macht Teilhabe, Abschlüsse und Datenqualitätsmuster sichtbar.",
      "Für narrative Interpretation und Empfehlungen nutzen Sie als Nächstes die Erkenntnisse-Seite.",
    ],
    nextActionTitle: "Nächster Schritt",
    nextActionReady:
      "Der Datensatz ist analysebereit. Wechseln Sie zu den Erkenntnissen, wenn Sie narrative Interpretation und Empfehlungen sehen möchten.",
    nextActionBlocked:
      "Klären Sie zuerst die offenen Prüfpunkte, bevor Sie sich auf nachgelagerte Analyse oder Erkenntnisse verlassen.",
    reviewDataCta: "Daten prüfen",
    openInsightsCta: "Erkenntnisse öffnen",
  },
  activityInsights: {
    loading: "Aktivitätserkenntnisse werden geladen…",
    loadFailed: "Aktivitätserkenntnisse konnten nicht geladen werden.",
    crumb: "Erkenntnisse",
    eyebrow: "KI-Erkenntnisse",
    title: "Die Geschichte in Ihren Evidenzdaten lesen",
    description:
      "Erkenntnisse helfen NGO-Teams dabei, von Evidenz zu Interpretation, Empfehlungen und nächsten Schritten zu gelangen.",
    emptyTitle: "Noch keine Erkenntnisse verfügbar",
    emptyDescription:
      "Laden Sie einen Datensatz hoch und schließen Sie die Datenprüfung ab, um KI-generierte Erkenntnisse zu erhalten.",
    emptyCta: "Zur Übersicht",
    summary: {
      generated: "Erstellte Erkenntnisse",
      keyFindings: "Zentrale Erkenntnisse",
      privacyChecks: "Datenschutzprüfungen",
    },
    executiveSummaryTitle: "Management-Zusammenfassung",
    keyFindingsTitle: "Zentrale Erkenntnisse",
    recommendationsTitle: "Empfehlungen",
    privacyBoundaryTitle: "Datenschutzgrenze",
    privacyBoundaryDescription:
      "Personenbezogene Merkmale werden vor der Analyse reduziert, sodass sich die Erkenntnisebene auf Programmevidenz statt auf offengelegte Teilnehmendendaten konzentriert.",
  },
  activitySettings: {
    loading: "Aktivitätseinstellungen werden geladen…",
    loadFailed: "Die Aktivitätseinstellungen konnten nicht geladen werden.",
    crumb: "Einstellungen",
    eyebrow: "Aktivitätseinstellungen",
    title: "Diese Aktivität sauber ausrichten",
    description:
      "Prüfen Sie die Kerndaten, die Evidenzsammlung, KI-Prüfung und Reporting für diese Aktivität steuern.",
    activityDetailsTitle: "Aktivitätsdetails",
    workflowGuardrailsTitle: "Workflow-Leitplanken",
    workflowGuardrails: [
      "Nutzen Sie möglichst einen klaren Datensatz pro Aktivität.",
      "Halten Sie Aktivitätsnamen und Beschreibungen spezifisch, damit der KI-Kontext verlässlich bleibt.",
      "Aktualisieren Sie Verantwortlichkeit und Status, wenn sich die Umsetzung verändert.",
    ],
    contextTitle: "Warum dieser Kontext wichtig ist",
    supportTitle: "Unterstützung für spätere Iterationen",
    supportDescription:
      "Diese Seite wird zum Ort für Aktivitätsmetadaten, Evidenzregeln und spätere Workflow-Einstellungen ausgebaut.",
    noOwner: "Es wurde noch keine verantwortliche Person zugewiesen.",
    noDescription: "Es wurde noch keine Aktivitätsbeschreibung ergänzt.",
    noProjectGoal: "Es wurde noch kein Projektziel erfasst.",
    fields: {
      name: "Name",
      status: "Status",
      project: "Projekt",
      owner: "Verantwortliche Person",
      created: "Erstellt",
      updated: "Aktualisiert",
      description: "Beschreibung",
    },
  },
  enums: {
    roles: {
      ORGANIZATION_ADMIN: "Organisationsadministration",
      PROJECT_MANAGER: "Projektleitung",
    },
    status: {
      planning: "Planung",
      draft: "Entwurf",
      active: "Aktiv",
      archived: "Archiviert",
      queued: "Warteschlange",
      processing: "In Verarbeitung",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      pending: "Ausstehend",
      uploaded: "Hochgeladen",
      available: "Verfügbar",
    },
    privacyCategory: {
      directIdentifier: "Direkter Identifikator",
      quasiIdentifier: "Quasi-Identifikator",
      highRisk: "Hohes Risiko",
      operational: "Operativ",
      outcome: "Ergebnis",
    },
    transformation: {
      hashed: "Gehasht",
      removed: "Entfernt",
      generalised: "Verallgemeinert",
      kept: "Beibehalten",
    },
  },
  sidebar: {
    workspace: "Workspace",
    projects: "Projekte",
    members: "Mitglieder",
    billing: "Abrechnung",
    sectionTitle: "Projekte",
    projectSingular: "Projekt",
    projectPlural: "Projekte",
    addProject: "Projekt hinzufügen",
    activities: "Aktivitäten",
    addActivity: "Aktivität hinzufügen",
    noProjects: "Noch keine Projekte",
    createFirstProject:
      "Erstellen Sie Ihr erstes Projekt, um den Workspace zu starten.",
    overview: "Übersicht",
    analytics: "Analysen",
    insights: "Erkenntnisse",
    brief: "Übersicht",
    dataReview: "Datenprüfung",
    activityAnalysis: "Analyse",
    activityInsights: "Erkenntnisse",
    activitySettings: "Einstellungen",
    projectSettings: "Projekteinstellungen",
    organizationSettings: "Organisationseinstellungen",
    projectActions: "Projektaktionen",
    deleteProject: "Projekt löschen",
    readOnlyProject: "Projekt im Lesemodus",
  },
  status: {
    planning: "Planung",
    active: "Aktiv",
    completed: "Abgeschlossen",
  },
  role: {
    ORGANIZATION_ADMIN: "Organisationsadministration",
    PROJECT_MANAGER: "Projektleitung",
  },
  organizationCard: {
    eyebrow: "Organisation",
    noMission:
      "Fügen Sie eine kurze Mission hinzu, damit der Workspace leichter erkennbar ist.",
    members: "Mitglieder",
    projects: "Projekte",
    workspace: "Workspace",
    workspaceReady: "Bereit",
    readOnly: "Nur lesen",
  },
  organizationPage: {
    eyebrow: "Organisations-Workspace",
    adminTitle: "Organisations-Workspace",
    managerTitle: "Mein Workspace",
    adminDescription:
      "Behalten Sie die gesamte Organisation im Blick, respektieren Sie Projektverantwortung und führen Sie Ihr Team in den Evidenz-Workflow.",
    managerDescription:
      "Sie sind Teil dieser Organisation. Öffnen Sie Ihre Projekte oder erstellen Sie das nächste Projekt, das Sie betreuen möchten.",
    primaryAction: "Projekt erstellen",
    emptyTitle: "Noch keine Projekte",
    emptyDescription:
      "Projekte organisieren Nachweise über Aktivitäten, Uploads, Analysen und Erkenntnisse hinweg.",
    emptyAction: "Erstes Projekt erstellen",
    projectOverview: "Projektüberblick",
    myProjects: "Meine Projekte",
    recentActivity: "Letzte Aktivität",
    membersSummary: "Mitgliederübersicht",
    manageMembers: "Mitglieder verwalten",
    analyticsPlaceholder: "Organisationsanalysen",
    analyticsAdminDescription:
      "Hier werden organisationsweite Analysen und Erkenntnisse sichtbar, sobald mehr Evidenz vorliegt.",
    analyticsManagerDescription:
      "Nutzen Sie Ihre Projekte, um Evidenz aufzubauen. Organisationsweite Analysen bleiben für Admins sichtbar.",
    activitiesLabel: "Aktivitäten",
    noProjectDescription: "Noch keine Projektbeschreibung vorhanden.",
  },
  organizationSettings: {
    eyebrow: "Workspace-Einstellungen",
    title: "Organisationseinstellungen",
    description:
      "Verwalten Sie die Stammdaten Ihrer Organisation. Diese Informationen werden für Projekte, Analysen und zukünftige Förderberichte verwendet.",
    readOnlyNotice:
      "Sie können diese Angaben einsehen, aber nur die Organisationsadministration kann sie bearbeiten.",
    generalSection: "Allgemeine Informationen",
    generalDescription:
      "Erfassen Sie die grundlegenden Organisationsangaben, die Ihren Workspace eindeutig beschreiben.",
    organizationNameLabel: "Organisationsname",
    organizationNamePlaceholder: "PHINEO",
    legalFormLabel: "Rechtsform",
    legalFormPlaceholder: "Gemeinnützige Stiftung",
    foundingYearLabel: "Gründungsjahr",
    foundingYearPlaceholder: "2010",
    countryLabel: "Land",
    countryPlaceholder: "Deutschland",
    employeeCountLabel: "Mitarbeitendenanzahl",
    employeeCountPlaceholder: "25",
    missionSection: "Mission & Tätigkeitsbereich",
    missionDescription:
      "Beschreiben Sie wofür Ihre Organisation steht, in welchen Feldern sie arbeitet und wen sie erreicht.",
    missionLabel: "Mission",
    missionPlaceholder:
      "Beschreiben Sie kurz, wofür Ihre Organisation steht und wie Sie mit Evidenz arbeiten.",
    activityAreasLabel: "Tätigkeitsfelder",
    activityAreasPlaceholder: "Bildung\nDemokratie",
    targetGroupsLabel: "Zielgruppen",
    targetGroupsPlaceholder: "Jugendliche\nFamilien",
    operatingRegionsLabel: "Einsatzregionen",
    operatingRegionsPlaceholder: "Berlin\nBrandenburg",
    listFieldHint:
      "Mehrere Werte können zeilenweise oder kommagetrennt eingegeben werden.",
    nonProfitSection: "Gemeinnützigkeit",
    nonProfitDescription:
      "Hinterlegen Sie den aktuellen Gemeinnützigkeitsstatus Ihrer Organisation.",
    isRecognizedNonProfitLabel: "Gemeinnützig anerkannt?",
    nonProfitYes: "Ja",
    nonProfitNo: "Nein",
    nonProfitUnknown: "Nicht festgelegt",
    taxExemptionValidFromLabel: "Freistellungsbescheid gültig seit",
    logoLabel: "Organisationslogo",
    logoDescription:
      "PNG, JPG, JPEG oder WebP. Ziehen Sie eine Datei hierher oder wählen Sie sie vom Computer aus.",
    replaceLogo: "Anderes Logo wählen",
    selectedLogo: "Ausgewähltes Logo",
    summaryMissionLabel: "Mission",
    summaryActivityAreasLabel: "Tätigkeitsbereiche",
    summaryNonProfitLabel: "Gemeinnützigkeit",
    summaryNonProfitYes: "Gemeinnützig anerkannt",
    summaryNonProfitNo: "Nicht gemeinnützig",
    summaryNotProvided: "Noch nicht hinterlegt",
    optionalLabel: "optional",
    save: "Änderungen speichern",
    saving: "Speichert…",
    success: "Organisation wurde aktualisiert.",
    failure: "Organisation konnte nicht aktualisiert werden.",
    invalidFile: "Bitte laden Sie ein PNG-, JPG-, JPEG- oder WebP-Bild hoch.",
    dropzoneTitle: "Logo hierher ziehen",
    dropzoneAction: "Datei vom Computer auswählen",
    validationOrganizationName: "Bitte geben Sie einen Organisationsnamen ein.",
    validationFoundingYear:
      "Bitte geben Sie ein vierstelliges Gründungsjahr ein.",
    validationEmployeeCount:
      "Bitte geben Sie eine gültige Mitarbeitendenanzahl ein.",
    validationTaxExemptionValidFrom: "Bitte verwenden Sie ein gültiges Datum.",
  },
  organizationProjects: {
    eyebrow: "Projekte",
    title: "Projekte in diesem Workspace",
    description:
      "Öffnen Sie ein bestehendes Projekt oder erstellen Sie das nächste Projekt, das Sie betreuen möchten.",
    primaryAction: "Projekt erstellen",
    noDescription: "Noch keine Projektbeschreibung vorhanden.",
    activities: "Aktivitäten",
  },
  organizationActivities: {
    eyebrow: "Aktivitäten",
    title: "Aktivitäten über meine Projekte hinweg",
    description:
      "Öffnen Sie eine Ihrer Aktivitäten, um Nachweise hochzuladen oder Erkenntnisse weiterzuverfolgen.",
    noDescription: "Noch keine Aktivitätsbeschreibung vorhanden.",
    openActivity: "Aktivität öffnen",
  },
  members: {
    eyebrow: "Mitglieder",
    title: "Projektleitungen einladen und verwalten",
    description:
      "Laden Sie Projektleitungen ein, prüfen Sie die aktuelle Mitgliederliste und halten Sie Verantwortlichkeiten klar.",
    inviteTitle: "Team einladen",
    inviteDescription:
      "Erstellen Sie Einladungsdatensätze für Projektleitungen, damit sie beitreten und Projekte anlegen können.",
    emailPlaceholder: "team@organisation.de",
    projectManagerRole: "Projektleitung",
    organizationAdminRole: "Organisationsadministration",
    sendInvitation: "Einladung senden",
    inviting: "Einladung wird gesendet…",
    inviteSuccess: "Einladung wurde erstellt.",
    inviteFailure: "Einladung konnte nicht erstellt werden.",
    pendingInvitations: "Ausstehende Einladungen",
    pendingStatus: "Wartet auf Annahme",
    currentMembers: "Aktuelle Mitglieder",
    removeAction: "Entfernen",
    removeSuccess: "Mitglied wurde entfernt.",
    removeFailure: "Mitglied konnte nicht entfernt werden.",
  },
  organizationBilling: {
    eyebrow: "Abrechnung",
    title: "Abo und Abrechnung",
    description:
      "Abrechnung bleibt auf Organisationsebene, damit Projektverantwortung klar getrennt bleibt.",
    placeholder:
      "Das Abonnementmanagement kann später hier ergänzt werden, ohne das Projekt- und Aktivitätsmodell zu verändern.",
  },
  projectPage: {
    viewInsights: "Erkenntnisse anzeigen",
    activitiesTitle: "Aktivitäten",
    activitiesDescription:
      "Jede Aktivität besitzt ihre eigene Upload- und Job-Historie.",
    noActivitiesTitle: "Noch keine Aktivitäten",
    noActivitiesDescription:
      "Verwenden Sie das Plus neben Aktivitäten in der Seitenleiste, um die erste Aktivität anzulegen.",
    noActivityDescription: "Noch keine Aktivitätsbeschreibung vorhanden.",
    quickAction: "Aktivität hinzufügen",
    uploadsReady: "Bereit",
    lastUpdated: "Jetzt",
    privacyTitle: "Ihre Nachweise bleiben privat",
    privacyDescription:
      "Personenbezogene Merkmale bleiben außerhalb der KI-Ebene. Das Backend speichert bereits Uploads und simulierte Job-Fortschritte; die semantische Interpretation folgt später.",
  },
  projectSettings: {
    eyebrow: "Projekteinstellungen",
    title: "Projekteinstellungen",
    description:
      "Prüfen Sie die aktuelle Projektkonfiguration und verwalten Sie irreversible Aktionen mit besonderer Vorsicht.",
    general: "Projektdetails",
    generalDescription:
      "Diese Werte spiegeln die aktuell im Backend gespeicherten Projektmetadaten wider.",
    dangerTitle: "Projekt löschen",
    dangerDescription:
      "Beim Löschen eines Projekts werden alle verknüpften Aktivitäten, Uploads, Jobs, Prüfergebnisse, Analysen und Erkenntnisse dauerhaft entfernt.",
    deleteAction: "Projekt löschen",
    notSet: "Nicht gesetzt",
    fields: {
      status: "Status",
      organization: "Organisation",
      timeline: "Zeitraum",
      location: "Ort",
      funding: "Finanzierungsquelle",
      goal: "Programmziel",
      created: "Erstellt",
      updated: "Aktualisiert",
    },
  },
  projectDelete: {
    title: "Dieses Projekt löschen?",
    description:
      "Diese Aktion kann nicht rückgängig gemacht werden. Beim Löschen dieses Projekts werden dauerhaft entfernt:",
    confirmLabel: "Geben Sie zur Bestätigung den Projektnamen ein:",
    confirmAction: "Dauerhaft löschen",
    deleting: "Wird gelöscht…",
    success: "Projekt wurde erfolgreich gelöscht.",
    failure:
      "Das Projekt konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.",
    impacts: {
      activities: "alle Aktivitäten",
      datasets: "alle hochgeladenen Datensätze",
      jobs: "alle Verarbeitungsjobs",
      reviews: "alle Ergebnisse der Datenprüfung",
      analyses: "alle Analysen",
      insights: "alle Erkenntnisse",
    },
  },
  dialogs: {
    cancel: "Abbrechen",
    create: "Erstellen",
    createProjectTitle: "Projekt erstellen",
    createProjectDescription:
      "Erfassen Sie die zentralen Programminformationen für dieses Projekt.",
    createActivityTitle: "Aktivität hinzufügen",
    createActivityDescription:
      "Erfassen Sie die Umsetzungsdetails für eine Projektaktivität.",
    project: {
      submit: "Projekt erstellen",
      creating: "Projekt wird erstellt…",
      success: "Projekt wurde erstellt.",
      failure: "Projekt konnte nicht erstellt werden.",
      name: "Projektname",
      namePlaceholder: "Mentoring-Programm 2026",
      description: "Beschreibung",
      descriptionPlaceholder:
        "Ein sechsmonatiges Mentoring-Programm, das erfahrene Freiwillige mit jungen Erwachsenen zusammenbringt, um Selbstvertrauen, Beschäftigungsfähigkeit und soziale Teilhabe zu stärken.",
      programGoal: "Programmziel",
      programGoalPlaceholder:
        "Jugendliche durch langfristige Mentoring-Beziehungen besser in Arbeit bringen.",
      startMonth: "Startmonat / Jahr",
      endMonth: "Endmonat / Jahr",
      country: "Land",
      countryPlaceholder: "Deutschland",
      regionCity: "Region / Stadt",
      regionCityPlaceholder: "Berlin",
      organization: "Organisation",
      sdgs: "SDGs",
      targetBeneficiaries: "Zielgruppen",
      fundingSource: "Finanzierungsquelle",
      fundingSourcePlaceholder: "Erasmus+",
      status: "Status",
    },
    activity: {
      submit: "Aktivität erstellen",
      creating: "Aktivität wird erstellt…",
      success: "Aktivität wurde erstellt.",
      failure: "Aktivität konnte nicht erstellt werden.",
      name: "Aktivitätsname",
      namePlaceholder: "Schulung für Senior-Mentorinnen und -Mentoren",
      description: "Beschreibung",
      descriptionPlaceholder:
        "Zweitägige Schulung für freiwillige Mentorinnen und Mentoren.",
      activityType: "Aktivitätstyp",
      owner: "Verantwortliche Person",
      ownerPlaceholder: "Programmleitung",
      startDate: "Startdatum",
      endDate: "Enddatum",
      objectives: "Ziele",
      objectivesPlaceholder:
        "40 Mentorinnen und Mentoren auf sichere, konsistente Mentoring-Sitzungen vorbereiten.",
      expectedOutcomes: "Erwartete Ergebnisse",
      expectedOutcomesPlaceholder:
        "Mehr Sicherheit in der Mentoring-Rolle und stärkere Schutzkonzepte.",
      successIndicators: "Erfolgsindikatoren",
      successIndicatorsPlaceholder:
        "Teilnahme über 85 %, Safeguarding-Freigabe für alle Teilnehmenden.",
      targetAudience: "Zielpublikum",
      targetAudiencePlaceholder:
        "Zurückkehrende freiwillige Mentorinnen und Mentoren",
      beneficiaryGroup: "Begünstigtengruppe",
      beneficiaryGroupPlaceholder: "Jugendliche",
      status: "Status",
    },
    options: {
      sdgs: ["SDG 3", "SDG 4", "SDG 5", "SDG 10"],
      targetBeneficiaries: [
        "Jugendliche",
        "Senioren",
        "Geflüchtete",
        "Frauen",
        "Lehrkräfte",
      ],
      activityTypes: [
        "Mentoring-Sitzung",
        "Workshop",
        "Schulung",
        "Outreach",
        "Assessment",
        "Sonstiges",
      ],
    },
  },
  errorPage: {
    title: "Diese Seite konnte nicht geladen werden",
    description:
      "Auf unserer Seite ist ein Fehler aufgetreten. Versuchen Sie es erneut oder gehen Sie zurück zur Startseite.",
  },
};

export default de;
