"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { TRACKED_FIELDS } from "../enums";

export type RequestFilters = {
  accountId?: string;
  implStatus?: string;
  chargeable?: string;
  commercialStage?: string;
  type?: string;
  contract?: string;
  unit?: string;
  originalScope?: string;
  q?: string;
  sort?: string;
  dir?: "asc" | "desc";
};

export async function getRequests(filters: RequestFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.accountId) where.accountId = filters.accountId;
  if (filters.implStatus) where.implStatus = filters.implStatus;
  if (filters.chargeable) where.chargeable = filters.chargeable;
  if (filters.commercialStage) where.commercialStage = filters.commercialStage;
  if (filters.type) where.type = filters.type;
  if (filters.contract) where.contract = filters.contract;
  if (filters.unit) where.unit = filters.unit;
  if (filters.originalScope) where.originalScope = filters.originalScope;
  if (filters.q) {
    where.item = { contains: filters.q };
  }

  const orderBy: Record<string, string> = {};
  if (filters.sort) {
    orderBy[filters.sort] = filters.dir ?? "asc";
  } else {
    orderBy.createdAt = "desc";
  }

  return prisma.request.findMany({
    where,
    orderBy,
    include: { account: true },
  });
}

export async function getRequest(id: string) {
  return prisma.request.findUnique({
    where: { id },
    include: {
      account: { include: { config: true } },
      statusHistory: { orderBy: { changedAt: "desc" } },
    },
  });
}

export type CreateRequestData = {
  accountId: string;
  item: string;
  type: string;
  contract?: string;
  unit?: string;
  platform?: string;
  implStatus?: string;
  inPipelineOrLive?: string;
  originalScope?: string;
  inContract?: string;
  chargeable?: string;
  notChargeableReason?: string;
  chargeType?: string;
  commercialStage?: string;
  commercialNotes?: string;
  remarks?: string;
};

export async function createRequest(data: CreateRequestData) {
  const request = await prisma.request.create({ data });
  revalidatePath(`/`);
  return request;
}

export type UpdateRequestData = Partial<Omit<CreateRequestData, "accountId">>;

export async function updateRequest(
  id: string,
  data: UpdateRequestData,
  changedBy = "System"
) {
  const old = await prisma.request.findUnique({ where: { id } });
  if (!old) throw new Error("Request not found");

  // Log changes to tracked fields
  const historyEntries = TRACKED_FIELDS.filter(
    (field) =>
      field in data &&
      (data as Record<string, unknown>)[field] !== (old as Record<string, unknown>)[field]
  ).map((field) => ({
    requestId: id,
    field,
    oldValue: ((old as Record<string, unknown>)[field] as string) ?? null,
    newValue: ((data as Record<string, unknown>)[field] as string) ?? null,
    changedBy,
  }));

  const [updated] = await prisma.$transaction([
    prisma.request.update({ where: { id }, data }),
    ...historyEntries.map((entry) =>
      prisma.statusHistory.create({ data: entry })
    ),
  ]);

  revalidatePath(`/`);
  return updated;
}

export async function getDashboardStats(
  accountId?: string,
  originalScope?: "New request" | "Original" | "all"
) {
  const scopeFilter =
    originalScope && originalScope !== "all"
      ? { originalScope }
      : {};
  const where = { ...(accountId ? { accountId } : {}), ...scopeFilter };

  const [total, live, pipeline, chargeableOpen, pendingCommercial] =
    await Promise.all([
      prisma.request.count({ where }),
      prisma.request.count({ where: { ...where, implStatus: "Live" } }),
      prisma.request.count({ where: { ...where, inPipelineOrLive: "Pipeline" } }),
      prisma.request.count({
        where: {
          ...where,
          chargeable: "Yes",
          commercialStage: { notIn: ["Closed", "Invoiced"] },
        },
      }),
      prisma.request.count({
        where: {
          ...where,
          chargeable: "Yes",
          commercialStage: { not: "Closed" },
        },
      }),
    ]);

  const chargeableWhere = { ...where, chargeable: "Yes" };

  const [
    implStatusBreakdown,
    chargeableBreakdown,
    commercialFunnel,
    unitBreakdown,
    contractBreakdown,
    unitBreakdownChargeable,
    contractBreakdownChargeable,
  ] = await Promise.all([
    prisma.request.groupBy({ by: ["implStatus"], where, _count: true }),
    prisma.request.groupBy({ by: ["chargeable"], where, _count: true }),
    prisma.request.groupBy({
      by: ["commercialStage"],
      where: chargeableWhere,
      _count: true,
    }),
    prisma.request.groupBy({ by: ["unit"], where, _count: true }),
    prisma.request.groupBy({ by: ["contract"], where, _count: true }),
    prisma.request.groupBy({ by: ["unit"], where: chargeableWhere, _count: true }),
    prisma.request.groupBy({ by: ["contract"], where: chargeableWhere, _count: true }),
  ]);

  return {
    total,
    live,
    pipeline,
    chargeableOpen,
    pendingCommercial,
    implStatusBreakdown: implStatusBreakdown.map((r) => ({
      name: r.implStatus ?? "Unknown",
      count: r._count,
    })),
    chargeableBreakdown: chargeableBreakdown.map((r) => ({
      name: r.chargeable ?? "Unknown",
      count: r._count,
    })),
    commercialFunnel: commercialFunnel
      .filter((r) => r.commercialStage)
      .map((r) => ({ name: r.commercialStage!, count: r._count })),
    unitBreakdown: unitBreakdown
      .filter((r) => r.unit)
      .map((r) => ({ name: r.unit!, count: r._count }))
      .sort((a, b) => b.count - a.count),
    contractBreakdown: contractBreakdown
      .filter((r) => r.contract)
      .map((r) => ({ name: r.contract!, count: r._count }))
      .sort((a, b) => b.count - a.count),
    unitBreakdownChargeable: unitBreakdownChargeable
      .filter((r) => r.unit)
      .map((r) => ({ name: r.unit!, count: r._count }))
      .sort((a, b) => b.count - a.count),
    contractBreakdownChargeable: contractBreakdownChargeable
      .filter((r) => r.contract)
      .map((r) => ({ name: r.contract!, count: r._count }))
      .sort((a, b) => b.count - a.count),
  };
}
