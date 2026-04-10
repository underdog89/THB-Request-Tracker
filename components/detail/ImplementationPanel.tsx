"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IMPL_STATUS_COLORS, PRIORITY_OPTIONS, PRIORITY_COLORS, FIELD_LABELS } from "@/lib/enums";
import { updateRequest } from "@/lib/actions/requests";
import { useRouter } from "next/navigation";
import type { Request, Account, AccountConfig } from "@prisma/client";
import { resolveOptions } from "@/lib/config";
import { ORIGINAL_SCOPE_OPTIONS, IN_PIPELINE_OR_LIVE_OPTIONS } from "@/lib/enums";

type FullRequest = Request & {
  account: Account & { config: AccountConfig | null };
};

interface ImplementationPanelProps {
  request: FullRequest;
  accountSlug?: string;
}

export function ImplementationPanel({ request, accountSlug: _slug }: ImplementationPanelProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [values, setValues] = useState({
    type: request.type,
    priority: request.priority ?? "",
    contract: request.contract ?? "",
    unit: request.unit ?? "",
    platform: request.platform ?? "",
    implStatus: request.implStatus,
    inPipelineOrLive: request.inPipelineOrLive ?? "",
    originalScope: request.originalScope,
    remarks: request.remarks ?? "",
  });

  const config = request.account.config;
  const typeOptions = resolveOptions(config, "type");
  const platformOptions = resolveOptions(config, "platform");
  const contractOptions = resolveOptions(config, "contract");
  const unitOptions = resolveOptions(config, "unit");
  const implStatusOptions = resolveOptions(config, "implStatus");

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

  const Row = ({ label, value, colorMap }: { label: string; value: string | null | undefined; colorMap?: Record<string, string> }) => (
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

  const selectField = (key: keyof typeof values, opts: string[], placeholder = "") => (
    <select
      value={values[key]}
      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
      className="flex h-8 w-full rounded border border-gray-300 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Implementation</CardTitle>
          {!editing && (
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-base font-semibold text-gray-900 mb-4">{request.item}</h2>

        {!editing ? (
          <div>
            <Row label={FIELD_LABELS.type} value={request.type} />
            <Row label={FIELD_LABELS.contract} value={request.contract} />
            <Row label={FIELD_LABELS.unit} value={request.unit} />
            <Row label={FIELD_LABELS.platform} value={request.platform} />
            <Row label={FIELD_LABELS.implStatus} value={request.implStatus} colorMap={IMPL_STATUS_COLORS} />
            <Row label={FIELD_LABELS.priority} value={request.priority} colorMap={PRIORITY_COLORS} />
            <Row label={FIELD_LABELS.inPipelineOrLive} value={request.inPipelineOrLive} />
            <Row label={FIELD_LABELS.originalScope} value={request.originalScope} />
            {request.remarks && (
              <div className="pt-2">
                <p className="text-xs text-gray-500 mb-1">Remarks</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.remarks}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Type</label>
              {selectField("type", typeOptions)}
            </div>
            {contractOptions.length > 0 && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Contract</label>
                {selectField("contract", contractOptions, "—")}
              </div>
            )}
            {unitOptions.length > 0 && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Unit</label>
                {selectField("unit", unitOptions, "—")}
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Platform</label>
              {selectField("platform", platformOptions, "—")}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Impl. Status</label>
              {selectField("implStatus", implStatusOptions)}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Priority</label>
              {selectField("priority", PRIORITY_OPTIONS, "—")}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">In Pipeline / Live</label>
              {selectField("inPipelineOrLive", IN_PIPELINE_OR_LIVE_OPTIONS, "Auto")}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Original Scope</label>
              {selectField("originalScope", ORIGINAL_SCOPE_OPTIONS)}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Remarks</label>
              <textarea
                value={values.remarks}
                onChange={(e) => setValues((v) => ({ ...v, remarks: e.target.value }))}
                rows={2}
                className="flex w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
