-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'MALE';

-- CreateTable
CREATE TABLE "VisitorCounter" (
    "id" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisitorCounter_pkey" PRIMARY KEY ("id")
);
