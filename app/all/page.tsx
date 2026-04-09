import { getDashboardStats } from "@/lib/actions/requests";
import { KPICards } from "@/components/dashboard/KPICards";
import { StatusBarChart } from "@/components/dashboard/StatusBarChart";
import { ChargeablePie } from "@/components/dashboard/ChargeablePie";
import { CommercialFunnel } from "@/components/dashboard/CommercialFunnel";
import { UnitBreakdown } from "@/components/dashboard/UnitBreakdown";
import { ContractBreakdown } from "@/components/dashboard/ContractBreakdown";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import Link from "next/link";

interface PageProps {
  searchParams: { scope?: string };
}

export default async function AllDashboard({ searchParams }: PageProps) {
  const scope = searchParams.scope ?? "new";
  const originalScopeFilter =
    scope === "new" ? "New request" :
    scope === "original" ? "Original" :
    "all";

  const stats = await getDashboardStats(undefined, originalScopeFilter as "New request" | "Original" | "all");

  const scopeLabel =
    scope === "new" ? "New Requests" :
    scope === "original" ? "Original Scope Items" :
    "All Items";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aggregated view — <span className="font-medium text-gray-700">{scopeLabel}</span>
          </p>
        </div>
        <Link
          href="/all/requests"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          View All Requests
        </Link>
      </div>

      <DashboardControls scope={scope} />

      <KPICards stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusBarChart data={stats.implStatusBreakdown} />
        <ChargeablePie data={stats.chargeableBreakdown} />
      </div>

      {(stats.contractBreakdown.length > 0 || stats.unitBreakdown.length > 0) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ContractBreakdown
            data={stats.contractBreakdown}
            chargeableData={stats.contractBreakdownChargeable}
          />
          <UnitBreakdown
            data={stats.unitBreakdown}
            chargeableData={stats.unitBreakdownChargeable}
          />
        </div>
      )}

      <CommercialFunnel data={stats.commercialFunnel} />
    </div>
  );
}
