import { getRequests } from "@/lib/actions/requests";
import { getAccounts } from "@/lib/actions/accounts";
import { RequestTable } from "@/components/requests/RequestTable";
import { FilterBar } from "@/components/requests/FilterBar";
import { ExportButton } from "@/components/requests/ExportButton";
import {
  IMPL_STATUS_OPTIONS,
  CHARGEABLE_OPTIONS,
  COMMERCIAL_STAGE_OPTIONS,
  TYPE_OPTIONS,
} from "@/lib/enums";
import Link from "next/link";

interface PageProps {
  searchParams: {
    implStatus?: string;
    chargeable?: string;
    commercialStage?: string;
    type?: string;
    contract?: string;
    unit?: string;
    originalScope?: string;
    q?: string;
    sort?: string;
    dir?: string;
  };
}

export default async function AllRequestsPage({ searchParams }: PageProps) {
  const filters = {
    implStatus: searchParams.implStatus,
    chargeable: searchParams.chargeable,
    commercialStage: searchParams.commercialStage,
    type: searchParams.type,
    contract: searchParams.contract,
    unit: searchParams.unit,
    originalScope: searchParams.originalScope,
    q: searchParams.q,
    sort: searchParams.sort,
    dir: searchParams.dir as "asc" | "desc" | undefined,
  };

  const [requests, accounts] = await Promise.all([
    getRequests(filters),
    getAccounts(),
  ]);

  // Derive unique contract/unit values across all visible requests for the global filter
  const allContracts = Array.from(new Set(requests.map((r) => r.contract).filter(Boolean))) as string[];
  const allUnits = Array.from(new Set(requests.map((r) => r.unit).filter(Boolean))) as string[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">All Requests</h1>
        <div className="flex gap-2">
          <ExportButton filters={filters} />
          <Link
            href="/all/requests/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Request
          </Link>
        </div>
      </div>

      <FilterBar
        implStatusOptions={IMPL_STATUS_OPTIONS}
        chargeableOptions={CHARGEABLE_OPTIONS}
        commercialStageOptions={COMMERCIAL_STAGE_OPTIONS}
        typeOptions={TYPE_OPTIONS}
        contractOptions={allContracts}
        unitOptions={allUnits}
        accounts={accounts}
        currentFilters={searchParams}
        showAccountFilter
      />

      <RequestTable requests={requests} baseHref="/all/requests" showAccount />
    </div>
  );
}
