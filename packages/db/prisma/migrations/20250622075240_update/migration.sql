/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `UpgradeRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UpgradeRequest" ADD COLUMN     "paymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UpgradeRequest_paymentId_key" ON "UpgradeRequest"("paymentId");

-- AddForeignKey
ALTER TABLE "UpgradeRequest" ADD CONSTRAINT "UpgradeRequest_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
