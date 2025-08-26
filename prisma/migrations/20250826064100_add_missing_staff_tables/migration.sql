-- CreateTable
CREATE TABLE "public"."StaffPreEmploymentMedical" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffPreEmploymentMedical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffNdisWorkforceCapability" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffNdisWorkforceCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StaffBullyingHarassmentTraining" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffBullyingHarassmentTraining_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffPreEmploymentMedical_staffId_key" ON "public"."StaffPreEmploymentMedical"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffNdisWorkforceCapability_staffId_key" ON "public"."StaffNdisWorkforceCapability"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffBullyingHarassmentTraining_staffId_key" ON "public"."StaffBullyingHarassmentTraining"("staffId");

-- AddForeignKey
ALTER TABLE "public"."StaffPreEmploymentMedical" ADD CONSTRAINT "StaffPreEmploymentMedical_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffNdisWorkforceCapability" ADD CONSTRAINT "StaffNdisWorkforceCapability_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StaffBullyingHarassmentTraining" ADD CONSTRAINT "StaffBullyingHarassmentTraining_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
