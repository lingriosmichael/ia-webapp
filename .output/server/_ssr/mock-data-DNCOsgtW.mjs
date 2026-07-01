//#region node_modules/.nitro/vite/services/ssr/assets/mock-data-DNCOsgtW.js
function getSchema(t) {
	return [
		{
			original: "participant_name",
			semantic: t("schemaReview.schema.participant_name.semantic"),
			privacy: "Direct Identifier",
			transformation: "Hashed",
			confidence: .98,
			reasoning: t("schemaReview.schema.participant_name.reasoning", { returnObjects: true }),
			sampleValues: t("schemaReview.schema.participant_name.sampleValues", { returnObjects: true })
		},
		{
			original: "email",
			semantic: t("schemaReview.schema.email.semantic"),
			privacy: "Direct Identifier",
			transformation: "Hashed",
			confidence: .99,
			reasoning: t("schemaReview.schema.email.reasoning", { returnObjects: true }),
			sampleValues: t("schemaReview.schema.email.sampleValues", { returnObjects: true })
		},
		{
			original: "age_group",
			semantic: t("schemaReview.schema.age_group.semantic"),
			privacy: "Quasi Identifier",
			transformation: "Generalised",
			confidence: .94
		},
		{
			original: "district",
			semantic: t("schemaReview.schema.district.semantic"),
			privacy: "Quasi Identifier",
			transformation: "Kept",
			confidence: .92,
			reasoning: t("schemaReview.schema.district.reasoning", { returnObjects: true }),
			sampleValues: t("schemaReview.schema.district.sampleValues", { returnObjects: true })
		},
		{
			original: "sessions_attended",
			semantic: t("schemaReview.schema.sessions_attended.semantic"),
			privacy: "Operational",
			transformation: "Kept",
			confidence: .97
		},
		{
			original: "total_sessions",
			semantic: t("schemaReview.schema.total_sessions.semantic"),
			privacy: "Operational",
			transformation: "Kept",
			confidence: .96
		},
		{
			original: "completed_program",
			semantic: t("schemaReview.schema.completed_program.semantic"),
			privacy: "Outcome",
			transformation: "Kept",
			confidence: .95
		},
		{
			original: "pre_confidence_score",
			semantic: t("schemaReview.schema.pre_confidence_score.semantic"),
			privacy: "Outcome",
			transformation: "Kept",
			confidence: .93
		},
		{
			original: "post_confidence_score",
			semantic: t("schemaReview.schema.post_confidence_score.semantic"),
			privacy: "Outcome",
			transformation: "Kept",
			confidence: .93
		},
		{
			original: "mentor_match_status",
			semantic: t("schemaReview.schema.mentor_match_status.semantic"),
			privacy: "Operational",
			transformation: "Kept",
			confidence: .71,
			clarifyingQuestion: t("schemaReview.schema.mentor_match_status.clarifyingQuestion"),
			clarifyingOptions: t("schemaReview.schema.mentor_match_status.options", { returnObjects: true }),
			reasoning: t("schemaReview.schema.mentor_match_status.reasoning", { returnObjects: true }),
			sampleValues: t("schemaReview.schema.mentor_match_status.sampleValues", { returnObjects: true })
		},
		{
			original: "case_notes",
			semantic: t("schemaReview.schema.case_notes.semantic"),
			privacy: "High Risk",
			transformation: "Removed",
			confidence: .99,
			reasoning: t("schemaReview.schema.case_notes.reasoning", { returnObjects: true }),
			sampleValues: t("schemaReview.schema.case_notes.sampleValues", { returnObjects: true })
		}
	];
}
var datasetOverview = {
	rows: 184,
	columns: 11,
	participants: 178,
	duplicateRows: 4,
	missingValues: 21,
	qualityScore: .92
};
function getKeyMetrics(t) {
	return [
		{
			key: "participants",
			label: t("projectAnalytics.metrics.participants.label"),
			value: "178",
			delta: t("projectAnalytics.metrics.participants.delta")
		},
		{
			key: "attendanceRate",
			label: t("projectAnalytics.metrics.attendanceRate.label"),
			value: "82%",
			delta: t("projectAnalytics.metrics.attendanceRate.delta")
		},
		{
			key: "programmeCompletion",
			label: t("projectAnalytics.metrics.programmeCompletion.label"),
			value: "71%",
			delta: t("projectAnalytics.metrics.programmeCompletion.delta")
		},
		{
			key: "confidenceImprovement",
			label: t("projectAnalytics.metrics.confidenceImprovement.label"),
			value: "+2.3",
			delta: t("projectAnalytics.metrics.confidenceImprovement.delta")
		},
		{
			key: "missingValues",
			label: t("projectAnalytics.metrics.missingValues.label"),
			value: "21",
			delta: t("projectAnalytics.metrics.missingValues.delta")
		},
		{
			key: "duplicateRows",
			label: t("projectAnalytics.metrics.duplicateRows.label"),
			value: "4",
			delta: t("projectAnalytics.metrics.duplicateRows.delta")
		}
	];
}
function getAttendanceDistribution() {
	return [
		{
			bucket: "0–25%",
			count: 9
		},
		{
			bucket: "26–50%",
			count: 18
		},
		{
			bucket: "51–75%",
			count: 47
		},
		{
			bucket: "76–100%",
			count: 104
		}
	];
}
function getCompletionByAgeGroup() {
	return [
		{
			group: "14–15",
			completed: 62,
			dropped: 22
		},
		{
			group: "16–17",
			completed: 71,
			dropped: 18
		},
		{
			group: "18+",
			completed: 78,
			dropped: 12
		}
	];
}
var confidenceImprovement = [
	{
		week: "W1",
		pre: 4.1,
		post: 4.1
	},
	{
		week: "W3",
		pre: 4.1,
		post: 4.6
	},
	{
		week: "W6",
		pre: 4.1,
		post: 5.3
	},
	{
		week: "W9",
		pre: 4.1,
		post: 6
	},
	{
		week: "W12",
		pre: 4.1,
		post: 6.4
	}
];
function getMentorMatching(t) {
	return [
		{
			name: t("projectAnalytics.mentorMatching.matched"),
			value: 162
		},
		{
			name: t("projectAnalytics.mentorMatching.pending"),
			value: 11
		},
		{
			name: t("projectAnalytics.mentorMatching.unmatched"),
			value: 5
		}
	];
}
var trendsByWeek = [
	{
		week: "W1",
		attendance: 96,
		confidence: 4.2
	},
	{
		week: "W2",
		attendance: 93,
		confidence: 4.4
	},
	{
		week: "W3",
		attendance: 91,
		confidence: 4.6
	},
	{
		week: "W4",
		attendance: 89,
		confidence: 4.9
	},
	{
		week: "W5",
		attendance: 85,
		confidence: 5.1
	},
	{
		week: "W6",
		attendance: 82,
		confidence: 5.3
	},
	{
		week: "W7",
		attendance: 80,
		confidence: 5.6
	},
	{
		week: "W8",
		attendance: 78,
		confidence: 5.8
	},
	{
		week: "W9",
		attendance: 77,
		confidence: 6
	},
	{
		week: "W10",
		attendance: 76,
		confidence: 6.2
	},
	{
		week: "W11",
		attendance: 75,
		confidence: 6.3
	},
	{
		week: "W12",
		attendance: 74,
		confidence: 6.4
	}
];
function getProjectInsights(t) {
	return {
		executiveSummary: t("projectInsights.executiveSummary"),
		keyFindings: t("projectInsights.keyFindings", { returnObjects: true }),
		interestingPatterns: t("projectInsights.interestingPatterns", { returnObjects: true }),
		evidenceGaps: t("projectInsights.evidenceGaps", { returnObjects: true }),
		recommendations: t("projectInsights.recommendations", { returnObjects: true }),
		privacy: t("projectInsights.privacy", { returnObjects: true })
	};
}
//#endregion
export { getKeyMetrics as a, getSchema as c, getCompletionByAgeGroup as i, trendsByWeek as l, datasetOverview as n, getMentorMatching as o, getAttendanceDistribution as r, getProjectInsights as s, confidenceImprovement as t };
