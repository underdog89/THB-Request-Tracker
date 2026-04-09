import type { AccountConfig } from "@prisma/client";
import { GLOBAL_ENUM_MAP } from "./enums";

type ConfigKey =
  | "type"
  | "platform"
  | "contract"
  | "unit"
  | "implStatus"
  | "chargeType"
  | "notChargeableReason"
  | "commercialStage";

const CONFIG_KEY_MAP: Record<ConfigKey, keyof AccountConfig> = {
  type: "typeOptions",
  platform: "platformOptions",
  contract: "contractOptions",
  unit: "unitOptions",
  implStatus: "implStatusOptions",
  chargeType: "chargeTypeOptions",
  notChargeableReason: "notChargeableReasonOptions",
  commercialStage: "commercialStageOptions",
};

export function resolveOptions(
  accountConfig: AccountConfig | null | undefined,
  field: ConfigKey
): string[] {
  if (!accountConfig) return GLOBAL_ENUM_MAP[field] ?? [];
  const configKey = CONFIG_KEY_MAP[field];
  const stored = JSON.parse((accountConfig[configKey] as string) ?? "[]") as string[];
  return stored.length > 0 ? stored : (GLOBAL_ENUM_MAP[field] ?? []);
}

export interface FieldRule {
  hidden: boolean;
  required: boolean;
}

export function resolveFieldRule(
  accountConfig: AccountConfig | null | undefined,
  fieldName: string
): FieldRule {
  if (!accountConfig) return { hidden: false, required: false };
  const rules = JSON.parse(accountConfig.fieldRules ?? "{}") as Record<string, Partial<FieldRule>>;
  return { hidden: false, required: false, ...rules[fieldName] };
}

export function resolveAllFieldRules(
  accountConfig: AccountConfig | null | undefined
): Record<string, FieldRule> {
  if (!accountConfig) return {};
  return JSON.parse(accountConfig.fieldRules ?? "{}") as Record<string, FieldRule>;
}
