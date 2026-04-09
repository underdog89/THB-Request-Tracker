import { notFound } from "next/navigation";
import { getAccountBySlug } from "@/lib/actions/accounts";
import { getRequests } from "@/lib/actions/requests";
import { resolveOptions } from "@/lib/config";
import { RequestTable } from "@/components/requests/RequestTable";
import { FilterBar } from "@/components/requests/FilterBar";
import { ExportButton } from "@/components/requests/ExportButton";
import { CHARGEABLE_OPTIONS } from "@/lib/enums";
import Link from "next/link";

interface PageProps {
  params: { account: string };
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

const RESERVED = ["all", "api", "_next", "favicon.ico"];

export default async function AccountRequestsPage({ params, searchParams }: PageProps) {
  if (RESERVED.includes(params.account)) notFound();

  const account = await getAccountBySlug(params.account);
  if (!account) notFound();

  const filters = {
    accountId: account.id,
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

  const requests = await getRequests(filters);

  const implStatusOptions = resolveOptions(account.config, "implStatus");
  const commercialStageOptions = resolveOptions(account.config, "commercialStage");
  const typeOptions = resolveOptions(account.config, "type");
  const contractOptions = resolveOptions(account.config, "contract");
  const unitOptions = resolveOptions(account.config, "unit");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/${account.slug}`} className="hover:underline font-medium text-gray-900">
            {account.name}
          </Link>
          <span>/</span>
          <span>Requests</span>
        </div>
        <div className="flex gap-2">
          <ExportButton filters={filters} />
          <Link
            href={`/${account.slug}/requests/new`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Request
          </Link>
        </div>
      </div>

      <FilterBar
        implStatusOptions={implStatusOptions}
        chargeableOptions={CHARGEABLE_OPTIONS}
        commercialStageOptions={commercialStageOptions}
        typeOptions={typeOptions}
        contractOptions={contractOptions}
        unitOptions={unitOptions}
        currentFilters={searchParams}
      />

      <RequestTable
        requests={requests}
        baseHref={`/${account.slug}/requests`}
      />
    </div>
  );
}
