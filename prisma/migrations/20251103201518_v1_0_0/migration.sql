-- CreateEnum
CREATE TYPE "DoctorRole" AS ENUM ('ADMIN', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INITIAL', 'PROCESSING', 'TREATED');

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "DoctorRole" NOT NULL DEFAULT 'ASSISTANT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assistant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assistant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "patentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "bodyWeight" DOUBLE PRECISION,
    "address" TEXT,
    "vitiligoDuration" TEXT,
    "currentMedicine" TEXT,
    "covidVaccine" TEXT,
    "vaccineDoses" INTEGER,
    "otherDisease" TEXT,
    "familyHistory" TEXT,
    "status" "Status" NOT NULL DEFAULT 'INITIAL',
    "doctorId" TEXT,
    "assistantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientHistory" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT,
    "assistantId" TEXT,
    "lastMedicine" TEXT,
    "adviceGiven" TEXT,
    "lastInspection" TIMESTAMP(3) NOT NULL,
    "nextInspection" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assistant_email_key" ON "Assistant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patentId_key" ON "Patient"("patentId");

-- AddForeignKey
ALTER TABLE "Assistant" ADD CONSTRAINT "Assistant_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientHistory" ADD CONSTRAINT "PatientHistory_assistantId_fkey" FOREIGN KEY ("assistantId") REFERENCES "Assistant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientHistory" ADD CONSTRAINT "PatientHistory_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientHistory" ADD CONSTRAINT "PatientHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
