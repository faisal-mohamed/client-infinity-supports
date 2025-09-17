-- CreateTable
CREATE TABLE "public"."StaffNdisCodeOfConduct" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "staffSignature" TEXT,
    "staffSignedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffNdisCodeOfConduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffNdisCodeOfConduct_staffId_key" ON "public"."StaffNdisCodeOfConduct"("staffId");

-- AddForeignKey
ALTER TABLE "public"."StaffNdisCodeOfConduct" ADD CONSTRAINT "StaffNdisCodeOfConduct_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "public"."Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
