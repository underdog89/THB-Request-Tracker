"use client";

import { useState } from "react";
import { updateAccountConfig } from "@/lib/actions/accounts";
import { useRouter } from "next/navigation";
import type { FieldRule } from "@/lib/config";

interface FieldEntry {
  key: string;
  label: string;
  rule: FieldRule;
}

interface FieldRulesTableProps {
  accountId: string;
  fields: FieldEntry[];
}

export function FieldRulesTable({ accountId, fields }: FieldRulesTableProps) {
  const [rules, setRules] = useState<Record<string, FieldRule>>(
    Object.fromEntries(fields.map((f) => [f.key, f.rule]))
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  function toggle(fieldKey: string, prop: "hidden" | "required") {
    setRules((prev) => ({
      ...prev,
      [fieldKey]: {
        ...prev[fieldKey],
        [prop]: !prev[fieldKey]?.[prop],
      },
    }));
  }

  async function save() {
    setSaving(true);
    await updateAccountConfig(accountId, { fieldRules: rules });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <table className="min-w-full divide-y divide-gray-100">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Field</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Hidden</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Required</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {fields.map(({ key, label }) => (
            <tr key={key} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{label}</td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={rules[key]?.hidden ?? false}
                  onChange={() => toggle(key, "hidden")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={rules[key]?.required ?? false}
                  onChange={() => toggle(key, "required")}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-gray-100 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Field Rules"}
        </button>
      </div>
    </div>
  );
}
