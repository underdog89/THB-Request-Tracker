"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  IMPL_STATUS_COLORS,
  COMMERCIAL_STAGE_COLORS,
  CHARGEABLE_COLORS,
  PRIORITY_COLORS,
} from "@/lib/enums";
import type { Request, Account } from "@prisma/client";

type RequestWithAccount = Request & { account: Account };

interface RequestTableProps {
  requests: RequestWithAccount[];
  baseHref: string;
  showAccount?: boolean;
}

const COLUMNS = [
  { key: "item", label: "Item" },
  { key: "type", label: "Type" },
  { key: "contract", label: "Contract" },
  { key: "unit", label: "Unit" },
  { key: "implStatus", label: "Impl. Status" },
  { key: "priority", label: "Priority" },
  { key: "chargeable", label: "Chargeable?" },
  { key: "commercialStage", label: "Commercial Stage" },
  { key: "createdAt", label: "Created" },
];

export function RequestTable({ requests, baseHref, showAccount = false }: RequestTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";
  const currentDir = (searchParams.get("dir") ?? "asc") as "asc" | "desc";

  function handleSort(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort === key) {
      params.set("dir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("sort", key);
      params.set("dir", "asc");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function SortIcon({ col }: { col: string }) {
    if (currentSort !== col) return <ChevronsUpDown className="h-3 w-3 text-gray-400" />;
    return currentDir === "asc" ? (
      <ChevronUp className="h-3 w-3 text-blue-500" />
    ) : (
      <ChevronDown className="h-3 w-3 text-blue-500" />
    );
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center text-sm text-gray-400">
        No requests found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              #
            </th>
            {showAccount && (
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
            )}
            {COLUMNS.map(({ key, label }) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                onClick={() => handleSort(key)}
              >
                <span className="flex items-center gap-1">
                  {label}
                  <SortIcon col={key} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req, idx) => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap w-10">
                {idx + 1}
              </td>
              {showAccount && (
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {req.account.name}
                </td>
              )}
              <td className="px-4 py-3 text-sm font-medium text-gray-900 w-80 max-w-sm">
                <Link
                  href={`${baseHref}/${req.id}`}
                  className="hover:text-blue-600 hover:underline"
                >
                  {req.item}
                </Link>
                <div className="mt-0.5">
                  <Badge
                    className={
                      req.originalScope === "New request"
                        ? "bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0"
                        : "bg-gray-100 text-gray-400 text-[10px] px-1.5 py-0"
                    }
                  >
                    {req.originalScope === "New request" ? "New" : "Original"}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{req.type}</td>
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{req.contract ?? "—"}</td>
              <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{req.unit ?? "—"}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge className={IMPL_STATUS_COLORS[req.implStatus] ?? "bg-gray-100 text-gray-600"}>
                  {req.implStatus}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {req.priority ? (
                  <Badge className={PRIORITY_COLORS[req.priority] ?? "bg-gray-100 text-gray-600"}>
                    {req.priority}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge className={CHARGEABLE_COLORS[req.chargeable] ?? "bg-gray-100 text-gray-600"}>
                  {req.chargeable}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {req.commercialStage ? (
                  <Badge className={COMMERCIAL_STAGE_COLORS[req.commercialStage] ?? "bg-gray-100 text-gray-600"}>
                    {req.commercialStage}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                {new Date(req.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400">
        {requests.length} item{requests.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
