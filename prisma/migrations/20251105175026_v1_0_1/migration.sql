/*
  Warnings:

  - The values [INITIAL,PROCESSING,TREATED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `otherDisease` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `patentId` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[patientId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NEW_REGISTRATION', 'UNDER_DIAGNOSIS', 'UNDER_TREATMENT', 'TREATMENT_COMPLETED', 'FOLLOW_UP');
ALTER TABLE "public"."Patient" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Patient" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Patient" ALTER COLUMN "status" SET DEFAULT 'NEW_REGISTRATION';
COMMIT;

-- DropIndex
DROP INDEX "public"."Patient_patentId_key";

-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "otherDisease",
DROP COLUMN "patentId",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "diseaseDetails" TEXT,
ADD COLUMN     "fromIndia" TEXT,
ADD COLUMN     "hasDisease" TEXT,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "state" TEXT,
ALTER COLUMN "status" SET DEFAULT 'NEW_REGISTRATION';

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "Patient"("patientId");
