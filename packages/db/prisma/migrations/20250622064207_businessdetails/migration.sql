/*
  Warnings:

  - You are about to drop the column `classification` on the `BusinessDetails` table. All the data in the column will be lost.
  - You are about to drop the column `directNumber` on the `BusinessDetails` table. All the data in the column will be lost.
  - You are about to drop the column `gstin` on the `BusinessDetails` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `BusinessDetails` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "BusinessDetails" DROP COLUMN "classification",
DROP COLUMN "directNumber",
DROP COLUMN "gstin",
DROP COLUMN "industry";

-- CreateTable
CREATE TABLE "UpgradeRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedTier" "UserMembershipType" NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "franchiseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "UpgradeRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpgradeRequest_userId_key" ON "UpgradeRequest"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UpgradeRequest_franchiseId_key" ON "UpgradeRequest"("franchiseId");

-- CreateIndex
CREATE INDEX "UpgradeRequest_franchiseId_idx" ON "UpgradeRequest"("franchiseId");

-- CreateIndex
CREATE INDEX "UpgradeRequest_userId_idx" ON "UpgradeRequest"("userId");

-- CreateIndex
CREATE INDEX "UpgradeRequest_status_idx" ON "UpgradeRequest"("status");

-- AddForeignKey
ALTER TABLE "UpgradeRequest" ADD CONSTRAINT "UpgradeRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpgradeRequest" ADD CONSTRAINT "UpgradeRequest_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
