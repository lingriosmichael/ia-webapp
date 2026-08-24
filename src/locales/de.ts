import type { TranslationDictionary } from "./en";

const de: TranslationDictionary = {
  language: {
    switcherLabel: "Sprache",
    german: "DE",
    english: "EN",
  },
  common: {
    brand: "brindl",
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
    required: "Erforderlich",
    back: "Zurück",
    continue: "Weiter",
    close: "Schließen",
    notFoundTitle: "Seite nicht gefunden",
    notFoundDescription:
      "Die angeforderte Seite existiert nicht oder ist nicht mehr verfügbar.",
    backToHome: "Zur Startseite",
  },
  landing: {
    createWorkspace: "Workspace erstellen",
    header: {
      navHowItWorks: "So funktioniert's",
      navFaq: "FAQ",
      navAboutUs: "Über uns",
    },
    hero: {
      pilotBadge: "Pilotphase ab August 2026",
      freeBadge: "Kostenfreie Teilnahme",
      titleLine1: "Weniger Zeit für Förderberichte.",
      titleLine2: "Mehr Klarheit über ",
      titleHighlight: "Ihre Wirkung.",
      description:
        "brindl bringt Projektdaten, Nachweise und Wirkungsinformationen an einem Ort zusammen. So erstellt Ihr Team Berichte schneller und erkennt leichter, was Ihre Arbeit bewirkt.",
      ctaPrimary: "Pilotprogramm ansehen",
      ctaSecondary: "15-minütigen Gespräch vereinbaren",
      mockupAlt:
        "brindl Dashboard-Vorschau mit der Übersicht eines Mentoring-Programms, seinen jüngsten Aktivitäten und einem Wirkungs-Insights-Panel mit einem Beziehungskapital-Wert von 79%.",
    },
    problem: {
      title: "Kommt Ihnen das bekannt vor?",
      items: [
        {
          title: "Informationen verstreut",
          description:
            "Projektdaten, Nachweise und Dokumente liegen in verschiedenen Dateisystemen/Ordnern, wie Excel, Word, PDF, Emails etc.",
        },
        {
          title: "Berichte dauern zu lange",
          description:
            "Zu viel Zeit für Datensammlung, Formatierung und Rückfragen – oft nur, um festzuhalten, was wirklich wichtige Arbeit ist.",
        },
        {
          title: "Unklare Wirkung",
          description:
            "Es ist schwer zu erkennen, was Ihre Arbeit bewirkt und welche Ergebnisse wirklich einen Unterschied machen.",
        },
      ],
    },
    howItWorks: {
      title: "So hilft brindl",
      steps: [
        {
          title: "An einem Ort sammeln",
          description:
            "Projektdaten und Nachweise werden an einem Ort gesammelt und strukturiert.",
        },
        {
          title: "Verstehen",
          description:
            "Daten verstehen und auswerten. Wirkungen werden sichtbar gemacht und mit klaren Kennzahlen und Insights versehen.",
        },
        {
          title: "Berichten",
          description:
            "Berichte erstellen und teilen. Schnell, fundiert und präzise – auf die Bedürfnisse Ihrer Förderer abgestimmt.",
        },
      ],
    },
    trustBar: {
      statement:
        "brindl ist nach DSGVO-Grundsätzen konzipiert. Wir reduzieren direkte personenbezogene Identifikatoren vor der KI-Verarbeitung, nutzen kontrollierte AWS-Infrastruktur, verwenden Kundendaten nicht zum Training allgemeiner KI-Modelle und löschen Kundendaten, wenn der Service endet.",
    },
    pilotProgram: {
      title: "Unser Pilotprogramm",
      whatYouGet: {
        title: "Das erhalten Sie",
        items: [
          "Zugang zu brindl während der Pilotphase 2026",
          "Persönliches Onboarding und Erklärung (Bei Bedarf)",
          "Regelmäßiger Austausch & Feedbackrunden",
        ],
      },
      whatYouBring: {
        title: "Das bringen Sie mit",
        items: [
          "Ein bestehendes Projekt/Programm",
          "Bereits vorhandene Ergebnisse und Nachweise",
          "Bereitschaft zur Zusammenarbeit und zum Austausch von Feedback",
        ],
      },
      goodToKnow: {
        title: "Wichtig zu wissen",
        items: [
          "Kostenfreie Teilnahme",
          "Laufzeit: August – September 2026",
          "Plätze sind begrenzt",
        ],
      },
      afterPilot: {
        title: "Nach dem Pilot",
        items: [
          "Sie erhalten eine Auswertung mit Insights",
          "Gemeinsames Feedback zur Optimierung",
          "Zugang zu brindl zu Sonderkonditionen",
          "Sie teilen uns in einem kurzen Gespräch mit, wie nutzerfreundlich brindl ist und was noch fehlt.",
        ],
      },
    },
    cta: {
      titleBefore: "Bereit für ",
      titleHighlight1: "weniger Aufwand",
      titleMiddle: " und ",
      titleHighlight2: "mehr Wirkung",
      titleAfter: "?",
      description:
        "Vereinbaren Sie jetzt ein unverbindliches Gespräch. Wir zeigen Ihnen, wie brindl Ihr Team entlastet und Ihre Wirkung sichtbar macht.",
      primary: "Gespräch anfragen",
    },
    faq: {
      title: "Häufige Fragen",
      items: [
        {
          question: "Wie viel Aufwand bedeutet die Teilnahme am Pilotprogramm?",
          answer:
            "Rechnen Sie während des Pilotprogramms mit durchschnittlich zwei bis drei Stunden pro Monat. Der größte Teil des Aufwands entsteht zu Beginn: In einem persönlichen Onboarding richten wir gemeinsam Ihr Projekt ein, klären Ihre Berichtsanforderungen und besprechen, welche vorhandenen Daten und Nachweise Sie nutzen möchten.\n\nAnschließend laden Sie bestehende Projektunterlagen hoch und prüfen die von brindl aufbereiteten Informationen. Zusätzliche Zeit benötigen wir vor allem für kurze Feedbackgespräche, damit wir verstehen, was für Ihren Arbeitsalltag hilfreich ist und wo die Plattform noch verbessert werden sollte.\n\nSie müssen dafür keine neue Monitoring-Struktur aufbauen und keine zusätzliche Datenerhebung starten. Das Pilotprogramm soll sich möglichst gut in Ihre bestehenden Abläufe integrieren, nicht neue Bürokratie schaffen. Im ersten Monat kann der Aufwand durch das Onboarding etwas höher sein; danach konzentriert sich die Teilnahme vor allem auf Nutzung, Prüfung und Feedback.",
        },
        {
          question: "Welche Daten können wir mit brindl nutzen?",
          answer:
            "brindl ist dafür gedacht, mit den Daten und Nachweisen zu arbeiten, die in Ihrem Projekt bereits vorhanden sind. Dazu können beispielsweise gehören:\n\n• Excel- und CSV-Dateien mit Indikatoren, Teilnehmendenzahlen oder Aktivitäten\n• Word-Dokumente und PDF-Berichte\n• Sach- und Zwischenberichte\n• Anwesenheitslisten und Veranstaltungsübersichten\n• Exporte aus Umfrage- oder Datenerhebungstools\n• Protokolle, Gesprächsnotizen und qualitative Rückmeldungen\n• Projektkonzepte, Wirkungslogiken und Förderunterlagen\n• Nachweise zu durchgeführten Aktivitäten und erzielten Ergebnissen\n\nDie Dateien müssen nicht perfekt aufbereitet sein. Ein Ziel von brindl ist es gerade, Informationen aus unterschiedlichen Dokumenten und Tabellen zusammenzuführen und übersichtlicher nutzbar zu machen.\n\nIm Onboarding besprechen wir gemeinsam, welche Unterlagen für Ihren Anwendungsfall sinnvoll sind. Dabei gilt: Es sollten nur Daten hochgeladen werden, die für die Auswertung tatsächlich benötigt werden. Besonders schützenswerte oder unnötige personenbezogene Daten sollten nach Möglichkeit vorher entfernt oder pseudonymisiert werden. Falls Ihr Anwendungsfall personenbezogene Daten erfordert, klären wir vorab, wie damit datenschutzkonform umgegangen werden kann.",
        },
        {
          question:
            "Wie nutzt brindl künstliche Intelligenz und wie werden personenbezogene Daten geschützt?",
          answer:
            "brindl nutzt KI, um Informationen aus hochgeladenen Projektunterlagen zu strukturieren, zusammenzufassen und in einen verständlichen Zusammenhang zu bringen. Die KI kann beispielsweise relevante Inhalte erkennen, Nachweise verschiedenen Aktivitäten zuordnen, Entwicklungen beschreiben und auf fehlende oder widersprüchliche Informationen hinweisen.\n\nDer Schutz personenbezogener Daten beginnt, bevor Inhalte an das KI-Modell übermittelt werden. Ein integrierter PII-Scanner erkennt direkte Identifikatoren – derzeit insbesondere Personennamen – und ersetzt sie durch pseudonyme Platzhalter. Dadurch erhält das Modell beispielsweise nicht den Namen „Maria Mustermann“, sondern eine neutrale Kennzeichnung wie „Person 01“. Diese Pseudonymisierung reduziert das Risiko, ersetzt aber nicht alle weiteren Datenschutzmaßnahmen.\n\nOrganisationen sollten deshalb nur die für den jeweiligen Zweck erforderlichen Daten hochladen und besonders sensible oder nicht benötigte Angaben möglichst bereits vor dem Upload entfernen. Pseudonymisierte Informationen gelten rechtlich nicht automatisch als anonym und können weiterhin unter die DSGVO fallen.\n\nDie KI-Verarbeitung erfolgt über Amazon Bedrock. Nach Angaben von AWS haben die Anbieter der dort bereitgestellten Basismodelle keinen Zugriff auf Kundenprompts oder die generierten Antworten. AWS erklärt außerdem, dass Ein- und Ausgaben nicht zum Training der Basismodelle verwendet werden.\n\nbrindl verwendet KI als unterstützendes Werkzeug. Die Ergebnisse sollten durch die Nutzer:innen geprüft werden und ersetzen keine fachliche oder rechtliche Bewertung.",
        },
        {
          question: "Ist meine Organisation rechtlich gebunden?",
          answer:
            "Die Teilnahme am Pilotprogramm verpflichtet Ihre Organisation nicht dazu, brindl anschließend kostenpflichtig weiterzunutzen. Es gibt keine automatische Verlängerung in ein kostenpflichtiges Abonnement und keine spätere Kaufverpflichtung.\n\nFür die Pilotphase vereinbaren wir lediglich die Rahmenbedingungen der Zusammenarbeit. Dazu gehören beispielsweise die Laufzeit des Piloten, der Umgang mit Daten, Zuständigkeiten und die Möglichkeit, Feedback zur Plattform zu geben. Ihre Organisation behält die Kontrolle über ihre eigenen Projektinformationen und entscheidet selbst, welche Daten für den Pilot genutzt werden.\n\nSollten Sie das Pilotprogramm vorzeitig beenden wollen, besprechen wir gemeinsam das weitere Vorgehen und den Umgang mit den bis dahin hochgeladenen Daten. Eine spätere Nutzung von brindl wird nur dann vereinbart, wenn beide Seiten dies ausdrücklich wünschen.",
        },
        {
          question: "Wie aufwendig ist die Einrichtung?",
          answer:
            "Für die Einrichtung benötigen Sie keine eigene IT-Abteilung und müssen keine neue Software in Ihrer Organisation installieren. brindl wird über den Browser genutzt.\n\nZu Beginn führen wir ein persönliches Onboarding durch. Dabei richten wir gemeinsam Ihr erstes Projekt ein und besprechen unter anderem:\n\n• Welche Ziele und Aktivitäten umfasst das Projekt?\n• Welche Indikatoren oder Berichtspflichten sind relevant?\n• Welche Daten und Nachweise liegen bereits vor?\n• Wer soll innerhalb Ihrer Organisation mit brindl arbeiten?\n• Welche Auswertungen oder Berichtsfragen sind für Sie besonders wichtig?\n\nDanach können Sie bestehende Dateien direkt dem jeweiligen Projekt oder den passenden Aktivitäten zuordnen. Sie müssen Ihre bisherigen Ablagen nicht vollständig migrieren und auch keine neue Datenstruktur entwickeln, bevor Sie beginnen können.\n\nWährend der Pilotphase unterstützen wir Sie persönlich bei Fragen zur Einrichtung, zur Auswahl geeigneter Unterlagen und zur Nutzung der Ergebnisse. Das Ziel ist, möglichst schnell mit einem realen Projekt und Ihren bestehenden Daten arbeiten zu können.",
        },
        {
          question:
            "Was passiert mit unseren Daten, wenn wir brindl nach dem Pilot nicht weiter nutzen?",
          answer:
            "Sie entscheiden nach Abschluss des Pilotprogramms selbst, ob Sie brindl weiterhin nutzen möchten. Es gibt keine automatische Verlängerung und keine Verpflichtung, ein kostenpflichtiges Angebot abzuschließen.\n\nEntscheiden Sie sich gegen eine weitere Nutzung, wird Ihr Zugang beendet und alle von Ihrer Organisation hochgeladenen Daten werden gelöscht. Das gilt auch für Informationen und Ergebnisse, die brindl auf Grundlage dieser Daten erstellt hat.\n\nIhre Daten bleiben zu jeder Zeit Ihre Daten. brindl verkauft sie nicht, gibt sie nicht an andere Organisationen weiter und verwendet sie nicht ohne Ihre Zustimmung für andere Zwecke. Vor der Löschung können Sie die für Sie relevanten Ergebnisse exportieren, sofern diese Exportmöglichkeit Teil des Pilotumfangs ist.",
        },
      ],
    },
    footer: {
      tagline: "Weniger Aufwand. Mehr Wirkung.",
      impressum: "Impressum",
      datenschutz: "Datenschutz",
      agb: "AGB",
      rights: "brindl. Alle Rechte vorbehalten.",
    },
  },
  legal: {
    impressum: {
      title: "Impressum",
      placeholder: "Platzhalter – Impressum-Inhalt wird noch ergänzt.",
    },
    datenschutz: {
      title: "Datenschutz",
      placeholder: "Platzhalter – Datenschutzinhalt wird noch ergänzt.",
    },
    agb: {
      title: "AGB",
      placeholder: "Platzhalter – AGB-Inhalt wird noch ergänzt.",
    },
    ueberUns: {
      title: "Über uns",
      placeholder: "Platzhalter – Inhalt zu „Über uns“ wird noch ergänzt.",
    },
  },
  auth: {
    loginMarketingTitle:
      "Aus vorhandenen Projektdaten belastbare Wirkungsnachweise erstellen.",
    loginMarketingDescription:
      "brindl strukturiert Ihre Unterlagen, macht vorhandene Nachweise sichtbar und zeigt, welche Informationen für eine fundierte Wirkungsdarstellung noch fehlen.",
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
      "Verwenden Sie den Organisationsnamen genau so, wie Ihr Team ihn in brindl sehen soll.",
    workspaceCreatedToast: "Workspace wurde erstellt.",
    workspaceCreateFailed: "Workspace konnte nicht erstellt werden.",
    welcomeTitle: "Willkommen bei brindl.",
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
  project: {
    loading: "Projekt wird geladen…",
    loadFailed: "Projekt konnte nicht geladen werden.",
    crumbsOrganization: "Organisation",
    sidebarProject: "Projekt",
    sidebarOverview: "Übersicht",
    sidebarAnalytics: "Analysen",
    sidebarInsights: "AI knowledge",
    sidebarActivities: "Aktivitäten",
    sidebarBrief: "Aktivitätsübersicht",
    sidebarUpload: "Hochladen",
    viewInsights: "AI knowledge öffnen",
    eyebrow: "Projekt",
    noDescription: "Noch kein Projektziel hinterlegt.",
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
      insightsGenerated: "AI knowledge bereit",
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
          "Evidenz wurde hochgeladen und AI knowledge ist bereits verfügbar.",
        progress:
          "Die ersten Nachweise sind da und die KI-Verarbeitung läuft noch.",
        attention:
          "Dieses Projekt braucht noch Uploads oder Prüfung, bevor AI knowledge bereitsteht.",
      },
      completenessValue: "{{withEvidence}}/{{total}} Aktivitäten",
      completenessDelta: "{{percent}} % haben bereits Evidenz",
      insightsDelta: "{{count}} ausstehend",
      insightsReadyDelta: "Bereit zum Öffnen",
      noInsightsDelta: "Noch kein AI knowledge bereit",
      noUploadValue: "Noch keiner",
      noUploadDelta: "Laden Sie Evidenz hoch, um die Pipeline zu starten",
      attentionItems: {
        noEvidence: "Es wurde noch keine Evidenz hochgeladen.",
        partialEvidence:
          "{{count}} Aktivitäten benötigen noch Evidenz-Uploads.",
        pendingInsights: "{{count}} AI knowledge Läufe sind noch in Arbeit.",
        failedJobs: "{{count}} Verarbeitungsjobs benötigen Aufmerksamkeit.",
        healthy:
          "Jede Aktivität hat Evidenz, und derzeit gibt es keine offenen Probleme.",
      },
      recentActivityTypes: {
        activity_created: "Aktivität erstellt",
        dataset_uploaded: "Datensatz hochgeladen",
        job_completed: "Verarbeitung abgeschlossen",
        job_failed: "Verarbeitung benötigt Prüfung",
        insight_generated: "AI knowledge erzeugt",
      },
      recentActivityActivitySuffix: "für {{name}}",
    },
    emptyStateTitle: "Noch keine Aktivitäten",
    emptyStateDescription:
      "Aktivitäten sind Workshops, Trainings, Mentoring-Sessions oder andere Maßnahmen, zu denen Sie Evidenz hochladen.",
    emptyStateSupporting:
      "Legen Sie die erste Aktivität an, um Uploads, Analysen und AI knowledge pro Maßnahme getrennt zu verwalten.",
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
  projectWorkspace: {
    noDescription: "Es wurde noch keine Projektzusammenfassung hinterlegt.",
    tabs: {
      overview: "Übersicht",
      activities: "Aktivitäten",
      evidence: "Evidenz",
      interpretation: "Interpretation",
      analytics: "Analysen",
      outcomeStatements: "Wirkungsaussagen",
      comingSoon: "Bald",
    },
    overview: {
      title: "Übersicht",
      description:
        "Prüfen Sie das vollständige Projektprofil, das Wirkungsmodell und den Berichtskontext. Bearbeiten Sie hier bei Bedarf die Programmdetails.",
    },
    activities: {
      title: "Aktivitäten",
      description:
        "Planen und verwalten Sie die Maßnahmen, an die Evidenz, Auswertung und Berichterstattung in diesem Projekt gebunden sind.",
      emptyTitle: "Noch keine Aktivitäten",
      emptyDescription:
        "Aktivitäten sind Workshops, Mentoring-Sessions, Trainings oder andere Maßnahmen, zu denen Evidenz gesammelt wird.",
      emptyAction: "Erste Aktivität erstellen",
      noDescription: "Noch keine Aktivitätsbeschreibung vorhanden.",
      noDate: "Noch kein Datum festgelegt",
      evidenceCount: "{{count}} Evidenzdateien",
      uploadCount: "{{count}} Uploads",
      insightCount: "{{count}} Erkenntnisse",
      openActivity: "Aktivität öffnen",
      editActivity: "Bearbeiten",
      deleteActivity: "Löschen",
      deleteSuccess: "Aktivität gelöscht.",
      deleteFailure: "Aktivität konnte nicht gelöscht werden.",
    },
    evidence: {
      title: "Evidenz",
      description:
        "Verwalten Sie hochgeladene Dateien nach Aktivität. Evidenz bleibt immer der Maßnahme zugeordnet, zu der sie gehört.",
      emptyTitle: "Noch keine Aktivitäten für Evidenz vorhanden",
      emptyDescription:
        "Legen Sie zuerst eine Aktivität an. Jeder Evidenz-Upload in brindl gehört zu einer konkreten Aktivität.",
      openActivity: "Aktivität öffnen",
      uploadAction: "Evidenz hochladen",
      uploading: "{{name}} wird hochgeladen…",
      loading: "Evidenz wird geladen…",
      noFiles: "Für diese Aktivität wurde noch keine Evidenz hochgeladen.",
      openFile: "Datei öffnen",
      analyzeFile: "Datenschutz prüfen",
      prepareWorkbookFile: "Excel-Datei vorbereiten",
      retryAnalysis: "Analyse erneut starten",
      restartStuckAnalysis: "Verarbeitung neu starten",
      reviewPrivacy: "Datenschutz prüfen",
      viewPrivacyReview: "Prüfung ansehen",
      approvePrivacy: "Freigeben und fortfahren",
      approvingPrivacy: "Freigabe läuft…",
      analysisInProgress: "Verarbeitung läuft…",
      analysisCompleted: "Verarbeitung abgeschlossen",
      reviewedStatus: "Geprüft",
      analysisStarted: "Evidenzanalyse wurde gestartet.",
      analysisRestarted: "Evidenzanalyse wurde neu gestartet.",
      analysisStartFailed: "Evidenzanalyse konnte nicht gestartet werden.",
      analysisRestartFailed:
        "Evidenzanalyse konnte nicht neu gestartet werden.",
      privacyApprovalSuccess: "Datenschutzprüfung wurde freigegeben.",
      privacyApprovalFailed:
        "Datenschutzprüfung konnte nicht freigegeben werden.",
      privacyReviewTitle: "Datenschutzprüfung",
      privacyReviewDescription:
        "Bestätigen Sie, wie erkannte Namen und Adressen behandelt werden sollen, bevor brindl mit der datenschutzsicheren Repräsentation fortfährt.",
      compactPrivacyApprovalTitle:
        "Keine manuelle Datenschutzprüfung erforderlich",
      compactPrivacyApprovalDescription:
        "Für diese Datei ist keine manuelle Transformationsauswahl notwendig. Sie können die Datei jetzt freigeben und die Verarbeitung fortsetzen.",
      compactPrivacyApprovalClose: "Schließen",
      compactPrivacyApprovalContinue: "Fortfahren",
      loadingPrivacyReview: "Datenschutzprüfung wird geladen…",
      noPrivacyFindings: "Es liegen noch keine Datenschutzbefunde vor.",
      privacyFindingSummary:
        "{{entityType}} wurde {{count}}-mal erkannt. Empfohlene Aktion: {{action}}.",
      analysisDialogAnalyzingTitle: "Ihre Datei wird analysiert…",
      analysisDialogAnalyzingDescription:
        "brindl liest die Datei ein und prüft auf Namen und Adressen. Sie können dieses Fenster schließen und weiterarbeiten — die Analyse läuft im Hintergrund weiter.",
      analysisDialogReadyTitle: "Bereit zur Datenschutzprüfung",
      analysisDialogReadyDescription:
        "brindl hat die Analyse dieser Datei abgeschlossen. Prüfen Sie die erkannten Befunde, bevor es weitergeht.",
      analysisDialogFailedTitle: "Analyse fehlgeschlagen",
      analysisDialogFailedFallback:
        "Die Datei konnte aufgrund eines unerwarteten Fehlers nicht analysiert werden.",
      reviewFile: "Datei",
      reviewActivity: "Aktivität",
      reviewStatus: "Prüfstatus",
      reviewStates: {
        pending: "Ausstehend",
        approved: "Freigegeben",
        rejected: "Abgelehnt",
      },
      reviewUnknownFile: "Unbekannte Datei",
      reviewUnknownActivity: "Unbekannte Aktivität",
      detectedFindingsTitle: "Erkannte Befunde",
      detectedFindingsDescription:
        "{{count}} Befunde erkannt. Für {{decisions}} Eintrag(e) ist noch eine explizite Transformationsauswahl erforderlich.",
      decisionRequired: "Entscheidung erforderlich",
      gdprNoticeIntro:
        "Wir haben in diesem Datensatz Namen oder Adressen gefunden. Wählen Sie für jeden Punkt unten, wie brindl diese Daten transformieren soll, bevor der Datensatz datenschutzsicher weiterverarbeitet wird.",
      recommendationSentence:
        "Wir empfehlen, dass brindl diese {{entityType}}-Daten {{verb}}, bevor der Datensatz weiterverwendet wird.",
      recommendationSentenceWithExample:
        "Wir empfehlen, dass brindl diese {{entityType}}-Daten {{verb}}, bevor der Datensatz weiterverwendet wird. Beispielwert: „{{example}}“.",
      recommendationVerbKeep: "beibehält",
      recommendationVerbTokenize:
        "durch ein stabiles pseudonymes Kürzel ersetzt",
      recommendationVerbGeneralize:
        "auf einen breiteren, nicht spezifischen Wert verallgemeinert",
      recommendationVerbRemove: "entfernen",
      recommendationVerbRestrict:
        "an den sensiblen Stellen bereinigt oder schwärzt",
      recommendedActionBadge: "Empfohlen",
      keepOverrideWarning:
        "brindl würde diese Daten unverändert beibehalten. Wenn Sie die Tokenisierung ablehnen, müssen Sie bestätigen, dass Sie sich dieser Entscheidung bewusst sind und den Nutzungsbedingungen zustimmen.",
      keepUnchangedAcknowledgementLabel:
        "Ich lehne die empfohlene Tokenisierung bewusst ab und bestätige, dass ich für diese Entscheidung verantwortlich bin und die Nutzungsbedingungen von brindl akzeptiere.",
      keepUnchangedAcknowledgementRequired:
        "Bestätigen Sie diese Warnung, wenn Sie die Daten unverändert beibehalten möchten.",
      overrideFindingWarning:
        "Sie haben eine andere Transformation als empfohlen gewählt. Begründen Sie, warum diese Abweichung angemessen ist.",
      overrideReasonLabel: "Begründung für diese Abweichung (erforderlich)",
      overrideReasonPlaceholder:
        "Erklären Sie, warum diese alternative Transformation passend ist, z. B. „diese PERSON-Übereinstimmung ist ein Projektname, keine reale Person.“",
      overrideReasonTooShort:
        "Bitte geben Sie eine ausführlichere Begründung an (mindestens 10 Zeichen).",
      reviewDecisionsIncomplete:
        "Wählen Sie für jeden markierten Befund oben eine Transformation, bevor Sie fortfahren.",
      reviewApprovalLocked:
        "Die Freigabe ist nur möglich, solange der Job auf die Datenschutzprüfung wartet.",
      transformation: {
        keep: "Beibehalten",
        tokenize: "Tokenisieren",
        generalize: "Verallgemeinern",
        remove: "Entfernen",
        restrict: "Schwärzen",
      },
      reviewUnavailableTitle: "Datenschutzprüfung nicht verfügbar",
      reviewUnavailableDescription:
        "Dieser Verarbeitungsjob konnte nicht geladen werden oder steht nicht mehr zur Prüfung bereit.",
      reviewCompletedTitle: "Datenschutzprüfung abgeschlossen",
      reviewCompletedDescription:
        "Diese Datei wurde bereits freigegeben und in eine datenschutzsichere Repräsentation überführt.",
      reviewTransformingTitle:
        "Datenschutzsichere Repräsentation in Erstellung",
      reviewTransformingDescription:
        "Die Datenschutzprüfung wurde freigegeben. brindl erstellt gerade die datenschutzsichere Repräsentation.",
      parsedRepresentationTitle: "Geparste Repräsentation",
      parsedRepresentationDescription:
        "Prüfen Sie die deterministische Struktur, die aus der hochgeladenen Datei extrahiert wurde. Diese Vorschau zeigt keine rohen personenbezogenen Werte oder Absatztexte.",
      noParsedRepresentation:
        "Für diese Prüfung liegt noch keine geparste Repräsentation vor.",
      parsedFileType: "Geparster Dateityp",
      parsedTableCount: "Tabellen",
      parsedParagraphCount: "Absätze",
      parsedSourceType: "Dateiendung",
      parsedTableFallback: "Tabelle {{index}}",
      parsedRowCount: "Zeilen",
      parsedColumnCount: "Spalten",
      parsedColumnsLabel: "Spalten",
      parsedParagraphSummaryTitle: "Absatzstruktur",
      parsedParagraphLabel: "Absatz {{index}}",
      parsedCharacterCount: "Zeichen",
      parsedPageLabel: "Seite",
      parsedNone: "Keine",
      analysisStatus: "Analyse",
      notStarted: "Noch nicht gestartet",
      analysisStates: {
        queued: "In Warteschlange",
        processing: "Wird verarbeitet",
        awaiting_privacy_review: "Wartet auf Datenschutzprüfung",
        transforming: "Datenschutzsichere Repräsentation wird erstellt",
        completed: "Verarbeitung abgeschlossen",
        failed: "Fehlgeschlagen",
        cancelled: "Abgebrochen",
      },
      removeFile: "Entfernen",
      removeSuccess: "Evidenz entfernt.",
      removeFailed: "Evidenz konnte nicht entfernt werden.",
      openFailed: "{{name}} konnte nicht geöffnet werden.",
      metadataType: "Typ",
      metadataSize: "Größe",
      metadataUploadedAt: "Hochgeladen am",
      metadataUploadedBy: "Hochgeladen von",
      metadataStatus: "Status",
      unknownType: "Unbekannter Typ",
      unknownSize: "Unbekannte Größe",
      unknownUploader: "Unbekannter Nutzer",
    },
    interpretation: {
      understoodEmpty:
        "Noch keine Interpretationsergebnisse. Starten Sie „Mit KI interpretieren“ für die Evidenz einer Aktivität, sobald deren Datenschutzprüfung genehmigt ist.",
      questionDomainPreparationLabel: "Vorbereitung",
      questionDomainInterpretationLabel: "Interpretation",
      questionRequiredLabel: "Für die Prüfung erforderlich",
      questionOptionalLabel: "Optional",
      questionRecommended: "Empfohlen",
      questionUseRecommendation: "Vorschlag übernehmen",
      questionFreeTextPlaceholder: "Antwort eingeben…",
      questionSelectAllOptions: "Alle Optionen auswählen",
      questionSubmit: "Absenden",
      questionSubmitting: "Wird gesendet…",
      questionScaleBoundsCustom: "Benutzerdefiniert",
      questionScaleBoundsTo: "bis",
      questionScaleBoundsMinPlaceholder: "Min",
      questionScaleBoundsMaxPlaceholder: "Max",
      questionScaleBoundsHint:
        "Die beobachteten Antworten belegen nicht den vollständigen Wertebereich der Skala — wir benötigen den offiziellen Bereich, um Baseline und Wirkungsmessung sicher zu vergleichen.",
      questionGroupBadge: "Gleiches Instrument, zwei Zeitpunkte",
      questionGroupSubtitle: "Einmal für beide Spalten bestätigen",
      questionGroupExplanation:
        "Diese Spalten sehen wie dasselbe Befragungsinstrument zu zwei unterschiedlichen Zeitpunkten aus. Bestätigen Sie die Angaben einmal, sie gelten dann für beide.",
      questionGroupRejectAction:
        "Das ist nicht dasselbe Instrument — getrennt beantworten",
      reviewPrivacyAction: "Datenschutz prüfen",
      reviewQualitativeCodingAction: "Codierung prüfen",
      reviewFile: "Datei",
      reviewActivity: "Aktivität",
      loadingQualitativeReview: "Qualitative Codierungsprüfung wird geladen…",
      qualitativeReviewTitle: "Qualitative Codierungsprüfung",
      qualitativeReviewDescription:
        "Prüfen Sie die vorgeschlagenen Codierungs-Overlays für Freitext-Evidenz, bevor die Aktivitätsanalyse fortgesetzt werden kann.",
      qualitativeReviewApprove: "Codierungsprüfung freigeben",
      qualitativeReviewApproving: "Wird freigegeben…",
      qualitativeReviewApproveSuccess:
        "Die qualitative Codierungsprüfung wurde freigegeben.",
      qualitativeReviewApproveFailed:
        "Die qualitative Codierungsprüfung konnte nicht freigegeben werden.",
      qualitativeReviewGenerateFailed:
        "Die qualitative Codierungsprüfung konnte nicht erzeugt werden.",
      qualitativeReviewUnavailableTitle:
        "Qualitative Codierungsprüfung nicht verfügbar",
      qualitativeReviewUnavailableDescription:
        "Die vorgeschlagene Codierungsprüfung konnte gerade nicht geladen werden.",
      qualitativeReviewNoFindingsTitle: "Keine Codierungsvorschläge erzeugt",
      qualitativeReviewNoFindingsDescription:
        "Für diese Datei wurden keine vorgeschlagenen Codierungsbefunde zurückgegeben.",
      qualitativeReviewFindings: "Vorgeschlagene Codierungsbefunde",
      qualitativeReviewFindingMeta:
        "{{rows}} Zeilen · {{codedRows}} codierte Zeilen · synthetische Spalte: {{syntheticColumnName}}",
      qualitativeReviewCodebook: "Quell-Codebuch: {{fileName}}",
      qualitativeReviewExcerpts: "Beispielauszüge",
      qualitativeReviewDecisionApprove: "Wie vorgeschlagen freigeben",
      qualitativeReviewDecisionReject: "Vorerst ablehnen",
      noEvidenceYet: "Noch keine Evidenz hochgeladen.",
      simplified: {
        pageTitle: "Zielprüfung",
        heroTitle: "Eine Zielprüfung pro Aktivität",
        heroDescription:
          "brindl prüft, ob die definierten Aktivitätsziele durch die aktuelle Evidenz belegt sind. Vorher wird die Evidenz datenschutzsicher vorbereitet und interpretiert.",
        statActivities: "Aktivitäten",
        statReady: "Zielprüfung bereit",
        statAttention: "Braucht Aufmerksamkeit",
        activitiesTitle: "Aktivitäten",
        activitySummary: {
          privacyReview:
            "Für diese Aktivität wartet noch {{count}} Datei auf Datenschutzprüfung.",
          privacyReview_other:
            "Für diese Aktivität warten noch {{count}} Dateien auf Datenschutzprüfung.",
          qualitativeReview:
            "Für diese Aktivität braucht noch {{count}} Datei die Freigabe der qualitativen Codierungsprüfung.",
          qualitativeReview_other:
            "Für diese Aktivität brauchen noch {{count}} Dateien die Freigabe der qualitativen Codierungsprüfung.",
          processing: "Die Evidenz dieser Aktivität wird gerade interpretiert.",
          questions:
            "{{count}} Klärungsfrage ist noch offen, bevor die Aktivitätsanalyse geöffnet werden kann.",
          questions_other:
            "{{count}} Klärungsfragen sind noch offen, bevor die Aktivitätsanalyse geöffnet werden kann.",
          partial:
            "{{interpreted}} Datei ist bereits interpretiert. {{remaining}} weitere Datei fehlt noch oder benötigt Aufmerksamkeit, bevor die Aktivitätsanalyse geöffnet werden kann.",
          partial_other:
            "{{interpreted}} Dateien sind bereits interpretiert. {{remaining}} weitere Dateien fehlen noch oder benötigen Aufmerksamkeit, bevor die Aktivitätsanalyse geöffnet werden kann.",
          goalReview:
            "Für diese Aktivität liegt ein vorgeschlagener dateiübergreifender Abgleich vor. Prüfen Sie, ob die Dateien verknüpft oder getrennt behandelt werden sollen, bevor die Aktivitätsanalyse geöffnet werden kann.",
          ready:
            "Die Voraussetzungen sind erfüllt. Die Zielprüfung kann jetzt für diese Aktivität erzeugt werden.",
          reviewed:
            "Die Voraussetzungen sind erfüllt. Die Zielprüfung kann für diese Aktivität erneut ausgeführt werden.",
          v2Completed:
            "Die Zielprüfung kann jetzt für diese Aktivität geöffnet werden.",
          v2NeedsClarification:
            "Die neueste Zielprüfung braucht noch {{count}} Klärungsfrage, bevor sie geöffnet werden kann.",
          v2NeedsClarification_other:
            "Die neueste Zielprüfung braucht noch {{count}} Klärungsfragen, bevor sie geöffnet werden kann.",
          v2Failed:
            "Die letzte Zielprüfung ist fehlgeschlagen. Starten Sie sie erneut.",
          notStarted:
            "Die Evidenz wurde für diese Aktivität noch nicht interpretiert.",
        },
        activityMeta: "{{uploads}} Dateien · {{interpreted}} interpretiert",
        activityNoFiles:
          "Für diese Aktivität wurde noch keine Evidenz hochgeladen.",
        questionsTitle: "Klärungsfragen",
        questionsDescriptionBatch:
          "Mehrere Fragen müssen beantwortet werden, bevor diese Evidenz interpretiert werden kann. Wähle unten für jede Frage eine Antwort aus und sende dann alle zusammen — die Analyse nach jeder einzelnen Antwort neu zu starten wäre langsam.",
        questionsAnswered: "Antwort gespeichert.",
        questionsAnsweredBatch: "{{count}} Antworten gespeichert.",
        questionsAnswerFailed: "Diese Antwort konnte nicht gespeichert werden.",
        submitAnswersAction: "{{count}} Antworten senden",
        submitAnswersPending: "Wird gesendet…",
        reviewLinkageAction: "Verknüpfung prüfen",
        linkageReviewTitle: "Dateiübergreifende Verknüpfung prüfen",
        linkageReviewDescription:
          "brindl hat eine mögliche Verknüpfung zwischen mehreren Evidenzdateien erkannt, die nicht auf einem eindeutigen Identifikator beruht. Bestätigen Sie eine vorgeschlagene Spaltenverknüpfung nur dann, wenn beide Dateien tatsächlich dieselben Einheiten beschreiben. Lehnen Sie den Vorschlag andernfalls ab; dann bleiben die Dateien getrennt.",
        linkageReviewLoading: "Die Verknüpfungsvorschläge werden geladen…",
        linkageProposalPrompt:
          "Vorgeschlagene Spaltenverknüpfung: „{{tableA}}.{{columnA}}“ mit „{{tableB}}.{{columnB}}“. Soll diese Verknüpfung verwendet werden? Die überlappenden Werte decken aktuell etwa {{overlap}} der kombinierten Ausprägungen ab.",
        linkageAcceptAction: "Als Verknüpfung verwenden",
        linkageRejectAction: "Getrennt behandeln",
        linkageAccepted: "Die vorgeschlagene Verknüpfung wurde übernommen.",
        linkageRejected:
          "Die Dateien werden für diese Aktivität getrennt behandelt.",
        linkageDecisionFailed:
          "Die Entscheidung zur Datei-Verknüpfung konnte nicht gespeichert werden.",
        linkageReviewResolved:
          "Für diese Aktivität sind aktuell keine offenen Verknüpfungsvorschläge mehr vorhanden.",
        actionRunning: "Evidenz wird interpretiert…",
        actionRestart: "Interpretation neu starten",
        actionRunKnowledge: "Evidenz interpretieren",
        actionInterpretMissingEvidence: "Fehlende Evidenz interpretieren",
        interpretationStarted: "KI-Interpretation wurde gestartet.",
        interpretationRestarted: "KI-Interpretation wurde neu gestartet.",
        interpretationRestartNoop:
          "Es wurde keine neue KI-Interpretation gestartet, weil nichts mehr aussteht.",
        interpretationResumed:
          "KI-Interpretation wurde nur für die noch fehlende Evidenz gestartet.",
        interpretationRestartFailed:
          "KI-Interpretation konnte nicht neu gestartet werden.",
        activityNotReadyToast:
          "Diese Aktivität ist noch nicht bereit für die Zielprüfung. Schließen Sie zuerst die Datenschutzprüfung ab oder warten Sie, bis die Verarbeitung fertig ist.",
        actionOpenAnalysis: "Zielprüfung ansehen",
        status: {
          no_evidence: "Keine Evidenz",
          privacy_review: "Datenschutzprüfung",
          qualitative_review: "Codierungsprüfung",
          processing: "In Bearbeitung",
          questions: "Fragen offen",
          partial: "Teilweise fertig",
          goal_review: "Verknüpfung prüfen",
          ready: "Bereit",
          reviewed: "Verfügbar",
          not_started: "Noch nicht gestartet",
        },
      },
    },
    analytics: {
      title: "Analysen",
      description:
        "Prüfen Sie deterministische Kennzahlen und Diagramme, die aus interpretierter Evidenz berechnet wurden.",
      notReadyTitle: "Analysen sind noch nicht bereit",
      notReadyDescription:
        "Analysen werden verfügbar, sobald genügend Evidenz erfolgreich hochgeladen und interpretiert wurde.",
    },
    insights: {
      title: "Erkenntnisse",
      description:
        "Übersetzen Sie Analysen in narrative Erkenntnisse, Risiken und Empfehlungen für Berichte und Entscheidungen.",
      notReadyTitle: "Erkenntnisse sind noch nicht bereit",
      notReadyDescription:
        "Erkenntnisse erscheinen, sobald Evidenz interpretiert wurde und mindestens eine Erkenntnis für dieses Projekt vorliegt.",
      executiveSummary: "Kurzfassung",
      nextSteps: "Empfohlene nächste Schritte",
    },
  },
  impactStory: {
    loading: "Wird geladen…",
    loadFailed: "Die Analyse konnte nicht geladen werden.",
    narrativeTitle: "Fortschritt & Wirkung",
    generatedAt: "Erstellt am {{timestamp}}",
    runAction: "Analyse erzeugen",
    refreshAction: "Analyse aktualisieren",
    runPending: "Wird erzeugt…",
    runSuccess: "Die Analyse wurde aktualisiert.",
    runFailed: "Die Analyse konnte nicht erzeugt werden.",
    narrativeFailed:
      "Die Erzählung konnte nicht erzeugt werden. Die Kennzahlen unten sind trotzdem verlässlich.",
    staleNotice:
      "Seit der letzten Erzeugung gibt es neue Evidenz. Aktualisieren Sie, um die neuesten Zahlen zu sehen.",
    narrativeTemplatedNotice:
      "Diese Zusammenfassung wurde automatisch aus Ihren Daten erstellt, nicht von einer KI verfasst.",
    exploratoryChartNotice:
      "Explorativ — vorher/nachher erkannt, aber nicht als Ergebnis bestätigt",
    backlogPanelTitle: "Backlog",
    backlogPanelSummary: "{{count}} Diagramme verfügbar",
    backlogPanelEmpty:
      "Nichts im Backlog — ausgeblendete Diagramme landen hier.",
    beforeLabel: "Vorher",
    afterLabel: "Nachher",
    pairedDeltaGroupTitle: "Vorher/Nachher-Vergleich",
    pairedDeltaGroupSubtitle:
      "Bestätigte Ergebnisse im Vergleich vor und nach dem Programm.",
    pairedDeltaGroupAriaLabel: "{{summary}}",
    goalProgressChartTitle: "Ziel vs. erreicht — nach Kennzahl",
    goalProgressChartSubtitle:
      "Anteil des Zielwerts, der bislang erreicht wurde",
    goalProgressAriaLabel: "{{summary}}",
    goalProgressStatusGood: "Ziel erreicht",
    goalProgressStatusWarn: "Nahe am Ziel",
    goalProgressStatusRisk: "Braucht Aufmerksamkeit",
    dragHandleLabel: "„{{title}}“ ziehen, um die Reihenfolge zu ändern",
    hideChartLabel: "„{{title}}“ ausblenden",
    outcomeNotYetMeasurable:
      "Noch nicht messbar — es liegt noch keine verknüpfte Evidenz vor.",
    notYetAnalyzedFootnote:
      "Noch keine ausgewerteten Kennzahlen für: {{names}}.",
    emptyTitle: "Noch keine Analyse erzeugt",
    emptyDescription:
      "Erzeugen Sie die allgemeinen Kennzahlen und Diagramme dieses Projekts auf Basis der bereits ausgewerteten Evidenz. Falls verknüpfte Wirkungsevidenz vorliegt, wird sie zusätzlich hervorgehoben.",
    rankedBarsAriaLabel: "{{label}}: {{summary}}",
    trendChartAriaLabel: "{{label}} im Zeitverlauf: {{summary}}",
    byActivityTitle: "Nach Aktivität",
    barChartAriaLabel: "{{label}}: {{summary}}",
    distributionChartAriaLabel: "{{label}}: {{summary}}",
    pieChartAriaLabel: "{{label}}: {{summary}}",
    timelineTitle: "Aktivitäten im Jahresverlauf",
    timelineUndated: "Ohne Datum",
  },
  activityTabs: {
    brief: "Übersicht",
    schema: "Datenprüfung",
    analytics: "Analyse",
    insights: "AI knowledge",
    settings: "Einstellungen",
  },
  activityBrief: {
    loading: "Aktivität wird geladen…",
    loadFailed: "Aktivität konnte nicht geladen werden.",
    redirectingToOverview: "Weiterleitung…",
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
        processing: "brindl bereitet Ihre Evidenz vor",
        ready: "Ihre Evidenz ist bereit für den nächsten Schritt",
        attention: "Dieser Datensatz braucht einen zweiten Blick",
      },
      descriptions: {
        empty:
          "Laden Sie CSV- oder Excel-Monitoringdaten hoch, um die Evidenz vorzubereiten.",
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
        "{{reviewCount}} Prüfpunkte sichtbar · {{insights}} AI knowledge Einträge derzeit verfügbar",
    },
    uploader: {
      eyebrow: "Evidenz hinzufügen",
      title: "Monitoring-Daten in diese Aktivität bringen",
      description:
        "Laden Sie eine CSV-, Excel-, PDF- oder DOCX-Datei hoch. brindl führt Sie von hier aus durch Prüfung, Analyse und AI knowledge.",
      cta: "Evidenz hochladen",
      remove: "Entfernen",
    },
    detail: {
      projectGoal: "Projektkontext",
      noProjectGoal:
        "Es wurden noch keine Projektwirkung oder Outcomes erfasst.",
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
      insights: "AI knowledge",
      qualityIssues: "Datenqualität",
      latestFile: "Neueste Datei",
      noFile: "Noch keine Datei hochgeladen",
      reviewValue: "{{count}} Punkt zur Prüfung",
      analysisValue: "{{status}}",
      insightsValue: "{{count}} AI knowledge Einträge verfügbar",
      notYetAvailable: "Noch nicht verfügbar",
    },
  },
  upload: {
    loading: "Seite zum Hochladen wird geladen…",
    loadFailed: "Die Seite zum Hochladen konnte nicht geladen werden.",
    crumb: "Hochladen",
    eyebrow: "Nachweise hochladen",
    title: "Nachweise für {{name}} hochladen",
    description:
      "Legen Sie Ihre CSV-, Excel-, PDF- oder DOCX-Datei ab, um Evidenz mit dieser Aktivität zu verknüpfen.",
    dropzoneTitle: "Evidenzdatei hierher ziehen",
    dropzoneBrowsePrefix: "oder",
    dropzoneBrowseAction: "Datei vom Computer auswählen",
    accepts: "Akzeptiert .csv, .xlsx, .xls, .pdf, .docx",
    storageNote:
      "Hochgeladene Evidenz bleibt mit dieser Aktivität verknüpft und kann in einem späteren Schritt analysiert werden.",
    existingCounts: "Vorhandene Dateien: {{uploads}} · Jobs: {{jobs}}",
    readyToUpload: "Bereit zum Hochladen",
    ready: "Bereit",
    removeFileAria: "Datei entfernen",
    uploading: "Wird hochgeladen…",
    createProcessingJob: "Evidenz analysieren",
    successToast: "Evidenz hochgeladen.",
    multiSuccessToast: "{{count}} Dateien hochgeladen.",
    failedToast: "Upload fehlgeschlagen.",
    multiFailedToast: "{{count}} Dateien konnten nicht hochgeladen werden.",
    multiResultToast:
      "{{uploaded}} Dateien hochgeladen, {{failed}} fehlgeschlagen.",
    invalidFileNameToast:
      "Dieser Dateiname wird nicht unterstützt. Bitte entferne Steuerzeichen oder Pfadtrenner und versuche es erneut.",
    fileNameTooLongToast:
      "Dieser Dateiname ist zu lang. Bitte kürze ihn und versuche es erneut.",
    unsupportedFileTypeToast:
      "Nicht unterstützter Dateityp. Bitte lade eine CSV-, Excel- (.xlsx/.xls), PDF- oder Word-Datei (.docx) hoch.",
    queueTitle: "Upload-Warteschlange",
    queueProgress: "{{uploaded}} / {{total}} abgeschlossen",
    queueQueued: "In Warteschlange",
    queueUploading: "Wird hochgeladen",
    queueUploaded: "Hochgeladen",
    queueFailed: "Fehlgeschlagen",
  },
  schemaReview: {
    loading: "Schema-Prüfung wird geladen…",
    loadFailed: "Die Schema-Prüfung konnte nicht geladen werden.",
    crumb: "Datensatzprüfung",
    eyebrow: "KI-Datensatzprüfung",
    title: "Hat die KI Ihren Datensatz richtig verstanden?",
    description:
      "brindl ordnet jede hochgeladene Spalte ein, markiert personenbezogene Daten und empfiehlt sichere Transformationen, bevor die Interpretation weitergeht.",
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
        "Sobald Sie eine CSV- oder Excel-Datei hochladen, liest brindl die Struktur, versteht die Felder, erkennt personenbezogene Daten und bereitet alles für die Interpretation vor.",
      benefits: [
        "Jede Spalte automatisch erkennen",
        "Die wahrscheinlichste Bedeutung jedes Felds verstehen",
        "Personenbezogene oder sensible Daten markieren",
        "Anonymisierung vor der Analyse empfehlen",
        "Den Datensatz für die KI-Interpretation vorbereiten",
      ],
      cta: "Datensatz hochladen",
    },
    notReady: {
      title: "Datensatzprüfung ist noch nicht verfügbar",
      description:
        "Die automatisierte spaltenweise Datensatzprüfung wird noch entwickelt. Schauen Sie in einem zukünftigen Update wieder vorbei.",
      cta: "Zurück zur Übersicht",
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
      hashed: "Tokenisieren",
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
    title: "Analyse",
    noVerifiedEvidenceTitle: "Noch keine geeignete Evidenz",
    noVerifiedEvidenceDescription:
      "Für diese Aktivität liegen noch keine strukturierten Evidenzdaten vor, aus denen bereits Analysen erzeugt werden können.",
    awaitingPreparationTitle: "Zuerst offene Interpretationsfragen klären",
    awaitingPreparationDescription:
      "{{count}} Datensatz dieser Aktivität ist noch durch Vorbereitungsfragen blockiert. Beantworten Sie die offenen Fragen auf der Interpretationsseite.",
    awaitingPreparationDescription_other:
      "{{count}} Datensätze dieser Aktivität sind noch durch Vorbereitungsfragen blockiert. Beantworten Sie die offenen Fragen auf der Interpretationsseite.",
    awaitingAnalysisTitle: "Die deterministische Analyse läuft noch",
    awaitingAnalysisDescription:
      "{{count}} vorbereiteter Datensatz benötigt noch eine deterministische Analyse, bevor dieses Dashboard aufgebaut werden kann.",
    awaitingAnalysisDescription_other:
      "{{count}} vorbereitete Datensätze benötigen noch eine deterministische Analyse, bevor dieses Dashboard aufgebaut werden kann.",
    readyToGenerateTitle: "Dashboard kann jetzt erzeugt werden",
    readyToGenerateDescription:
      "Vorbereitung und deterministische Analyse liegen vor. Erzeugen Sie jetzt die Analysen für dieses Aktivitäts-Dashboard.",
    noVerifiedEvidenceCta: "Zur Übersicht",
    v2: {
      eyebrow: "ActivityAnalyst V2",
      title: "Zielprüfung",
      description:
        "Diese Ansicht prüft die aktuellen Aktivitätsziele anhand des neuesten datenschutzsicheren Evidenzstands.",
      loading: "Die neueste Zielprüfung wird geladen…",
      loadFailed: "Die neueste Zielprüfung konnte nicht geladen werden.",
      staleDataWarning:
        "Die unten angezeigte Zielprüfung ist möglicherweise veraltet — die letzte Aktualisierung ist fehlgeschlagen.",
      noRunTitle: "Noch keine Zielprüfung",
      noRunDescription:
        "Prüfen Sie, ob diese Aktivität ihre definierten Ziele anhand der aktuellen datenschutzsicheren Evidenz erreicht.",
      runAction: "Ziele prüfen",
      openAction: "Ansehen",
      refreshAction: "Aktualisieren",
      runPending: "Ziele werden geprüft…",
      runSuccess: "Die Zielprüfung wurde aktualisiert.",
      runFailed:
        "Die Zielprüfung konnte nicht abgeschlossen werden. Bitte starten Sie sie erneut.",
      latestRunTitle: "Neueste Zielprüfung",
      latestRunMeta: "Erstellt {{createdAt}}",
      errorTitle: "Lauffehler",
      issuesTitle: "Validierungsprobleme",
      summaryMissing:
        "Für diesen Lauf wurden keine numerischen Zielkarten erzeugt.",
      dialogDescription:
        "brindl hat geprüft, ob die aktuelle Evidenz die definierten Ziele dieser Aktivität belegt.",
      dialogMeta:
        "{{goals}} Ziele aus {{evidence}} Evidenzdateien wurden in dieser Zielprüfung berücksichtigt.",
      goalTarget: "{{target}} Ziel",
      goalMet: "Ziel erreicht",
      goalPercentOfTarget: "{{percent}} des Ziels",
      attentionTitle: "Braucht Ihre Aufmerksamkeit",
      attentionSectionTitle: "Braucht Aufmerksamkeit",
      onTrackSectionTitle: "Auf Kurs",
      supportingEvidenceTitle: "Weitere belegte Befunde",
      narrativeSectionTitle: "Einordnung",
      noAttentionItems:
        "Aktuell wurde kein gesonderter Handlungsbedarf in dieser Analyse markiert.",
      noOnTrackItems:
        "Aktuell wurde in dieser Analyse noch kein Ziel als klar erreicht bewertet.",
      outputsTitle: "Ergebnisse",
      noOutputs: "Für diese Aktivität sind keine Output-Ziele definiert.",
      limitationsTitle: "Aktuelle Einschränkungen",
      runHistoryTitle: "Frühere Analysen",
      metrics: {
        goals: "Ziele",
        evidence: "Evidenzen",
        tools: "Tools",
        calculations: "Berechnungen",
      },
      runStatus: {
        collected: "Erfasst",
        running: "Läuft",
        needs_clarification: "Klärung nötig",
        completed: "Abgeschlossen",
        failed: "Fehlgeschlagen",
      },
      validationStatus: {
        not_run: "Validierung ausstehend",
        passed: "Validiert",
        failed: "Validierung fehlgeschlagen",
      },
      goalStatus: {
        achieved: "Erreicht",
        not_achieved: "Nicht erreicht",
        evidence_compiled: "Evidenz zusammengestellt",
        qualitative_evidence_only: "Nur qualitative Evidenz",
        mixed_evidence: "Gemischte Evidenz",
        requires_clarification: "Klärung nötig",
        requires_capability: "Berechnung fehlt",
      },
      tensionTitle: "Spannung zwischen Evidenzsignalen",
      tensionDescription:
        "Diese Analyse enthält quantitative und qualitative Evidenz, die bewusst nebeneinander gelesen werden sollte, statt sie zu einem einfachen Gesamturteil zu verdichten.",
      tensionBadge: "Evidenzspannung",
      qualitativeSectionTitle: "Verankerte qualitative Auszüge",
      qualitativeSectionDescription:
        "Diese Ziele werden durch ausgewählte wörtliche Auszüge aus den verknüpften Evidenztabellen gestützt. Lesen Sie sie als verankerte Beispiele, nicht als vollständige Sicht auf alle passenden Zeilen.",
      excerptSampleMeta:
        "{{returned}} Auszug/Auszüge angezeigt aus {{total}} passender/passenden Zeile(n)",
      themeLabel: "Thema/Code: {{theme}}",
      reliabilityLabel:
        "Fehlende Textzeilen: {{missingValuePct}} %. Anzahl Rater:innen: {{raterCount}}.",
      raterUnknown: "unbekannt",
      clarificationTitle: "Vor der Analyse ist noch eine Klärung erforderlich",
      clarificationDescription:
        "ActivityAnalystV2 hat angehalten, weil eine oder mehrere Definitionen noch unklar sind. Beantworte die Fragen unten; danach wird die Analyse mit diesen Antworten erneut gestartet.",
      clarificationDescriptionBatch:
        "ActivityAnalystV2 hat angehalten, weil mehrere Definitionen noch unklar sind. Wähle unten für jede Frage eine Antwort aus und sende dann alle zusammen — die Analyse nach jeder einzelnen Antwort neu zu starten wäre langsam.",
      clarificationAnswered:
        "Klärung gespeichert. Die Aktivitätsanalyse wurde erneut ausgeführt.",
      clarificationAnsweredBatch:
        "{{count}} Antworten gespeichert. Die Aktivitätsanalyse wurde erneut ausgeführt.",
      submitAnswersAction: "{{count}} Antworten senden",
      submitAnswersPending: "Wird gesendet…",
    },
  },
  activitySettings: {
    loading: "Aktivitätseinstellungen werden geladen…",
    loadFailed: "Die Aktivitätseinstellungen konnten nicht geladen werden.",
    crumb: "Einstellungen",
    eyebrow: "Aktivitätseinstellungen",
    title: "Diese Aktivität sauber ausrichten",
    description:
      "Prüfen Sie die Kerndaten, die Evidenzsammlung, Analyse und Reporting für diese Aktivität steuern.",
    activityDetailsTitle: "Aktivitätsdetails",
    workflowGuardrailsTitle: "Workflow-Leitplanken",
    workflowGuardrails: [
      "Nutzen Sie möglichst einen klaren Datensatz pro Aktivität.",
      "Halten Sie Aktivitätsnamen und Beschreibungen spezifisch, damit der KI-Kontext verlässlich bleibt.",
      "Aktualisieren Sie den Status, wenn sich die Umsetzung verändert.",
    ],
    contextTitle: "Warum dieser Kontext wichtig ist",
    supportTitle: "Unterstützung für spätere Iterationen",
    supportDescription:
      "Diese Seite wird zum Ort für Aktivitätsmetadaten, Evidenzregeln und spätere Workflow-Einstellungen ausgebaut.",
    noDescription: "Es wurde noch keine Aktivitätsbeschreibung ergänzt.",
    noActivityType: "Es wurde noch kein Aktivitätstyp ergänzt.",
    noProjectGoal: "Es wurden noch keine Projektwirkung oder Outcomes erfasst.",
    fields: {
      name: "Name",
      status: "Status",
      activityType: "Aktivitätstyp",
      project: "Projekt",
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
      hashed: "Tokenisiert",
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
    sectionTitle: "Aktive Projekte",
    myProjectsSection: "Meine Projekte",
    allProjectsSection: "Alle Projekte",
    projectSingular: "Projekt",
    projectPlural: "Projekte",
    addProject: "Projekt hinzufügen",
    activities: "Aktivitäten",
    addActivity: "Aktivität hinzufügen",
    noProjects: "Noch keine Projekte",
    noActiveProjects: "Keine aktiven Projekte",
    noActiveProjectsHint:
      "Archivierte Projekte finden Sie auf der Projektseite im Tab „Archiviert“.",
    createFirstProject:
      "Öffnen Sie die Projektseite, um Ihr erstes Projekt anzulegen.",
    mobileNavigationTitle: "Workspace-Navigation",
    mobileNavigationDescription:
      "Zwischen Workspace-Bereichen und Projekten wechseln.",
    organizationSettings: "Organisationseinstellungen",
    projectActions: "Projektaktionen",
    archiveProject: "Archivieren",
    reactivateProject: "Reaktivieren",
    deleteProject: "Projekt löschen",
    archiveProjectSuccess: "Projekt wurde archiviert.",
    archiveProjectFailure: "Projekt konnte nicht archiviert werden.",
    reactivateProjectSuccess: "Projekt wurde reaktiviert.",
    reactivateProjectFailure: "Projekt konnte nicht reaktiviert werden.",
    readOnlyProject: "Projekt im Lesemodus",
  },
  status: {
    planning: "Planung",
    active: "Aktiv",
    completed: "Abgeschlossen",
  },
  organizationCard: {
    eyebrow: "Organisation",
    noMission:
      "Fügen Sie in den Organisationseinstellungen eine Mission hinzu.",
    members: "Mitglieder",
    projects: "Projekte",
    role: "Rolle",
    workspace: "Workspace",
    workspaceReady: "Bereit",
    readOnly: "Nur lesen",
  },
  organizationPage: {
    eyebrow: "Organisations-Workspace",
    adminTitle: "Organisations-Workspace",
    managerTitle: "Mein Workspace",
    adminDescription:
      "Öffnen Sie zuletzt bearbeitete Projekte, verfolgen Sie aktuelle Aktivität und sehen Sie, wo im Workspace noch Evidenz fehlt.",
    managerDescription:
      "Setzen Sie die Arbeit in Ihren Projekten fort, prüfen Sie letzte Änderungen und erkennen Sie früh, wo Nachweise noch fehlen.",
    primaryAction: "Projekt erstellen",
    emptyTitle: "Noch keine Projekte",
    emptyDescription:
      "Projekte werden auf der Projektseite angelegt. Dort verwalten Sie die vollständige Projektliste Ihres Workspaces.",
    emptyManagerTitle: "Willkommen bei {{organization}}",
    emptyManagerDescription:
      "Starten Sie mit Ihrem ersten Projekt. Projekte strukturieren Evidenz über Aktivitäten, Uploads, Analysen und AI knowledge hinweg.",
    emptyAction: "Erstes Projekt erstellen",
    myProjects: "Meine Projekte",
    continueWorking: "Weiterarbeiten",
    continueWorkingDescription:
      "Setzen Sie dort an, wo zuletzt Evidenz, Aktivitäten oder Berichte gepflegt wurden.",
    viewAllProjects: "Alle Projekte ansehen",
    recentActivity: "Letzte Aktivität",
    recentActivityDescription:
      "Diese Aktivitäten wurden im Workspace zuletzt bearbeitet.",
    noRecentActivity: "Noch keine Aktivität im Workspace.",
    recentActivityUploads: "{{count}} Uploads",
    projectsNeedingAttention: "Projekte mit Handlungsbedarf",
    projectsNeedingAttentionDescription:
      "Hier sehen Sie Projekte, in denen Aktivitäten oder Evidenz noch fehlen.",
    allProjectsOnTrack:
      "Derzeit benötigt kein Projekt im Workspace unmittelbare Aufmerksamkeit.",
    openProjectsPage: "Zur Projektseite",
    nextActionTitle: "Nächster Schritt",
    nextActionLabels: {
      openProject: "Projekt öffnen",
      uploadEvidence: "Evidenz hochladen",
    },
    nextActionStates: {
      createActivity:
        "Für dieses Projekt fehlt noch die erste Aktivität. Legen Sie zuerst die Maßnahme an, bevor Evidenz hochgeladen werden kann.",
      uploadEvidence:
        "Für {{count}} Aktivität fehlt noch Evidenz. Laden Sie Nachweise hoch, damit Datenschutzprüfung und Interpretation starten können.",
      uploadEvidence_other:
        "Für {{count}} Aktivitäten fehlt noch Evidenz. Laden Sie Nachweise hoch, damit Datenschutzprüfung und Interpretation starten können.",
      continueProject:
        "Alle Projekte haben Aktivitäten und erste Evidenz. Öffnen Sie das zuletzt bearbeitete Projekt, um die nächste Arbeitsphase fortzusetzen.",
    },
    attentionReasons: {
      noActivities: "Diesem Projekt fehlt noch die erste Aktivität.",
      noEvidence:
        "Für dieses Projekt wurde in den vorhandenen Aktivitäten noch keine Evidenz hochgeladen.",
      partialEvidence:
        "{{missing}} von {{total}} Aktivitäten haben noch keine Evidenz.",
    },
    activitiesLabel: "Aktivitäten",
    noProjectDescription: "Noch kein Projektprofil hinterlegt.",
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
    title: "Projekte",
    description: "Verwalten Sie laufende und archivierte Projekte.",
    primaryAction: "Projekt erstellen",
    emptyTitle: "Noch keine Projekte in diesem Workspace",
    emptyDescription:
      "Sobald Projekte angelegt sind, werden sie hier als zentrale Einstiegspunkte für Aktivitäten, Uploads, Analysen und AI knowledge angezeigt.",
    noDescription: "Noch kein Projektziel hinterlegt.",
    activities: "Aktivitäten",
    activeTabLabel: "Aktive Projekte ({{count}})",
    archivedTabLabel: "Archiviert ({{count}})",
    activeTabHint: "Abgeschlossene Projekte finden Sie im Tab „Archiviert“.",
    archivedTabHint: "Hier sehen Sie Projekte mit abgeschlossenem Status.",
    searchPlaceholder: "Projekte durchsuchen…",
    sortUpdated: "Sortieren: Zuletzt aktualisiert",
    sortName: "Sortieren: Name A–Z",
    sortStart: "Sortieren: Startdatum",
    noResultsTitle: "Keine passenden Projekte gefunden",
    noResultsDescription:
      "Passen Sie Ihren Suchbegriff oder die Auswahl zwischen aktiven und archivierten Projekten an.",
  },
  projectCard: {
    activities: "Aktivitäten",
    updated: "Aktualisiert",
  },
  organizationActivities: {
    eyebrow: "Aktivitäten",
    title: "Aktivitäten über meine Projekte hinweg",
    description:
      "Öffnen Sie eine Ihrer Aktivitäten, um Nachweise hochzuladen oder AI knowledge weiterzuverfolgen.",
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
    inviteSuccess:
      "Einladung wurde erstellt. Den Einladungslink finden Sie unter den ausstehenden Einladungen.",
    inviteFailure: "Einladung konnte nicht erstellt werden.",
    pendingInvitations: "Ausstehende Einladungen",
    pendingStatus: "Wartet auf Annahme",
    invitationLinkLabel: "Einladungslink",
    copyInviteLink: "Einladungslink kopieren",
    copyInviteLinkSuccess: "Einladungslink wurde kopiert.",
    copyInviteLinkFailure: "Einladungslink konnte nicht kopiert werden.",
    resendInvitation: "Erneut senden",
    resendInvitationSuccess: "Einladung wurde erneut gesendet.",
    resendInvitationFailure: "Einladung konnte nicht erneut gesendet werden.",
    currentMembers: "Aktuelle Mitglieder",
    removeAction: "Entfernen",
    removeSuccess: "Mitglied wurde entfernt.",
    removeFailure: "Mitglied konnte nicht entfernt werden.",
  },
  outcomeStatements: {
    eyebrow: "Wirkungsaussagen",
    title: "Wirkungsaussagen",
    description:
      "Definieren Sie die kurzfristigen und langfristigen Wirkungen, die dieses Projekt anstrebt. Evidenz kann diesen Aussagen später zugeordnet werden, um zu zeigen, was tatsächlich gemessen wurde.",
    loading: "Wirkungsaussagen werden geladen…",
    emptyTitle: "Noch keine Wirkungsaussagen",
    emptyDescription:
      "Fügen Sie die kurz- und langfristigen Wirkungen hinzu, die dieses Projekt anstrebt.",
    addAction: "Wirkungsaussage hinzufügen",
    editAction: "Bearbeiten",
    deleteAction: "Löschen",
    termShort: "Kurzfristig",
    termLong: "Langfristig",
    createSuccess: "Wirkungsaussage hinzugefügt.",
    createFailure: "Wirkungsaussage konnte nicht hinzugefügt werden.",
    updateSuccess: "Wirkungsaussage aktualisiert.",
    updateFailure: "Wirkungsaussage konnte nicht aktualisiert werden.",
    deleteSuccess: "Wirkungsaussage gelöscht.",
    deleteFailure: "Wirkungsaussage konnte nicht gelöscht werden.",
    importFromIntendedChangesAction:
      "Aus langfristigen Wirkungszielen importieren",
    importTitle: "Wirkungsaussagen importieren",
    importDescription:
      "Dies sind die langfristigen Wirkungen, die Sie bereits für dieses Projekt definiert haben. Wählen Sie aus, welche als Wirkungsaussagen hinzugefügt werden sollen — Sie können sie danach bearbeiten oder entfernen.",
    importAction: "{{count}} Wirkungsaussagen importieren",
    importing: "Wird importiert…",
    importSuccess: "Wirkungsaussagen importiert.",
    importFailure: "Wirkungsaussagen konnten nicht importiert werden.",
  },
  outcomeStatementDelete: {
    title: "Diese Wirkungsaussage löschen?",
    description:
      "Diese Aktion kann nicht rückgängig gemacht werden. Beim Löschen von „{{statement}}“ werden auch alle damit verknüpften Evidenzverbindungen entfernt.",
    confirmAction: "Wirkungsaussage löschen",
    deleting: "Wird gelöscht…",
  },
  outcomeEvidencePairing: {
    title: "Zu prüfende Evidenz",
    description:
      "brindl zeigt Ihre Wirkungsaussagen zuerst und legt die am besten passenden Evidenz-Kandidaten daneben. Sie können die Empfehlungen übernehmen, andere Evidenz zuordnen oder Kandidaten verwerfen — die finale Entscheidung bleibt bei Ihnen.",
    runAction: "Evidenz abgleichen und auswerten",
    runningAction: "Evidenz wird abgeglichen…",
    runSuccess: "Der Evidenzabgleich wurde aktualisiert.",
    runStartedSuccess:
      "Die Interpretation fuer den Evidenzabgleich wurde gestartet. Aktualisieren Sie nach Abschluss der Verarbeitung erneut.",
    runFailure: "Der Evidenzabgleich konnte nicht aktualisiert werden.",
    loading: "Kandidaten-Evidenz wird geprüft…",
    pairedDeltaLabel: "Vorher-/Nachher-Vergleich",
    singleDistributionLabel: "Verteilung",
    beforeLabel: "Vorher",
    afterLabel: "Nachher",
    outcomeSelectPlaceholder: "Wirkungsaussage auswählen",
    assignAction: "Wirkungsaussage zuordnen",
    rejectAction: "Keiner Wirkungsaussage zuordnen",
    assignSuccess: "Evidenz mit der Wirkungsaussage verknüpft.",
    assignFailure: "Die Evidenz konnte nicht verknüpft werden.",
    rejectSuccess: "Evidenz als nicht zugehörig markiert.",
    rejectFailure: "Die Ablehnung konnte nicht gespeichert werden.",
    errorTitle: "Kandidaten-Evidenz konnte nicht geprüft werden",
    errorDescription:
      "Beim Laden der Evidenz-Kandidaten ist ein Fehler aufgetreten. Versuchen Sie es in Kürze erneut.",
    suggestedOutcomeLabel: "Vorschlag:",
    suggestedOutcomeUncertain:
      "brindl konnte dies keiner Ihrer Wirkungsaussagen sicher zuordnen.",
    noOutcomeStatementsTitle: "Zuerst Wirkungsaussagen anlegen",
    noOutcomeStatementsDescription:
      "Sobald für dieses Projekt Wirkungsaussagen vorliegen, können Sie hier passende Evidenz dazu prüfen und verknüpfen.",
    recommendedEvidenceTitle: "Empfohlene unterstützende Evidenz",
    noRecommendedEvidence:
      "Für diese Wirkungsaussage gibt es noch keine direkte Empfehlung. Sie können unten trotzdem andere Evidenz auswählen.",
    confirmedEvidenceTitle: "Bereits bestätigte Evidenz",
    noConfirmedEvidence:
      "Für diese Wirkungsaussage wurde noch keine Evidenz bestätigt.",
    baselineSystemLabel: "Baseline",
    impactMeasurementSystemLabel: "Wirkungsmessung",
    otherEvidenceTitle: "Andere geeignete vorbereitete Evidenz auswählen",
    otherEvidencePlaceholder:
      "Alle geeigneten vorbereiteten Evidenzoptionen durchsuchen",
    removeLinkAction: "Bestätigte Verknüpfung entfernen",
    removeLinkSuccess: "Bestätigte Evidenz-Verknüpfung entfernt.",
    removeLinkFailure:
      "Die bestätigte Evidenz-Verknüpfung konnte nicht entfernt werden.",
    unassignedCandidatesTitle: "Weitere offene Evidenz-Kandidaten",
    unassignedCandidatesDescription:
      "Diese Kandidaten wurden keiner Wirkungsaussage sicher empfohlen. Sie können sie trotzdem manuell zuordnen oder verwerfen.",
    diagnosticsTitle: "Diagnose zum Evidenzabgleich",
    diagnosticsSummary: ({
      activityCount,
      candidateCount,
      readyTableCount,
    }: {
      activityCount: number;
      candidateCount: number;
      readyTableCount: number;
    }) =>
      `${candidateCount} Kandidat(en) aus ${readyTableCount} auswertbaren Tabelle(n) ueber ${activityCount} Projektaktivitaet(en).`,
    diagnosticReasonJobsStarted:
      "Fehlende Interpretationsarbeit wurde fuer mindestens eine Aktivitaet gestartet. Nach Abschluss dieser Jobs werden weitere Evidenz-Kandidaten verfuegbar sein.",
    diagnosticReasonNoReadyTables:
      "Aktuell gibt es keine interpretierten und fuer die Analyse vorbereiteten Tabellen fuer den Wirkungsabgleich.",
    diagnosticReasonNoSharedIdentifier:
      "Zwischen den Baseline- und Wirkungsmessungstabellen gibt es derzeit keine gemeinsame Teilnehmer-ID.",
    diagnosticReasonNoMatchingScaleColumns:
      "Einige Spalten sind als Vorher-/Nachher-Paar markiert, aber keine davon ergab eine gueltige Zuordnung (bitte die angegebene Instrumentbezeichnung, Kohorte und ID-Spalte auf beiden Seiten pruefen).",
    diagnosticReasonNoDeclaredPairingGroups:
      "Es gibt validierte Skalen-Spalten, aber noch keine ist als Teil eines Vorher-/Nachher-Paares markiert. Bitte die Zuordnungsfrage fuer jede Spalte in der Interpretationspruefung beantworten, damit sie fuer den Abgleich infrage kommt.",
    diagnosticReasonNoCategoricalColumns:
      "Aktuell stehen keine kategorialen Spalten als eigenstaendige Verteilungsevidenz zur Verfuegung.",
    diagnosticReasonDuplicateIdentifierValues:
      "Die Teilnehmer-ID-Spalte einer Tabelle enthaelt doppelte Werte und kann daher nicht sicher verknuepft werden. Bitte die ID-Spalte bereinigen, bevor ein Abgleich moeglich ist.",
    diagnosticReasonScaleBoundsMismatch:
      "Zwei Spalten sind als Vorher-/Nachher-Paar markiert, aber ihre angegebenen Skalenbereiche stimmen nicht ueberein (z. B. 1-5 vs. 0-10) und wurden deshalb nicht verknuepft.",
    diagnosticReasonScaleBoundsNotDeclared:
      "Zwei Spalten sind als Vorher-/Nachher-Paar markiert, aber der volle Wertebereich der Skala wurde fuer eine oder beide noch nicht angegeben. Bitte die Frage zum Skalenbereich in der Interpretationspruefung beantworten, damit sie fuer den Abgleich infrage kommen.",
    activityStatusJobsStarted: "Interpretation gestartet",
    activityStatusAlreadyReady: "Bereits interpretiert",
    activityStatusNoUploads: "Keine Uploads",
    activityStatusBlocked: "Blockiert",
    activityDiagnosticSummary: ({
      uploadCount,
      interpretedUploadCount,
      readyTableCount,
    }: {
      uploadCount: number;
      interpretedUploadCount: number;
      readyTableCount: number;
    }) =>
      `${uploadCount} Upload(s), ${interpretedUploadCount} interpretiert, ${readyTableCount} auswertbare Tabelle(n).`,
    uploadStateActiveJob: "Es laeuft bereits ein Interpretationsjob.",
    uploadStateAlreadyInterpreted:
      "Fuer diese Datei liegt bereits ein Interpretationsergebnis vor.",
    uploadStateReadyToInterpret:
      "Diese Datei ist bereit fuer die Interpretation, aber die Interpretation muss zuerst im vorgelagerten Interpretationsschritt abgeschlossen werden.",
    uploadStatePrivacyMissing:
      "Die Privacy-Safe-Verarbeitung dieser Datei ist noch nicht abgeschlossen.",
    uploadStateUnsupportedModality:
      "Die extrahierte Struktur dieser Datei wird derzeit nicht fuer die Interpretation unterstuetzt.",
  },
  organizationBilling: {
    eyebrow: "Abrechnung",
    title: "Abo und Abrechnung",
    description:
      "Die Abrechnung erfolgt auf Organisationsebene, damit die Verantwortlichkeiten der einzelnen Projekte klar voneinander getrennt bleiben.",
    placeholder:
      "Das Abonnementmanagement kann später hier ergänzt werden, ohne das Projekt- und Aktivitätsmodell zu verändern.",
  },
  projectSettings: {
    eyebrow: "Projekteinstellungen",
    title: "Projekteinstellungen",
    description:
      "Prüfen Sie die aktuelle Projektkonfiguration und verwalten Sie irreversible Aktionen mit besonderer Vorsicht.",
    general: "Projektdetails",
    generalDescription:
      "Diese Werte spiegeln die aktuell im Backend gespeicherten Projektmetadaten wider.",
    readOnlyNotice:
      "Sie können diese Angaben einsehen, aber nur die zuständige Projektleitung kann sie bearbeiten.",
    editAction: "Bearbeiten",
    cancelEditAction: "Bearbeitung abbrechen",
    saveAction: "Änderungen speichern",
    savingAction: "Speichert…",
    success: "Projekt wurde aktualisiert.",
    failure: "Projekt konnte nicht aktualisiert werden.",
    optionalLabel: "optional",
    requiredField: "Bitte füllen Sie dieses Pflichtfeld aus.",
    requiredMonth: "Bitte wählen Sie einen Monat aus.",
    invalidMonth: "Bitte geben Sie einen gültigen Monat ein.",
    dangerTitle: "Projekt löschen",
    dangerDescription:
      "Beim Löschen eines Projekts werden alle verknüpften Aktivitäten, Uploads, Jobs, Prüfergebnisse, Analysen und AI knowledge dauerhaft entfernt.",
    deleteAction: "Projekt löschen",
    notSet: "Nicht gesetzt",
    sections: {
      fundingContext: "Förderkontext",
      projectContext: "Projektkontext",
    },
    fields: {
      initialSituation: "Ausgangslage",
      timeline: "Zeitraum",
      overarchingTargetGroup: "Übergeordnete Zielgruppe(n)",
      intendedChanges: "Angestrebte langfristige Wirkung / Impact",
      fundingProgram: "Förderprogramm",
      fundingOrganization: "Fördernde Organisation",
      targetGroups: "Zielgruppen",
      areaOfOperation: "Einsatzgebiet",
      partnerships: "Kooperationen / Partnerschaften",
      sdgs: "SDGs",
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
      insights: "alle AI knowledge Inhalte",
    },
  },
  activityDelete: {
    title: "Diese Aktivität löschen?",
    description:
      "Diese Aktion kann nicht rückgängig gemacht werden. Beim Löschen der Aktivität „{{name}}“ wird verknüpfte Evidenz ebenfalls dauerhaft entfernt.",
    confirmAction: "Aktivität löschen",
    deleting: "Wird gelöscht…",
  },
  dialogs: {
    cancel: "Abbrechen",
    create: "Erstellen",
    createProjectTitle: "Projekt erstellen",
    createProjectDescription:
      "Übertragen Sie alle Ziele, Leistungen und Kennzahlen, die Sie mit Ihren Fördernden vereinbart haben, möglichst vollständig und in der vereinbarten Form. Eine sorgfältige Eintragung lohnt sich: Die Angaben bilden die Grundlage für die spätere Analyse Ihres Projekts und helfen dabei, Ergebnisse, Entwicklungen und noch fehlende Daten besser einzuordnen.",
    createActivityTitle: "Aktivität hinzufügen",
    editActivityTitle: "Aktivität bearbeiten",
    editActivityDescription:
      "Aktualisieren Sie die Umsetzungsdetails dieser Projektaktivität.",
    createOutcomeStatementTitle: "Wirkungsaussage hinzufügen",
    editOutcomeStatementTitle: "Wirkungsaussage bearbeiten",
    editOutcomeStatementDescription: "Aktualisieren Sie diese Wirkungsaussage.",
    project: {
      submit: "Projekt erstellen",
      creating: "Projekt wird erstellt…",
      success: "Projekt wurde erstellt.",
      failure: "Projekt konnte nicht erstellt werden.",
      projectProfile: "Projektprofil",
      name: "Projektname",
      namePlaceholder: "Mentoring-Programm 2026",
      initialSituation: "Ausgangslage",
      initialSituationPlaceholder:
        "Jugendliche aus einkommensarmen Familien haben in der Region deutlich seltener Zugang zu außerschulischen Bildungsangeboten.",
      initialSituationTooltipLabel: "Hinweis zur Ausgangslage anzeigen",
      initialSituationTooltip:
        "Beschreiben Sie kurz, für wen das Problem besteht und warum Handlungsbedarf besteht.",
      startMonth: "Startmonat / Jahr",
      endMonth: "Endmonat / Jahr",
      overarchingTargetGroup: "Übergeordnete Zielgruppe(n)",
      overarchingTargetGroupPlaceholder:
        "z. B. Jugendliche mit Migrationshintergrund",
      intendedChanges: "Angestrebte langfristige Wirkung / Impact",
      intendedChangesPlaceholder:
        "Welche langfristigen Veränderungen bei den Zielgruppen soll das Projekt unterstützen?",
      intendedChangesValidation:
        "Bitte nennen Sie eine bis sechs angestrebte langfristige Wirkungen / Impacts.",
      intendedChangesAddRow: "Weitere Wirkung hinzufügen",
      intendedChangesRemoveRow: "Wirkung entfernen",
      fundingProgram: "Förderprogramm",
      fundingProgramPlaceholder: "Erasmus+",
      fundingOrganization: "Fördernde Organisation",
      fundingOrganizationPlaceholder: "Europäische Kommission",
      sdgs: "SDGs",
      sdgsPlaceholder: "SDG 4, SDG 10",
      sdgsHint:
        "Optional. Mehrere Einträge können kommagetrennt oder zeilenweise eingegeben werden.",
      targetGroups: "Zielgruppen",
      targetGroupsPlaceholder: "Eine oder mehrere Zielgruppen auswählen",
      targetGroupsValidation:
        "Bitte wählen Sie mindestens eine Zielgruppe aus.",
      customTargetGroupValidation:
        "Bitte ergänzen Sie eine eigene Zielgruppe für Sonstige.",
      targetGroupsSelectedSingle: "1 Zielgruppe ausgewählt",
      targetGroupsSelectedMultiple: "{{count}} Zielgruppen ausgewählt",
      customTargetGroupPlaceholder: "Eigene Zielgruppe hinzufügen",
      areaOfOperation: "Einsatzgebiet",
      areaOfOperationPlaceholder: "Wo wird das Projekt umgesetzt?",
      partnerships: "Kooperationen / Partnerschaften",
      partnershipsPlaceholder:
        "Wichtige Kooperations- oder Umsetzungspartner ergänzen.",
    },
    activity: {
      submit: "Aktivität erstellen",
      updateSubmit: "Änderungen speichern",
      creating: "Aktivität wird erstellt…",
      updating: "Aktivität wird gespeichert…",
      success: "Aktivität wurde erstellt.",
      failure: "Aktivität konnte nicht erstellt werden.",
      updateSuccess: "Aktivität wurde aktualisiert.",
      updateFailure: "Aktivität konnte nicht aktualisiert werden.",
      name: "Aktivitätsname",
      description: "Beschreibung der Aktivität",
      activityType: "Aktivitätstyp",
      activityTypeCustomPlaceholder: "Aktivitätstyp beschreiben",
      startDate: "Startdatum",
      endDate: "Enddatum",
      targetAudience: "Zielgruppe",
      targetAudienceTooltipLabel: "Hinweis zur Zielgruppe",
      targetAudienceTooltip: "Mit wem wird die Aktivität durchgeführt?",
      objectives: "Zweck der Aktivität",
      objectivesTooltipLabel: "Hinweis zum Zweck der Aktivität",
      objectivesTooltip: "Warum wird sie durchgeführt?",
      objectivesPlaceholder:
        "Die Teilnehmenden praktisch auf Bewerbungsverfahren vorbereiten",
      output: "Leistungsziele (Outputs)",
      outputTooltipLabel: "Hinweis zum Output",
      outputTooltip: "Was wird unmittelbar durchgeführt oder erstellt?",
      outputPlaceholder:
        "• 12 Workshops innerhalb eines Jahres durchführen\n• 150 Teilnehmende erreichen\n• Mindestens 80 % der Teilnehmenden schließen das Angebot ab\n• Mindestens 75 % der Teilnehmenden sind mit dem Angebot zufrieden",
      status: "Status",
    },
    outcomeStatement: {
      submit: "Wirkungsaussage hinzufügen",
      updateSubmit: "Änderungen speichern",
      creating: "Wird hinzugefügt…",
      updating: "Wird gespeichert…",
      term: "Zeithorizont",
      termShort: "Kurzfristig",
      termLong: "Langfristig",
      statement: "Wirkungsaussage",
      statementPlaceholder:
        "z. B. Mentees berichten von mehr Klarheit über ihre nächsten Karriereschritte.",
    },
    options: {
      targetGroups: [
        "Kinder",
        "Jugendliche",
        "Erwachsene",
        "Senior:innen",
        "Familien",
        "Menschen mit Behinderung",
        "Geflüchtete",
        "Migrant:innen",
        "Arbeitslose",
        "Ehrenamtliche",
        "Unternehmen",
        "Politische Akteure",
        "Sonstige",
      ],
      activityTypes: [
        "Workshop",
        "Informationsveranstaltung",
        "Beratung",
        "Mentoring",
        "Schulung",
        "Veranstaltung",
        "Netzwerktreffen",
        "Kampagne",
      ],
      customTargetGroupOption: "Sonstige",
      customActivityTypeOption: "Sonstige",
    },
  },
  errorPage: {
    title: "Diese Seite konnte nicht geladen werden",
    description:
      "Auf unserer Seite ist ein Fehler aufgetreten. Versuchen Sie es erneut oder gehen Sie zurück zur Startseite.",
  },
};

export default de;
