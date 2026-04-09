-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountConfig" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "typeOptions" TEXT NOT NULL DEFAULT '[]',
    "platformOptions" TEXT NOT NULL DEFAULT '[]',
    "contractOptions" TEXT NOT NULL DEFAULT '[]',
    "unitOptions" TEXT NOT NULL DEFAULT '[]',
    "implStatusOptions" TEXT NOT NULL DEFAULT '[]',
    "chargeTypeOptions" TEXT NOT NULL DEFAULT '[]',
    "notChargeableReasonOptions" TEXT NOT NULL DEFAULT '[]',
    "commercialStageOptions" TEXT NOT NULL DEFAULT '[]',
    "fieldRules" TEXT NOT NULL DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contract" TEXT,
    "unit" TEXT,
    "platform" TEXT,
    "implStatus" TEXT NOT NULL DEFAULT 'New',
    "inPipelineOrLive" TEXT,
    "originalScope" TEXT NOT NULL DEFAULT 'Original',
    "inContract" TEXT,
    "chargeable" TEXT NOT NULL DEFAULT 'TBD',
    "notChargeableReason" TEXT,
    "chargeType" TEXT,
    "commercialStage" TEXT,
    "commercialNotes" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL DEFAULT 'System',

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_slug_key" ON "Account"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AccountConfig_accountId_key" ON "AccountConfig"("accountId");

-- AddForeignKey
ALTER TABLE "AccountConfig" ADD CONSTRAINT "AccountConfig_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
