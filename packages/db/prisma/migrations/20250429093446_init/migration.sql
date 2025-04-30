/*
  Warnings:

  - Added the required column `parentFranchiseAdminId` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentFranchiseAdminId` to the `Region` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentFranchiseAdminId` to the `Zone` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "parentFranchiseAdminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Franchise" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "parentFranchiseAdminId" TEXT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "parentFranchiseAdminId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "parentFranchiseAdminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "ChapterLeader"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
