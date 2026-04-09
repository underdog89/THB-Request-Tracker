"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { buildCSV } from "@/lib/actions/export";
import type { RequestFilters } from "@/lib/actions/requests";

interface ExportButtonProps {
  filters: RequestFilters;
}

export function ExportButton({ filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const csv = await buildCSV(filters);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `requests-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
    >
      <Download className="h-4 w-4" />
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  );
}
