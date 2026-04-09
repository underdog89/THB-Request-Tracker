import { notFound } from "next/navigation";
import { getAccountBySlug } from "@/lib/actions/accounts";
import { DropdownEditor } from "@/components/settings/DropdownEditor";
import { FieldRulesTable } from "@/components/settings/FieldRulesTable";
import { resolveOptions, resolveAllFieldRules } from "@/lib/config";
import Link from "next/link";
import { FIELD_LABELS } from "@/lib/enums";

interface PageProps {
  params: { account: string };
}

const RESERVED = ["all", "api", "_next", "favicon.ico"];

const CONFIGURABLE_DROPDOWNS = [
  { key: "contract" as const, label: "Contract" },
  { key: "unit" as const, label: "Unit" },
  { key: "type" as const, label: "Type" },
  { key: "platform" as const, label: "Platform" },
  { key: "implStatus" as const, label: "Impl. Status" },
  { key: "chargeType" as const, label: "Charge Type" },
  { key: "notChargeableReason" as const, label: "Not Chargeable Reason" },
  { key: "commercialStage" as const, label: "Commercial Stage" },
];

const CONFIGURABLE_FIELDS = [
  "item",
  "type",
  "contract",
  "unit",
  "platform",
  "implStatus",
  "inPipelineOrLive",
  "originalScope",
  "inContract",
  "chargeable",
  "notChargeableReason",
  "chargeType",
  "commercialStage",
  "commercialNotes",
  "remarks",
];

export default async function AccountSettingsPage({ params }: PageProps) {
  if (RESERVED.includes(params.account)) notFound();

  const account = await getAccountBySlug(params.account);
  if (!account) notFound();

  const fieldRules = resolveAllFieldRules(account.config);

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href={`/${account.slug}`} className="hover:underline text-gray-900 font-medium">
          {account.name}
        </Link>
        <span>/</span>
        <span>Settings</span>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Dropdown Values</h2>
        <p className="text-sm text-gray-500">
          Configure the available options for each dropdown field for this account.
          Leave empty to use global defaults.
        </p>
        <div className="space-y-4">
          {CONFIGURABLE_DROPDOWNS.map(({ key, label }) => (
            <DropdownEditor
              key={key}
              accountId={account.id}
              fieldKey={key}
              label={label}
              currentValues={resolveOptions(account.config, key)}
              hasAccountOverride={
                account.config
                  ? (JSON.parse(
                      (account.config as Record<string, string>)[`${key}Options`] ?? "[]"
                    ) as string[]).length > 0
                  : false
              }
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Field Rules</h2>
        <p className="text-sm text-gray-500">
          Control which fields are visible and required for this account.
        </p>
        <FieldRulesTable
          accountId={account.id}
          fields={CONFIGURABLE_FIELDS.map((f) => ({
            key: f,
            label: FIELD_LABELS[f] ?? f,
            rule: fieldRules[f] ?? { hidden: false, required: false },
          }))}
        />
      </section>
    </div>
  );
}
