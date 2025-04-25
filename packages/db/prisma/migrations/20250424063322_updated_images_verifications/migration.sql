/*
  Warnings:

  - The values [ONE_CLUB] on the enum `UserMembershipType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'WAITING', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "UserMembershipType_new" AS ENUM ('FREE', 'VIP', 'GOLD');
ALTER TABLE "User" ALTER COLUMN "membershipType" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "membershipType" TYPE "UserMembershipType_new" USING ("membershipType"::text::"UserMembershipType_new");
ALTER TYPE "UserMembershipType" RENAME TO "UserMembershipType_old";
ALTER TYPE "UserMembershipType_new" RENAME TO "UserMembershipType";
DROP TYPE "UserMembershipType_old";
ALTER TABLE "User" ALTER COLUMN "membershipType" SET DEFAULT 'FREE';
COMMIT;

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerified" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "BusinessDetails" ADD COLUMN     "gstNumberVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "panNumberVerified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Franchise" ADD COLUMN     "gstNumberVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "isActiveDescription" TEXT DEFAULT 'Franchise is active',
ADD COLUMN     "panNumberVerified" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "FranchiseAdmin" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneVerified" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "status" "ReferralStatus" NOT NULL DEFAULT 'WAITING',
ADD COLUMN     "thirdPartyDetails" JSONB,
ADD COLUMN     "updates" TEXT[];

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "membershipType" SET DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "Zone" ADD COLUMN     "code" TEXT;
