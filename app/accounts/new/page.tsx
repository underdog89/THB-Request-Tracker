import { NewAccountForm } from "@/components/accounts/NewAccountForm";

export default function NewAccountPage() {
  return (
    <div className="max-w-md mx-auto space-y-4 pt-8">
      <h1 className="text-xl font-semibold text-gray-900">Add New Account</h1>
      <p className="text-sm text-gray-500">
        Create a new client account. You can configure its dropdown values and field rules from the account Settings page after creation.
      </p>
      <NewAccountForm />
    </div>
  );
}
