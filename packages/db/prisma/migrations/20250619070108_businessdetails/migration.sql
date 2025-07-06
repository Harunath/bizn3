/*
  Warnings:

  - You are about to drop the column `category` on the `BusinessDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BusinessDetails" DROP COLUMN "category",
ADD COLUMN     "categoryId" TEXT;

-- CreateTable
CREATE TABLE "BusinessCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusinessCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessCategory_name_key" ON "BusinessCategory"("name");

-- AddForeignKey
ALTER TABLE "BusinessDetails" ADD CONSTRAINT "BusinessDetails_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BusinessCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
