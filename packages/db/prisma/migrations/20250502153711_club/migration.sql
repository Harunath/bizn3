/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Club` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Club" DROP CONSTRAINT "Club_creatorId_fkey";

-- AlterTable
ALTER TABLE "Club" DROP COLUMN "creatorId",
ADD COLUMN     "CLcreatorId" TEXT,
ADD COLUMN     "FAcreatorId" TEXT;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_CLcreatorId_fkey" FOREIGN KEY ("CLcreatorId") REFERENCES "ChapterLeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_FAcreatorId_fkey" FOREIGN KEY ("FAcreatorId") REFERENCES "FranchiseAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
