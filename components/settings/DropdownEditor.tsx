"use client";

import { useState } from "react";
import { X, Plus, RotateCcw } from "lucide-react";
import { updateAccountConfig } from "@/lib/actions/accounts";
import { useRouter } from "next/navigation";

interface DropdownEditorProps {
  accountId: string;
  fieldKey: string;
  label: string;
  currentValues: string[];
  hasAccountOverride: boolean;
}

type ConfigArrayKey =
  | "typeOptions"
  | "platformOptions"
  | "contractOptions"
  | "unitOptions"
  | "implStatusOptions"
  | "chargeTypeOptions"
  | "notChargeableReasonOptions"
  | "commercialStageOptions";

const FIELD_KEY_MAP: Record<string, ConfigArrayKey> = {
  type: "typeOptions",
  platform: "platformOptions",
  contract: "contractOptions",
  unit: "unitOptions",
  implStatus: "implStatusOptions",
  chargeType: "chargeTypeOptions",
  notChargeableReason: "notChargeableReasonOptions",
  commercialStage: "commercialStageOptions",
};

export function DropdownEditor({
  accountId,
  fieldKey,
  label,
  currentValues,
  hasAccountOverride,
}: DropdownEditorProps) {
  const [values, setValues] = useState(currentValues);
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();

  function add() {
    const trimmed = newValue.trim();
    if (!trimmed || values.includes(trimmed)) return;
    setValues((v) => [...v, trimmed]);
    setNewValue("");
    setDirty(true);
  }

  function remove(val: string) {
    setValues((v) => v.filter((x) => x !== val));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    const configKey = FIELD_KEY_MAP[fieldKey];
    await updateAccountConfig(accountId, { [configKey]: values });
    setSaving(false);
    setDirty(false);
    router.refresh();
  }

  async function resetToGlobal() {
    setSaving(true);
    const configKey = FIELD_KEY_MAP[fieldKey];
    await updateAccountConfig(accountId, { [configKey]: [] });
    setSaving(false);
    setDirty(false);
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <div className="flex items-center gap-2">
          {hasAccountOverride && (
            <button
              onClick={resetToGlobal}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700"
              title="Reset to global defaults"
            >
              <RotateCcw className="h-3 w-3" />
              Reset to defaults
            </button>
          )}
          {!hasAccountOverride && (
            <span className="text-xs text-gray-400 italic">Using global defaults</span>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {values.map((val) => (
          <span
            key={val}
            className="flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs text-blue-700"
          >
            {val}
            <button
              onClick={() => remove(val)}
              className="text-blue-400 hover:text-blue-700"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <span className="text-xs text-gray-400">No options configured</span>
        )}
      </div>

      {/* Add new */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="Add option..."
          className="flex-1 h-7 rounded border border-gray-300 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={add}
          className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
        {dirty && (
          <button
            onClick={save}
            disabled={saving}
            className="rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}
