import { getAccounts } from "@/lib/actions/accounts";
import { RequestForm } from "@/components/requests/RequestForm";

export default async function NewRequestPage() {
  const accounts = await getAccounts();

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No accounts found. Please create an account first.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Request</h1>
      <RequestForm accounts={accounts} redirectOnSuccess="/all/requests" />
    </div>
  );
}
