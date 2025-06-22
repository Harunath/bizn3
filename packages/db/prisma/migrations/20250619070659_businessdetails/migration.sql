/*
  Warnings:

  - You are about to drop the column `chapter` on the `BusinessDetails` table. All the data in the column will be lost.
  - You are about to drop the column `membershipStatus` on the `BusinessDetails` table. All the data in the column will be lost.
  - You are about to drop the column `renewalDueDate` on the `BusinessDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PriorityType" AS ENUM ('LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5');

-- AlterTable
ALTER TABLE "BusinessDetails" DROP COLUMN "chapter",
DROP COLUMN "membershipStatus",
DROP COLUMN "renewalDueDate",
ALTER COLUMN "classification" DROP NOT NULL,
ALTER COLUMN "classification" DROP DEFAULT,
ALTER COLUMN "companyName" DROP NOT NULL,
ALTER COLUMN "companyName" DROP DEFAULT,
ALTER COLUMN "industry" DROP NOT NULL,
ALTER COLUMN "industry" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "priority" "PriorityType" NOT NULL DEFAULT 'LEVEL_1';
