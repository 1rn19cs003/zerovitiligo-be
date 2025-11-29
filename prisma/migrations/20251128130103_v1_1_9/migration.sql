-- CreateTable
CREATE TABLE "MedicineDiary" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "medicineCode" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "comments" TEXT,
    "patientId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicineDiary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MedicineDiary" ADD CONSTRAINT "MedicineDiary_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicineDiary" ADD CONSTRAINT "MedicineDiary_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
