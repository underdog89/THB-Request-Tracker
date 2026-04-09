import { notFound } from "next/navigation";
import { getAccountBySlug, getAccounts } from "@/lib/actions/accounts";
import { RequestForm } from "@/components/requests/RequestForm";

interface PageProps {
  params: { account: string };
}

const RESERVED = ["all", "api", "_next", "favicon.ico"];

export default async function NewRequestPage({ params }: PageProps) {
  if (RESERVED.includes(params.account)) notFound();

  const [account, accounts] = await Promise.all([
    getAccountBySlug(params.account),
    getAccounts(),
  ]);
  if (!account) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Request — {account.name}</h1>
      <RequestForm
        accounts={accounts}
        defaultAccountId={account.id}
        accountConfig={account.config}
        redirectOnSuccess={`/${account.slug}/requests`}
      />
    </div>
  );
}
