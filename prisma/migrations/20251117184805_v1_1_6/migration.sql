/*
  Warnings:

  - The values [UNDER_DIAGNOSIS] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('NEW_REGISTRATION', 'UNDER_TREATMENT', 'TREATMENT_COMPLETED', 'PAUSE', 'FOLLOW_UP', 'BLOCKED');
ALTER TABLE "public"."Patient" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Patient" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "public"."Status_old";
ALTER TABLE "Patient" ALTER COLUMN "status" SET DEFAULT 'NEW_REGISTRATION';
COMMIT;
