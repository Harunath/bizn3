/*
  Warnings:

  - You are about to drop the `Testimonials` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Testimonials" DROP CONSTRAINT "Testimonials_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Testimonials" DROP CONSTRAINT "Testimonials_referralId_fkey";

-- DropForeignKey
ALTER TABLE "Testimonials" DROP CONSTRAINT "Testimonials_senderId_fkey";

-- DropTable
DROP TABLE "Testimonials";
