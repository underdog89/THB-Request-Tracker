"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface DashboardFiltersProps {
  unitOptions: string[];
  contractOptions: string[];
}

export function DashboardFilters({ unitOptions, contractOptions }: DashboardFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  if (unitOptions.length === 0 && contractOptions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {unitOptions.length > 0 && (
        <select
          value={searchParams.get("unit") ?? ""}
          onChange={(e) => setFilter("unit", e.target.value)}
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Units</option>
          {unitOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
      {contractOptions.length > 0 && (
        <select
          value={searchParams.get("contract") ?? ""}
          onChange={(e) => setFilter("contract", e.target.value)}
          className="h-8 rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Contracts</option>
          {contractOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}
    </div>
  );
}
