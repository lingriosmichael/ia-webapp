import type { WorkspaceTranslationDictionary } from "./workspaceEn";

const workspaceDe: WorkspaceTranslationDictionary = {
  sidebar: {
    workspace: "Workspace",
    projects: "Projekte",
    members: "Mitglieder",
    billing: "Abrechnung",
    organizationProfile: "Organisationsprofil",
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
    eyebrow: "Organisationseinstellungen",
    title: "Organisationsprofil",
    description:
      "Aktualisieren Sie Namen, Mission und Logo Ihrer Organisation. Nach dem Speichern erscheint die Änderung sofort in der Workspace-Karte.",
    settingsEyebrow: "Workspace-Einstellungen",
    settingsTitle: "Organisationseinstellungen",
    settingsDescription:
      "Halten Sie das Organisationsprofil getrennt von künftigen workspaceweiten Einstellungen.",
    settingsPlaceholder:
      "Weitere workspaceweite Einstellungen können später hier ergänzt werden, ohne das Organisationsprofil zu überladen.",
    general: "Allgemein",
    generalDescription:
      "Pflegen Sie hier die sichtbare Identität Ihrer Organisation im Workspace.",
    nameLabel: "Organisationsname",
    namePlaceholder: "PHINEO",
    missionLabel: "Mission",
    missionPlaceholder:
      "Beschreiben Sie kurz, wofür Ihre Organisation steht und wie Sie mit Evidenz arbeiten.",
    logoLabel: "Organisationslogo",
    logoDescription:
      "PNG, JPG, JPEG oder WebP. Ziehen Sie eine Datei hierher oder wählen Sie sie vom Computer aus.",
    previewLabel: "Vorschau",
    previewDescription:
      "Wenn noch kein Logo vorhanden ist, wird automatisch ein Avatar mit Initialen angezeigt.",
    chooseLogo: "Logo auswählen",
    replaceLogo: "Anderes Logo wählen",
    selectedLogo: "Ausgewähltes Logo",
    save: "Änderungen speichern",
    saving: "Speichert…",
    success: "Organisation wurde aktualisiert.",
    failure: "Organisation konnte nicht aktualisiert werden.",
    invalidFile: "Bitte laden Sie ein PNG-, JPG-, JPEG- oder WebP-Bild hoch.",
    dropzoneTitle: "Logo hierher ziehen",
    dropzoneAction: "Datei vom Computer auswählen",
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
};

export default workspaceDe;
