import { notFound } from "next/navigation";
import { getRequest } from "@/lib/actions/requests";
import { getAccountBySlug } from "@/lib/actions/accounts";
import { ImplementationPanel } from "@/components/detail/ImplementationPanel";
import { CommercialPanel } from "@/components/detail/CommercialPanel";
import { AuditLog } from "@/components/detail/AuditLog";
import { DeleteRequestButton } from "@/components/detail/DeleteRequestButton";
import Link from "next/link";

interface PageProps {
  params: { account: string; id: string };
}

const RESERVED = ["all", "api", "_next", "favicon.ico"];

export default async function RequestDetailPage({ params }: PageProps) {
  if (RESERVED.includes(params.account)) notFound();

  const [request, account] = await Promise.all([
    getRequest(params.id),
    getAccountBySlug(params.account),
  ]);

  if (!request || !account) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/${account.slug}`} className="hover:underline text-gray-900 font-medium">
            {account.name}
          </Link>
          <span>/</span>
          <Link href={`/${account.slug}/requests`} className="hover:underline">
            Requests
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">{request.item}</span>
        </div>
        <DeleteRequestButton
          requestId={request.id}
          requestItem={request.item}
          redirectTo={`/${account.slug}/requests`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImplementationPanel request={request} accountSlug={account.slug} />
        <CommercialPanel request={request} accountSlug={account.slug} />
      </div>

      <AuditLog history={request.statusHistory} />
    </div>
  );
}
