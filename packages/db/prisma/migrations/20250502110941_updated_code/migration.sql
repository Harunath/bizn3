/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Club` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Region` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Zone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `Club` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `Region` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `Zone` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "flagImage" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "image" TEXT,
ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "image" TEXT,
ALTER COLUMN "code" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_code_key" ON "Chapter"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Club_code_key" ON "Club"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_code_key" ON "Zone"("code");
