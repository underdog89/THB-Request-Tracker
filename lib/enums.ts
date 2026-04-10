export const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

export const PRIORITY_COLORS: Record<string, string> = {
  High:   "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-blue-100 text-blue-700",
};

export const TYPE_OPTIONS = [
  "Care pathway",
  "Operating pathway",
  "Counsellor use case",
  "CRM workflow",
  "CRM change",
  "Dashboard",
  "New integration",
];

export const PLATFORM_OPTIONS = [
  "PEP",
  "Counsellor",
  "CRM",
  "Dashboard",
  "Multiple",
];

export const IMPL_STATUS_OPTIONS = [
  "New",
  "Scoping",
  "Dev",
  "UAT",
  "Live",
  "Closed",
  "To be picked up",
];

export const IN_PIPELINE_OR_LIVE_OPTIONS = ["Pipeline", "Live"];

export const ORIGINAL_SCOPE_OPTIONS = ["Original", "New request"];

export const IN_CONTRACT_OPTIONS = ["Yes", "No"];

export const CHARGEABLE_OPTIONS = ["Yes", "No", "TBD"];

export const NOT_CHARGEABLE_REASON_OPTIONS = [
  "Counts towards 10x pathways",
  "Counts towards 2 use cases",
  "THB Investment",
  "Charged as one-time — settled",
  "Offset with licensing",
];

export const CHARGE_TYPE_OPTIONS = [
  "Integration effort",
  "New feature / UI change",
  "New dashboard",
  "Configuration",
  "Licensing increase",
];

export const COMMERCIAL_STAGE_OPTIONS = [
  "Not started",
  "Scoping complete",
  "Estimate shared",
  "Sign-off received",
  "PO received",
  "Invoiced",
  "Closed",
];

// Contract options are account-specific — no global defaults
export const CONTRACT_OPTIONS: string[] = [];

// Unit options are account-specific — no global defaults
export const UNIT_OPTIONS: string[] = [];

// Map config field keys to global defaults
export const GLOBAL_ENUM_MAP: Record<string, string[]> = {
  type: TYPE_OPTIONS,
  platform: PLATFORM_OPTIONS,
  implStatus: IMPL_STATUS_OPTIONS,
  notChargeableReason: NOT_CHARGEABLE_REASON_OPTIONS,
  chargeType: CHARGE_TYPE_OPTIONS,
  commercialStage: COMMERCIAL_STAGE_OPTIONS,
  contract: CONTRACT_OPTIONS,
  unit: UNIT_OPTIONS,
};

// Fields that can be tracked in status history
export const TRACKED_FIELDS = [
  "priority",
  "implStatus",
  "inPipelineOrLive",
  "commercialStage",
  "chargeable",
  "inContract",
];

// Human-readable field labels
export const FIELD_LABELS: Record<string, string> = {
  item: "Item",
  priority: "Priority",
  type: "Type",
  contract: "Contract",
  unit: "Unit",
  platform: "Platform",
  implStatus: "Impl. Status",
  inPipelineOrLive: "In Pipeline / Live",
  originalScope: "Original Scope",
  inContract: "In Contract?",
  chargeable: "Chargeable?",
  notChargeableReason: "If Not Chargeable — Reason",
  chargeType: "If Chargeable — Charge Type",
  commercialStage: "Commercial Stage",
  commercialNotes: "Commercial Notes",
  remarks: "Remarks",
};

// Status colour mapping for badges
export const IMPL_STATUS_COLORS: Record<string, string> = {
  New: "bg-slate-100 text-slate-700",
  Scoping: "bg-yellow-100 text-yellow-700",
  Dev: "bg-blue-100 text-blue-700",
  UAT: "bg-purple-100 text-purple-700",
  Live: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-500",
  "To be picked up": "bg-orange-100 text-orange-700",
};

export const COMMERCIAL_STAGE_COLORS: Record<string, string> = {
  "Not started": "bg-slate-100 text-slate-700",
  "Scoping complete": "bg-yellow-100 text-yellow-700",
  "Estimate shared": "bg-blue-100 text-blue-700",
  "Sign-off received": "bg-purple-100 text-purple-700",
  "PO received": "bg-indigo-100 text-indigo-700",
  Invoiced: "bg-emerald-100 text-emerald-700",
  Closed: "bg-gray-100 text-gray-500",
};

export const CHARGEABLE_COLORS: Record<string, string> = {
  Yes: "bg-green-100 text-green-700",
  No: "bg-gray-100 text-gray-500",
  TBD: "bg-yellow-100 text-yellow-700",
};
