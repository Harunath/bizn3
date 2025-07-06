/*
  Warnings:

  - A unique constraint covering the columns `[tanNumber]` on the table `BusinessDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "BusinessDetails" ADD COLUMN     "BusinessDescription" TEXT,
ADD COLUMN     "chapter" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "classification" TEXT NOT NULL DEFAULT 'Unclassified',
ADD COLUMN     "companyLogoUrl" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL DEFAULT 'N/A',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "directNumber" TEXT,
ADD COLUMN     "gstRegisteredState" TEXT,
ADD COLUMN     "gstin" TEXT,
ADD COLUMN     "industry" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "membershipStatus" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "renewalDueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tanNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetails_tanNumber_key" ON "BusinessDetails"("tanNumber");
