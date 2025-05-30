/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profileImage` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TitleTypes" AS ENUM ('Mr', 'Ms', 'Mrs', 'Dr', 'Miss', 'Prof', 'None');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female', 'Others', 'None');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "bio",
DROP COLUMN "profileImage";

-- CreateTable
CREATE TABLE "PersonalDetails" (
    "id" TEXT NOT NULL,
    "title" "TitleTypes" NOT NULL DEFAULT 'None',
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "suffix" TEXT,
    "displayname" TEXT NOT NULL,
    "gender" "GenderType" NOT NULL DEFAULT 'None',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactDetails" (
    "id" TEXT NOT NULL,
    "billingAddress" JSONB,
    "phone" TEXT,
    "mobile" TEXT,
    "website" TEXT,
    "links" TEXT[],
    "houseNo" TEXT,
    "pager" TEXT,
    "voiceMail" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "addressLane1" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "addressLane2" TEXT,
    "city" TEXT,
    "pincode" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MyBio" (
    "id" TEXT NOT NULL,
    "yearsInBusiness" INTEGER NOT NULL,
    "yearsInCity" INTEGER NOT NULL,
    "previousJobs" TEXT[],
    "burningDesire" TEXT NOT NULL,
    "hobbiesIntrests" TEXT[],
    "NoOneKnowsAboutMe" TEXT,
    "cityOfResidence" TEXT,
    "keyToSuccess" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MyBio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopsProfile" (
    "id" TEXT NOT NULL,
    "idealReferral" TEXT[],
    "story" TEXT[],
    "topProduct" TEXT[],
    "idealReferralPartner" TEXT[],
    "topProblemSolved" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GainsProfile" (
    "id" TEXT NOT NULL,
    "goals" TEXT[],
    "networks" TEXT[],
    "accomplishments" TEXT[],
    "skills" TEXT[],
    "intrests" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GainsProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPresentations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyPresentations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserConnections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserConnections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalDetails_userId_key" ON "PersonalDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_userId_key" ON "ContactDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_userId_key" ON "Address"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MyBio_userId_key" ON "MyBio"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TopsProfile_userId_key" ON "TopsProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GainsProfile_userId_key" ON "GainsProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyPresentations_userId_key" ON "WeeklyPresentations"("userId");

-- CreateIndex
CREATE INDEX "_UserConnections_B_index" ON "_UserConnections"("B");

-- AddForeignKey
ALTER TABLE "PersonalDetails" ADD CONSTRAINT "PersonalDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactDetails" ADD CONSTRAINT "ContactDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MyBio" ADD CONSTRAINT "MyBio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopsProfile" ADD CONSTRAINT "TopsProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GainsProfile" ADD CONSTRAINT "GainsProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPresentations" ADD CONSTRAINT "WeeklyPresentations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
