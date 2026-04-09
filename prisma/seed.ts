import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";

const prisma = new PrismaClient();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapImplStatus(raw: string | null | undefined): string {
  if (!raw) return "New";
  const map: Record<string, string> = {
    "live": "Live",
    "dev": "Dev",
    "uat": "UAT",
    "scoping": "Scoping",
    "closed": "Closed",
    "new": "New",
    "to be picked up": "To be picked up",
  };
  return map[raw.toLowerCase()] ?? raw;
}

function mapInPipelineOrLive(implStatus: string): string {
  return implStatus === "Live" ? "Live" : "Pipeline";
}

async function main() {
  const xlsxPath = path.join(__dirname, "../Sample schema.xlsx");
  const workbook = XLSX.readFile(xlsxPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Read all rows as arrays
  const rawRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as (string | null)[][];

  // Find header row — the row that contains "Account" and "Item"
  const headerRowIdx = rawRows.findIndex(
    (row) =>
      row.some((cell) => cell && String(cell).trim() === "Account") &&
      row.some((cell) => cell && String(cell).trim() === "Item")
  );
  if (headerRowIdx < 0) throw new Error("Could not find header row in spreadsheet");

  const headerRow = rawRows[headerRowIdx] as string[];

  // Column indices based on Sample schema.xlsx header order:
  // Account | Item | Type | Contract Region | Unit | Platform | Impl. Status | In Pipeline / Live
  // Original Scope? | In Contract? | Chargeable? | If Not Chargeable — Reason
  // If Chargeable — Charge Type | Commercial Stage | Commercial Notes | Remarks
  const COL = {
    account: headerRow.indexOf("Account"),
    item: headerRow.indexOf("Item"),
    type: headerRow.indexOf("Type"),
    contract: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("contract") && h.toLowerCase().includes("region")
    ),
    unit: headerRow.indexOf("Unit"),
    platform: headerRow.indexOf("Platform"),
    implStatus: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("impl")
    ),
    inPipelineOrLive: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("pipeline")
    ),
    originalScope: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("original scope")
    ),
    inContract: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("in contract")
    ),
    chargeable: headerRow.findIndex(
      (h) => h && h.toLowerCase() === "chargeable?"
    ),
    notChargeableReason: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("not chargeable")
    ),
    chargeType: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("charge type")
    ),
    commercialStage: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("commercial stage")
    ),
    commercialNotes: headerRow.findIndex(
      (h) => h && h.toLowerCase().includes("commercial notes")
    ),
    remarks: headerRow.findIndex(
      (h) => h && h.toLowerCase() === "remarks"
    ),
  };

  // Data rows: everything between the header and the first separator/empty row
  // Find the end of data: first row after header where account is null/empty or looks like a section header
  const afterHeader = rawRows.slice(headerRowIdx + 1);
  const dataEndIdx = afterHeader.findIndex((row) => {
    const acct = String(row[COL.account] ?? "").trim();
    return !acct || acct.startsWith("───") || acct.startsWith("---");
  });
  const dataRows = dataEndIdx >= 0 ? afterHeader.slice(0, dataEndIdx) : afterHeader;

  // Group by account name
  const accountMap = new Map<string, typeof dataRows>();
  for (const row of dataRows) {
    const accountName = String(row[COL.account] ?? "").trim();
    if (!accountName) continue;
    if (!accountMap.has(accountName)) accountMap.set(accountName, []);
    accountMap.get(accountName)!.push(row);
  }

  for (const [accountName, rows] of Array.from(accountMap.entries())) {
    const slug = slugify(accountName);

    // Collect unique values for per-account config
    const contracts = Array.from(new Set(rows.map((r) => String(r[COL.contract] ?? "").trim()).filter(Boolean)));
    const units = Array.from(new Set(rows.map((r) => String(r[COL.unit] ?? "").trim()).filter(Boolean)));

    // Upsert account
    const account = await prisma.account.upsert({
      where: { slug },
      update: { name: accountName },
      create: {
        name: accountName,
        slug,
        config: {
          create: {
            contractOptions: JSON.stringify(contracts),
            unitOptions: JSON.stringify(units),
          },
        },
      },
    });

    // Update config if account already existed
    const existingConfig = await prisma.accountConfig.findUnique({
      where: { accountId: account.id },
    });
    if (!existingConfig) {
      await prisma.accountConfig.create({
        data: {
          accountId: account.id,
          contractOptions: JSON.stringify(contracts),
          unitOptions: JSON.stringify(units),
        },
      });
    } else {
      await prisma.accountConfig.update({
        where: { accountId: account.id },
        data: {
          contractOptions: JSON.stringify(contracts),
          unitOptions: JSON.stringify(units),
        },
      });
    }

    // Seed requests
    for (const row of rows) {
      const get = (idx: number) => {
        const val = row[idx];
        if (val === null || val === undefined) return undefined;
        const s = String(val).trim();
        return s === "" ? undefined : s;
      };

      const implStatus = mapImplStatus(get(COL.implStatus));
      const rawPipeline = get(COL.inPipelineOrLive);
      const inPipelineOrLive = rawPipeline ?? mapInPipelineOrLive(implStatus);

      await prisma.request.create({
        data: {
          accountId: account.id,
          item: get(COL.item) ?? "(Untitled)",
          type: get(COL.type) ?? "Care pathway",
          contract: get(COL.contract),
          unit: get(COL.unit),
          platform: get(COL.platform),
          implStatus,
          inPipelineOrLive,
          originalScope: get(COL.originalScope) ?? "Original",
          inContract: get(COL.inContract),
          chargeable: get(COL.chargeable) ?? "TBD",
          notChargeableReason: get(COL.notChargeableReason),
          chargeType: get(COL.chargeType),
          commercialStage: get(COL.commercialStage),
          commercialNotes: get(COL.commercialNotes),
          remarks: get(COL.remarks),
        },
      });
    }

    console.log(`✓ Seeded account "${accountName}" with ${rows.length} requests`);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
