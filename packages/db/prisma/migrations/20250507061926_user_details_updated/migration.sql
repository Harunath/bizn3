/*
  Warnings:

  - You are about to drop the `_ClubToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ClubToUser" DROP CONSTRAINT "_ClubToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClubToUser" DROP CONSTRAINT "_ClubToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "homeClubId" TEXT,
ADD COLUMN     "registrationCompleted" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_ClubToUser";

-- CreateTable
CREATE TABLE "_allClubs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_allClubs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_allClubs_B_index" ON "_allClubs"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allClubs" ADD CONSTRAINT "_allClubs_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allClubs" ADD CONSTRAINT "_allClubs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
