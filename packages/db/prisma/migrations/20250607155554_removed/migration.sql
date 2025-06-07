/*
  Warnings:

  - You are about to drop the `ProfessionalDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfessionalDetails" DROP CONSTRAINT "ProfessionalDetails_userId_fkey";

-- DropTable
DROP TABLE "ProfessionalDetails";
