"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface DashboardControlsProps {
  scope: string;
}

export function DashboardControls({ scope }: DashboardControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setScope(val: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("scope", val);
    router.push(`${pathname}?${params.toString()}`);
  }

  const tabs = [
    { value: "new", label: "New Requests" },
    { value: "all", label: "All Items" },
    { value: "original", label: "Original Scope" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1 w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => setScope(tab.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
            scope === tab.value
              ? "bg-white text-blue-600 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
