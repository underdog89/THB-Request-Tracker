"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  COMMERCIAL_STAGE_COLORS,
  CHARGEABLE_COLORS,
  FIELD_LABELS,
  IN_CONTRACT_OPTIONS,
  CHARGEABLE_OPTIONS,
} from "@/lib/enums";
import { updateRequest } from "@/lib/actions/requests";
import { resolveOptions } from "@/lib/config";
import { useRouter } from "next/navigation";
import type { Request, Account, AccountConfig } from "@prisma/client";

type FullRequest = Request & {
  account: Account & { config: AccountConfig | null };
};

interface CommercialPanelProps {
  request: FullRequest;
  accountSlug?: string;
}

export function CommercialPanel({ request }: CommercialPanelProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [values, setValues] = useState({
    inContract: request.inContract ?? "",
    chargeable: request.chargeable,
    notChargeableReason: request.notChargeableReason ?? "",
    chargeType: request.chargeType ?? "",
    commercialStage: request.commercialStage ?? "",
    commercialNotes: request.commercialNotes ?? "",
  });

  const config = request.account.config;
  const chargeTypeOptions = resolveOptions(config, "chargeType");
  const notChargeableReasonOptions = resolveOptions(config, "notChargeableReason");
  const commercialStageOptions = resolveOptions(config, "commercialStage");

  async function handleSave() {
    setSaving(true);
    const clean = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === "" ? null : v])
    );
    await updateRequest(request.id, clean as Parameters<typeof updateRequest>[1]);
    setSaving(false);
    setEditing(false);
    router.refresh();
  }

  const Row = ({
    label,
    value,
    colorMap,
  }: {
    label: string;
    value: string | null | undefined;
    colorMap?: Record<string, string>;
  }) => (
    <div className="flex items-start py-2 border-b border-gray-50 last:border-0">
      <span className="w-40 shrink-0 text-xs text-gray-500">{label}</span>
      <span className="text-sm text-gray-900 flex-1">
        {value ? (
          colorMap ? (
            <Badge className={colorMap[value] ?? "bg-gray-100 text-gray-600"}>{value}</Badge>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </span>
    </div>
  );

  const selectField = (
    key: keyof typeof values,
    opts: string[],
    placeholder = ""
  ) => (
    <select
      value={values[key]}
      onChange={(e) =>
        setValues((v) => ({ ...v, [key]: e.target.value }))
      }
      className="flex h-8 w-full rounded border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Commercial</CardTitle>
          {!editing && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!editing ? (
          <div>
            <Row label={FIELD_LABELS.inContract} value={request.inContract} />
            <Row
              label={FIELD_LABELS.chargeable}
              value={request.chargeable}
              colorMap={CHARGEABLE_COLORS}
            />
            {request.chargeable === "No" && (
              <Row
                label={FIELD_LABELS.notChargeableReason}
                value={request.notChargeableReason}
              />
            )}
            {(request.chargeable === "Yes" || request.chargeable === "TBD") && (
              <Row label={FIELD_LABELS.chargeType} value={request.chargeType} />
            )}
            <Row
              label={FIELD_LABELS.commercialStage}
              value={request.commercialStage}
              colorMap={COMMERCIAL_STAGE_COLORS}
            />
            {request.commercialNotes && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Commercial Notes</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {request.commercialNotes}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">In Contract?</label>
              {selectField("inContract", IN_CONTRACT_OPTIONS, "—")}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Chargeable?</label>
              {selectField("chargeable", CHARGEABLE_OPTIONS)}
            </div>

            {values.chargeable === "No" && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  If Not Chargeable — Reason
                </label>
                {selectField(
                  "notChargeableReason",
                  notChargeableReasonOptions,
                  "Select reason..."
                )}
              </div>
            )}

            {(values.chargeable === "Yes" || values.chargeable === "TBD") && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  If Chargeable — Charge Type
                </label>
                {selectField("chargeType", chargeTypeOptions, "Select...")}
              </div>
            )}

            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Commercial Stage
              </label>
              {selectField("commercialStage", commercialStageOptions, "Select stage...")}
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Commercial Notes</label>
              <textarea
                value={values.commercialNotes}
                onChange={(e) =>
                  setValues((v) => ({ ...v, commercialNotes: e.target.value }))
                }
                rows={3}
                className="flex w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
