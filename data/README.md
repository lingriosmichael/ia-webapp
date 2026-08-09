# Impact Atlas – Mock-Evidenzdaten (synthetisch)

## Was ist das hier?

Dies ist ein **synthetischer Testdatensatz** für die Impact-Atlas-Testumgebung. Er simuliert die
Evidenzunterlagen eines fiktiven Mentoring-Programms in Berlin und dient dazu, den Workflow

Projekt → Aktivitäten → Evidenz-Upload → Datenschutzprüfung → Evidenzanalyse → Interpretation →
Grant-Health-Empfehlungen

mit realistischem, unaufbereitetem Material zu testen.

**Alle Personen, Organisationen, E-Mail-Adressen, Telefonnummern und Schulen in diesem Datensatz
sind frei erfunden.** Jede Ähnlichkeit mit real existierenden Personen oder Einrichtungen ist
zufällig und nicht beabsichtigt.

## Fiktives Projekt

- **Projektname:** Mentoring-Programm „Brücken in die Zukunft" 2026
- **Förderprogramm:** ESF Plus, kofinanziert durch das Land Berlin
- **Fördergeber:** Europäische Union / Land Berlin
- **Förderzeitraum:** 01.01.2026 – 31.12.2026
- **Zielgruppen:** Jugendliche im Übergang Schule–Beruf, junge Erwachsene mit Migrationsgeschichte,
  freiwillige Senior:innen / erwachsene Mentor:innen als Mentor:innen

## Ordnerstruktur

| Ordner                    | Aktivität                                        |
| ------------------------- | ------------------------------------------------ |
| `00_manifest`             | Übersicht/Manifest aller Dateien in diesem Paket |
| `01_mentor_recruitment`   | Mentor:innengewinnung und Auswahl                |
| `02_mentor_training`      | Mentor:innenschulung                             |
| `03_school_info_sessions` | Informationsveranstaltungen an Schulen           |
| `04_matching`             | Matching von Jugendlichen und Mentor:innen       |
| `05_monthly_mentoring`    | Monatliche Mentoring-Treffen                     |
| `06_career_workshops`     | Karriere- und Bewerbungstrainings                |
| `07_company_visits`       | Unternehmensbesuche und Praxiseinblicke          |
| `08_reflection`           | Reflexions- und Feedbackgespräche                |
| `09_final_outcomes`       | Abschlussbefragung und Outcome-Erhebung          |

Jeder Ordner enthält eine Mischung aus Dateiformaten (CSV, XLSX, DOCX, PDF, TXT/E-Mail-Auszüge),
so wie sie in der Projektpraxis tatsächlich anfallen würden – Formularexporte, Teilnahmelisten,
interne Notizen, Agenden, Feedbackkarten, E-Mail-Verläufe usw.

## Hinweise zur Beschaffenheit der Daten

- Die Unterlagen sind **absichtlich unaufbereitet**: es gibt keine fertigen Auswertungsberichte
  oder Management-Summaries in diesem Paket.
- Dateien enthalten teils **personenbezogene Daten** (Namen, Kontaktdaten, z. T. Angaben zu
  Minderjährigen) und sind entsprechend vor einer inhaltlichen Auswertung datenschutzrechtlich
  zu prüfen.
- Formate, Feldbezeichnungen, Schreibweisen und ID-Systematiken (z. B. Mentor-IDs, Jugend-IDs,
  Tandem-IDs) sind **nicht vollständig einheitlich** – das entspricht dem realen Erscheinungsbild
  von über mehrere Monate gewachsenen Projektunterlagen aus verschiedenen Quellen.
- Nicht jede Aktivität ist gleich vollständig dokumentiert. Das ist so beabsichtigt und Teil des
  Testszenarios.

Dieses README beschreibt nur den Aufbau des Datensatzes. Es enthält **keine Analyse, Bewertung
oder Schlussfolgerung** zu den Inhalten – das ist Aufgabe der Impact-Atlas-Auswertung selbst.
