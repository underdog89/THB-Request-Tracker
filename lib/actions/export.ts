"use server";

import { getRequests, type RequestFilters } from "./requests";
import { FIELD_LABELS } from "../enums";

const CSV_COLUMNS = [
  "item",
  "type",
  "contract",
  "unit",
  "platform",
  "implStatus",
  "inPipelineOrLive",
  "originalScope",
  "inContract",
  "chargeable",
  "notChargeableReason",
  "chargeType",
  "commercialStage",
  "commercialNotes",
  "remarks",
  "createdAt",
  "updatedAt",
] as const;

export async function buildCSV(filters: RequestFilters): Promise<string> {
  const requests = await getRequests(filters);

  const headers = [
    "Account",
    ...CSV_COLUMNS.map((col) => FIELD_LABELS[col] ?? col),
  ];

  const rows = requests.map((r) => [
    r.account?.name ?? "",
    ...CSV_COLUMNS.map((col) => {
      const val = (r as Record<string, unknown>)[col];
      if (val instanceof Date) return val.toISOString();
      return val ?? "";
    }),
  ]);

  const escape = (v: unknown) => {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const lines = [headers, ...rows].map((row) => row.map(escape).join(","));
  return lines.join("\n");
}
