"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createRequest, updateRequest } from "@/lib/actions/requests";
import { resolveOptions } from "@/lib/config";
import {
  ORIGINAL_SCOPE_OPTIONS,
  IN_CONTRACT_OPTIONS,
  CHARGEABLE_OPTIONS,
  IN_PIPELINE_OR_LIVE_OPTIONS,
} from "@/lib/enums";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Account, AccountConfig, Request } from "@prisma/client";

const schema = z.object({
  accountId: z.string().min(1, "Account is required"),
  item: z.string().min(1, "Item name is required"),
  type: z.string().min(1, "Type is required"),
  contract: z.string().optional(),
  unit: z.string().optional(),
  platform: z.string().optional(),
  implStatus: z.string().optional(),
  inPipelineOrLive: z.string().optional(),
  originalScope: z.string().optional(),
  inContract: z.string().optional(),
  chargeable: z.string().optional(),
  notChargeableReason: z.string().optional(),
  chargeType: z.string().optional(),
  commercialStage: z.string().optional(),
  commercialNotes: z.string().optional(),
  remarks: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RequestFormProps {
  accounts: Account[];
  defaultAccountId?: string;
  accountConfig?: AccountConfig | null;
  redirectOnSuccess: string;
  editRequest?: Request;
}

export function RequestForm({
  accounts,
  defaultAccountId,
  accountConfig,
  redirectOnSuccess,
  editRequest,
}: RequestFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: editRequest
      ? {
          accountId: editRequest.accountId,
          item: editRequest.item,
          type: editRequest.type,
          contract: editRequest.contract ?? "",
          unit: editRequest.unit ?? "",
          platform: editRequest.platform ?? "",
          implStatus: editRequest.implStatus,
          inPipelineOrLive: editRequest.inPipelineOrLive ?? "",
          originalScope: editRequest.originalScope,
          inContract: editRequest.inContract ?? "",
          chargeable: editRequest.chargeable,
          notChargeableReason: editRequest.notChargeableReason ?? "",
          chargeType: editRequest.chargeType ?? "",
          commercialStage: editRequest.commercialStage ?? "",
          commercialNotes: editRequest.commercialNotes ?? "",
          remarks: editRequest.remarks ?? "",
        }
      : {
          accountId: defaultAccountId ?? accounts[0]?.id ?? "",
          chargeable: "TBD",
          originalScope: "Original",
          implStatus: "New",
        },
  });

  const chargeable = watch("chargeable");

  const typeOptions = resolveOptions(accountConfig, "type");
  const platformOptions = resolveOptions(accountConfig, "platform");
  const contractOptions = resolveOptions(accountConfig, "contract");
  const unitOptions = resolveOptions(accountConfig, "unit");
  const implStatusOptions = resolveOptions(accountConfig, "implStatus");
  const chargeTypeOptions = resolveOptions(accountConfig, "chargeType");
  const notChargeableReasonOptions = resolveOptions(accountConfig, "notChargeableReason");
  const commercialStageOptions = resolveOptions(accountConfig, "commercialStage");

  async function onSubmit(data: FormValues) {
    // Clean empty strings to undefined
    const clean = Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
    ) as FormValues;

    if (editRequest) {
      const { accountId: _a, ...updateData } = clean;
      await updateRequest(editRequest.id, updateData);
    } else {
      await createRequest(clean);
    }
    router.push(redirectOnSuccess);
    router.refresh();
  }

  const field = (
    label: string,
    name: keyof FormValues,
    required = false
  ) => (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
      {/* --- Item Info --- */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Item Info</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Account <span className="text-red-500">*</span>
            </label>
            <select
              {...register("accountId")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            {errors.accountId && (
              <p className="text-xs text-red-500">{errors.accountId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">
              Item Name <span className="text-red-500">*</span>
            </label>
            <Input {...register("item")} placeholder="e.g. Diabetes Care Pathway" />
            {errors.item && (
              <p className="text-xs text-red-500">{errors.item.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Type <span className="text-red-500">*</span></label>
            <select
              {...register("type")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select type...</option>
              {typeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
          </div>

          {contractOptions.length > 0 && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Contract</label>
              <select
                {...register("contract")}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select contract...</option>
                {contractOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}

          {unitOptions.length > 0 && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">Unit</label>
              <select
                {...register("unit")}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select unit...</option>
                {unitOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* --- Implementation --- */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Implementation</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Platform</label>
            <select
              {...register("platform")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select platform...</option>
              {platformOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Impl. Status</label>
            <select
              {...register("implStatus")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {implStatusOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">In Pipeline / Live</label>
            <select
              {...register("inPipelineOrLive")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Auto (derived)</option>
              {IN_PIPELINE_OR_LIVE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Original Scope?</label>
            <select
              {...register("originalScope")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ORIGINAL_SCOPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">Remarks</label>
            <Textarea {...register("remarks")} placeholder="Implementation notes..." rows={2} />
          </div>
        </div>
      </section>

      {/* --- Commercial --- */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">Commercial</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">In Contract?</label>
            <select
              {...register("inContract")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">—</option>
              {IN_CONTRACT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-700">Chargeable?</label>
            <select
              {...register("chargeable")}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {CHARGEABLE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {/* Conditional: show only if chargeable = No */}
          {chargeable === "No" && (
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700">
                If Not Chargeable — Reason
              </label>
              <select
                {...register("notChargeableReason")}
                className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Select reason...</option>
                {notChargeableReasonOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )}

          {/* Conditional: show only if chargeable = Yes */}
          {chargeable === "Yes" && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  If Chargeable — Charge Type
                </label>
                <select
                  {...register("chargeType")}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select charge type...</option>
                  {chargeTypeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Commercial Stage</label>
                <select
                  {...register("commercialStage")}
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select stage...</option>
                  {commercialStageOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="space-y-1 sm:col-span-2">
            <label className="block text-xs font-medium text-gray-700">Commercial Notes</label>
            <Textarea
              {...register("commercialNotes")}
              placeholder="Current commercial position, open questions, next steps..."
              rows={3}
            />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : editRequest ? "Save Changes" : "Create Request"}
        </Button>
      </div>
    </form>
  );
}
