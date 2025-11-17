/*
  Warnings:

  - You are about to drop the `Assistant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Assistant" DROP CONSTRAINT "Assistant_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Patient" DROP CONSTRAINT "Patient_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientHistory" DROP CONSTRAINT "PatientHistory_assistantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientHistory" DROP CONSTRAINT "PatientHistory_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PatientHistory" DROP CONSTRAINT "PatientHistory_patientId_fkey";

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "mobile" TEXT;

-- DropTable
DROP TABLE "public"."Assistant";

-- DropTable
DROP TABLE "public"."PatientHistory";
