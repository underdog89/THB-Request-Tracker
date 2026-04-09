"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { slugify } from "../utils";

export async function getAccounts() {
  return prisma.account.findMany({
    orderBy: { name: "asc" },
    include: { config: true },
  });
}

export async function getAccountBySlug(slug: string) {
  return prisma.account.findUnique({
    where: { slug },
    include: { config: true },
  });
}

export async function createAccount(name: string) {
  const slug = slugify(name);
  const account = await prisma.account.create({
    data: {
      name,
      slug,
      config: { create: {} },
    },
    include: { config: true },
  });
  revalidatePath("/");
  return account;
}

export async function updateAccountConfig(
  accountId: string,
  data: {
    typeOptions?: string[];
    platformOptions?: string[];
    contractOptions?: string[];
    unitOptions?: string[];
    implStatusOptions?: string[];
    chargeTypeOptions?: string[];
    notChargeableReasonOptions?: string[];
    commercialStageOptions?: string[];
    fieldRules?: Record<string, { hidden?: boolean; required?: boolean }>;
  }
) {
  const updateData: Record<string, string> = {};
  const arrayFields = [
    "typeOptions",
    "platformOptions",
    "contractOptions",
    "unitOptions",
    "implStatusOptions",
    "chargeTypeOptions",
    "notChargeableReasonOptions",
    "commercialStageOptions",
  ] as const;

  for (const field of arrayFields) {
    if (data[field] !== undefined) {
      updateData[field] = JSON.stringify(data[field]);
    }
  }

  if (data.fieldRules !== undefined) {
    updateData.fieldRules = JSON.stringify(data.fieldRules);
  }

  await prisma.accountConfig.upsert({
    where: { accountId },
    update: updateData,
    create: { accountId, ...updateData },
  });

  revalidatePath("/");
}
