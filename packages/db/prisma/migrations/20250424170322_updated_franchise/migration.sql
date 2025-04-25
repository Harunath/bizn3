/*
  Warnings:

  - Made the column `gstNumberVerified` on table `Franchise` required. This step will fail if there are existing NULL values in that column.
  - Made the column `panNumberVerified` on table `Franchise` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Franchise" ALTER COLUMN "panNumber" DROP NOT NULL,
ALTER COLUMN "gstNumberVerified" SET NOT NULL,
ALTER COLUMN "panNumberVerified" SET NOT NULL;
