import { notFound } from "next/navigation";
import { getAccountBySlug } from "@/lib/actions/accounts";
import { getDashboardStats } from "@/lib/actions/requests";
import { KPICards } from "@/components/dashboard/KPICards";
import { StatusBarChart } from "@/components/dashboard/StatusBarChart";
import { ChargeablePie } from "@/components/dashboard/ChargeablePie";
import { CommercialFunnel } from "@/components/dashboard/CommercialFunnel";
import { UnitBreakdown } from "@/components/dashboard/UnitBreakdown";
import { ContractBreakdown } from "@/components/dashboard/ContractBreakdown";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { TypeLimitChart } from "@/components/dashboard/TypeLimitChart";
import { resolveOptions } from "@/lib/config";
import Link from "next/link";

interface PageProps {
  params: { account: string };
  searchParams: { scope?: string; unit?: string; contract?: string };
}

const RESERVED = ["all", "api", "_next", "favicon.ico"];

export default async function AccountDashboard({ params, searchParams }: PageProps) {
  if (RESERVED.includes(params.account)) notFound();

  const account = await getAccountBySlug(params.account);
  if (!account) notFound();

  // Default to "New request" scope; "all" shows everything; "original" shows original scope
  const scope = searchParams.scope ?? "new";
  const originalScopeFilter =
    scope === "new" ? "New request" :
    scope === "original" ? "Original" :
    "all";

  const unit = searchParams.unit;
  const contract = searchParams.contract;

  const stats = await getDashboardStats(
    account.id,
    originalScopeFilter as "New request" | "Original" | "all",
    unit,
    contract,
  );

  const unitOptions = resolveOptions(account.config, "unit");
  const contractOptions = resolveOptions(account.config, "contract");

  const scopeLabel =
    scope === "new" ? "New Requests" :
    scope === "original" ? "Original Scope Items" :
    "All Items";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Dashboard — <span className="font-medium text-gray-700">{scopeLabel}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${account.slug}/settings`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Settings
          </Link>
          <Link
            href={`/${account.slug}/requests`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            View Requests
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <DashboardControls scope={scope} />
        <DashboardFilters unitOptions={unitOptions} contractOptions={contractOptions} />
      </div>

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

      {(stats.carePathwaysByUnit.length > 0 || stats.carePathwaysByContract.length > 0) && (
        <TypeLimitChart
          typeName="Care Pathway"
          unitData={stats.carePathwaysByUnit}
          contractData={stats.carePathwaysByContract}
        />
      )}

      {(stats.counsellorByUnit.length > 0 || stats.counsellorByContract.length > 0) && (
        <TypeLimitChart
          typeName="Counsellor Use Case"
          unitData={stats.counsellorByUnit}
          contractData={stats.counsellorByContract}
        />
      )}
    </div>
  );
}
