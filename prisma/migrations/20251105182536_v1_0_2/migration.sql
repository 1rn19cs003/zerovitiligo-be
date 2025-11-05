/*
  Warnings:

  - A unique constraint covering the columns `[mobile]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mobile` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "mobile" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_mobile_key" ON "Patient"("mobile");
