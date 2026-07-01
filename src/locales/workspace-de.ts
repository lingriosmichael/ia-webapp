const workspaceDe = {
  sidebar: {
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
  },
  status: {
    planning: "Planung",
    active: "Aktiv",
    completed: "Abgeschlossen",
  },
  role: {
    owner: "Eigentümer",
    member: "Mitglied",
  },
  organizationPage: {
    eyebrow: "Organisations-Workspace",
    title: "Verwalten Sie Projekte in Ihrer Organisation",
    description:
      "Erstellen Sie hier Projekte und führen Sie Ihr Team direkt in den Evidenz-Workspace.",
    primaryAction: "Projekt erstellen",
    emptyTitle: "Noch keine Projekte",
    emptyDescription:
      "Verwenden Sie die Seitenleiste oder die Schaltfläche unten, um Ihr erstes Projekt zu erstellen.",
  },
  organizationSettings: {
    eyebrow: "Organisationseinstellungen",
    title: "Organisationsprofil",
    description:
      "Aktualisieren Sie Name, Beschreibung und Logo Ihrer Organisation. Nach dem Speichern erscheint die Änderung sofort in der Seitenleiste.",
    general: "Allgemein",
    generalDescription:
      "Pflegen Sie hier die sichtbare Identität Ihrer Organisation im Workspace.",
    nameLabel: "Organisationsname",
    namePlaceholder: "PHINEO",
    descriptionLabel: "Beschreibung",
    descriptionPlaceholder:
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
} as const;

export default workspaceDe;
