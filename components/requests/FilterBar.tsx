"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback } from "react";
import type { Account } from "@prisma/client";

interface FilterBarProps {
  implStatusOptions: string[];
  chargeableOptions: string[];
  commercialStageOptions: string[];
  typeOptions: string[];
  contractOptions?: string[];
  unitOptions?: string[];
  accounts?: Account[];
  currentFilters: Record<string, string | undefined>;
  showAccountFilter?: boolean;
}

export function FilterBar({
  implStatusOptions,
  chargeableOptions,
  commercialStageOptions,
  typeOptions,
  contractOptions = [],
  unitOptions = [],
  accounts = [],
  currentFilters,
  showAccountFilter = false,
}: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 on filter change
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  const hasFilters = Object.values(currentFilters).some(Boolean);

  const filterSelect = (key: string, label: string, options: string[]) => (
    <select
      value={currentFilters[key] ?? ""}
      onChange={(e) => updateFilter(key, e.target.value)}
      className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search item..."
          value={currentFilters.q ?? ""}
          onChange={(e) => updateFilter("q", e.target.value)}
          className="h-8 rounded-md border border-gray-300 bg-white pl-7 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-44"
        />
      </div>

      {showAccountFilter && accounts.length > 0 && filterSelect(
        "accountId",
        "All Accounts",
        accounts.map((a) => a.name)
      )}

      {filterSelect("originalScope", "All Scopes", ["New request", "Original"])}
      {filterSelect("type", "All Types", typeOptions)}
      {contractOptions.length > 0 && filterSelect("contract", "All Contracts", contractOptions)}
      {unitOptions.length > 0 && filterSelect("unit", "All Units", unitOptions)}
      {filterSelect("implStatus", "All Statuses", implStatusOptions)}
      {filterSelect("priority", "All Priorities", ["High", "Medium", "Low"])}
      {filterSelect("chargeable", "All Chargeable", chargeableOptions)}
      {filterSelect("commercialStage", "All Stages", commercialStageOptions)}

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      )}
    </div>
  );
}
