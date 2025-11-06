/*
  Warnings:

  - You are about to drop the column `country` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `fromIndia` on the `Patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "country",
DROP COLUMN "fromIndia";
