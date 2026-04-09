import { notFound } from "next/navigation";
import { getRequest } from "@/lib/actions/requests";
import { ImplementationPanel } from "@/components/detail/ImplementationPanel";
import { CommercialPanel } from "@/components/detail/CommercialPanel";
import { AuditLog } from "@/components/detail/AuditLog";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

export default async function RequestDetailPage({ params }: PageProps) {
  const request = await getRequest(params.id);
  if (!request) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/all/requests" className="hover:underline">
          All Requests
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{request.item}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImplementationPanel request={request} />
        <CommercialPanel request={request} />
      </div>

      <AuditLog history={request.statusHistory} />
    </div>
  );
}
