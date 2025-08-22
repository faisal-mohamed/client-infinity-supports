-- CreateTable
CREATE TABLE "StaffEmploymentDetails" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffEmploymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffEmploymentWelcomeAck" (
    "id" SERIAL NOT NULL,
    "staffId" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaffEmploymentWelcomeAck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffEmploymentDetails_staffId_key" ON "StaffEmploymentDetails"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffEmploymentWelcomeAck_staffId_key" ON "StaffEmploymentWelcomeAck"("staffId");

-- AddForeignKey
ALTER TABLE "StaffEmploymentDetails" ADD CONSTRAINT "StaffEmploymentDetails_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffEmploymentWelcomeAck" ADD CONSTRAINT "StaffEmploymentWelcomeAck_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
