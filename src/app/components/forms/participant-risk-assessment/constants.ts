export const RISK_LEVEL_DETAILS: Record<
  "Low" | "Moderate" | "High" | "Critical",
  { level: string; description: string; criteria: string; impact: string }
> = {
  Low: {
    level: "Low",
    description: "Minimal impact, stable environment",
    criteria: "Routine support required",
    impact: "Negligible health/safety impact"
  },
  Moderate: {
    level: "Moderate",
    description: "Some risk factors present",
    criteria: "Supervision or occasional support needed",
    impact: "Possible discomfort or risk if unmanaged"
  },
  High: {
    level: "High",
    description: "Significant risk or ongoing concerns",
    criteria: "Continuous monitoring required",
    impact: "Likely to cause moderate health/safety risk"
  },
  Critical: {
    level: "Critical",
    description: "Severe, unmanaged risk environment",
    criteria: "Emergency protocols and escalation required",
    impact: "Severe threat to health and safety"
  }
};


