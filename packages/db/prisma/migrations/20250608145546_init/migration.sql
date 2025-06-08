-- CreateEnum
CREATE TYPE "ChapterLeaderRole" AS ENUM ('PRESIDENT', 'SECRETARY', 'TREASURER');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('ADMIN', 'FRANCHISE');

-- CreateEnum
CREATE TYPE "FranchiseType" AS ENUM ('MASTER_FRANCHISE', 'SUPER_FRANCHISE', 'REGIONAL_FRANCHISE');

-- CreateEnum
CREATE TYPE "UserMembershipType" AS ENUM ('FREE', 'VIP', 'GOLD');

-- CreateEnum
CREATE TYPE "ReferralType" AS ENUM ('SELF', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('VIRTUAL', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "TitleTypes" AS ENUM ('Mr', 'Ms', 'Mrs', 'Dr', 'Miss', 'Prof', 'None');

-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('Male', 'Female', 'Others', 'None');

-- CreateEnum
CREATE TYPE "EventOwnerType" AS ENUM ('CLUB', 'CHAPTER');

-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'WAITING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "AnnouncementOwnerType" AS ENUM ('CLUB', 'CHAPTER');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "phone" TEXT,
    "phoneVerified" BOOLEAN DEFAULT false,
    "address" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Franchise" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "address" JSONB,
    "logo" TEXT,
    "motto" TEXT,
    "gstNumber" TEXT,
    "gstNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "panNumber" TEXT,
    "panNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "renewalPeriod" INTEGER NOT NULL DEFAULT 1,
    "renewalDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isActiveDescription" TEXT DEFAULT 'Franchise is active',
    "franchiseType" "FranchiseType" NOT NULL,
    "adminId" TEXT,
    "parentFranchiseAdminId" TEXT,
    "countryId" TEXT,
    "zoneId" TEXT,
    "regionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Franchise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FranchiseAdmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN DEFAULT false,
    "address" JSONB,
    "profession" TEXT,
    "experience" INTEGER,
    "nomineeName" TEXT NOT NULL,
    "nomineeRelation" TEXT NOT NULL,
    "nomineeContact" TEXT NOT NULL,
    "franchiseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FranchiseAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT,
    "flagImage" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Zone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "parentFranchiseAdminId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Zone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "parentFranchiseAdminId" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "parentFranchiseAdminId" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "regionalFranchiseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterLeader" (
    "id" TEXT NOT NULL,
    "role" "ChapterLeaderRole" NOT NULL,
    "chapterLeaderId" TEXT,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "images" TEXT[],
    "CLcreatorId" TEXT,
    "FAcreatorId" TEXT,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubLeader" (
    "id" TEXT NOT NULL,
    "chapterLeaderId" TEXT,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubLeader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',
    "complainantType" "EntityType" NOT NULL,
    "adminComplainantId" TEXT,
    "franchiseComplainantId" TEXT,
    "respondentType" "EntityType" NOT NULL,
    "adminRespondentId" TEXT,
    "franchiseRespondentId" TEXT,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "registrationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deactivated" BOOLEAN NOT NULL DEFAULT false,
    "membershipType" "UserMembershipType" NOT NULL DEFAULT 'FREE',
    "membershipStartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "membershipEndDate" TIMESTAMP(3) NOT NULL,
    "leadingChapterId" TEXT,
    "leadingClubId" TEXT,
    "homeClubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "BusinessDetails" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "images" TEXT[],
    "category" TEXT NOT NULL,
    "panNumber" TEXT,
    "panNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "gstNumber" TEXT,
    "gstNumberVerified" BOOLEAN NOT NULL DEFAULT false,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BusinessDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "date" TIMESTAMP(3) NOT NULL,
    "address" JSONB,
    "eventType" "EventType" NOT NULL DEFAULT 'IN_PERSON',
    "ownerType" "EventOwnerType" NOT NULL,
    "chapterId" TEXT,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "type" "ReferralType" NOT NULL,
    "creatorId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "businessDetails" TEXT,
    "thirdPartyDetails" JSONB,
    "status" "ReferralStatus" NOT NULL DEFAULT 'WAITING',
    "updates" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmailVerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GmailVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "cashfreeOrderId" TEXT NOT NULL,
    "paymentSessionId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "notes" TEXT,
    "itemDetailsSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "cashfreeOrderId" TEXT NOT NULL,
    "paymentSessionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentMethod" TEXT,
    "gatewayResponse" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RSVP" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RSVP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "attendedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "ownerType" "AnnouncementOwnerType" NOT NULL,
    "chapterLeaderId" TEXT,
    "clubLeaderId" TEXT,
    "chapterId" TEXT,
    "clubId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_allClubs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_allClubs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_UserConnections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserConnections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_countryId_key" ON "Franchise"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_zoneId_key" ON "Franchise"("zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Franchise_regionId_key" ON "Franchise"("regionId");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseAdmin_email_key" ON "FranchiseAdmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FranchiseAdmin_franchiseId_key" ON "FranchiseAdmin"("franchiseId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_code_key" ON "Zone"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Zone_name_countryId_key" ON "Zone"("name", "countryId");

-- CreateIndex
CREATE UNIQUE INDEX "Region_code_key" ON "Region"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Region_name_zoneId_key" ON "Region"("name", "zoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_code_key" ON "Chapter"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_name_regionId_key" ON "Chapter"("name", "regionId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterLeader_chapterLeaderId_key" ON "ChapterLeader"("chapterLeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterLeader_chapterId_role_key" ON "ChapterLeader"("chapterId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Club_code_key" ON "Club"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_chapterId_key" ON "Club"("name", "chapterId");

-- CreateIndex
CREATE UNIQUE INDEX "ClubLeader_chapterLeaderId_key" ON "ClubLeader"("chapterLeaderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_leadingChapterId_key" ON "User"("leadingChapterId");

-- CreateIndex
CREATE UNIQUE INDEX "User_leadingClubId_key" ON "User"("leadingClubId");

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
CREATE UNIQUE INDEX "BusinessDetails_panNumber_key" ON "BusinessDetails"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetails_gstNumber_key" ON "BusinessDetails"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDetails_userId_key" ON "BusinessDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GmailVerificationCode_email_key" ON "GmailVerificationCode"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_cashfreeOrderId_key" ON "Order"("cashfreeOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentSessionId_key" ON "Order"("paymentSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_cashfreeOrderId_key" ON "Payment"("cashfreeOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentSessionId_key" ON "Payment"("paymentSessionId");

-- CreateIndex
CREATE INDEX "_allClubs_B_index" ON "_allClubs"("B");

-- CreateIndex
CREATE INDEX "_UserConnections_B_index" ON "_UserConnections"("B");

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Franchise" ADD CONSTRAINT "Franchise_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FranchiseAdmin" ADD CONSTRAINT "FranchiseAdmin_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Zone" ADD CONSTRAINT "Zone_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_parentFranchiseAdminId_fkey" FOREIGN KEY ("parentFranchiseAdminId") REFERENCES "FranchiseAdmin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_regionalFranchiseId_fkey" FOREIGN KEY ("regionalFranchiseId") REFERENCES "Franchise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterLeader" ADD CONSTRAINT "ChapterLeader_chapterLeaderId_fkey" FOREIGN KEY ("chapterLeaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterLeader" ADD CONSTRAINT "ChapterLeader_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_CLcreatorId_fkey" FOREIGN KEY ("CLcreatorId") REFERENCES "ChapterLeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_FAcreatorId_fkey" FOREIGN KEY ("FAcreatorId") REFERENCES "FranchiseAdmin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeader" ADD CONSTRAINT "ClubLeader_chapterLeaderId_fkey" FOREIGN KEY ("chapterLeaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubLeader" ADD CONSTRAINT "ClubLeader_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_adminComplainantId_fkey" FOREIGN KEY ("adminComplainantId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_franchiseComplainantId_fkey" FOREIGN KEY ("franchiseComplainantId") REFERENCES "Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_adminRespondentId_fkey" FOREIGN KEY ("adminRespondentId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_franchiseRespondentId_fkey" FOREIGN KEY ("franchiseRespondentId") REFERENCES "Franchise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_homeClubId_fkey" FOREIGN KEY ("homeClubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "BusinessDetails" ADD CONSTRAINT "BusinessDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RSVP" ADD CONSTRAINT "RSVP_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_chapterLeaderId_fkey" FOREIGN KEY ("chapterLeaderId") REFERENCES "ChapterLeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_clubLeaderId_fkey" FOREIGN KEY ("clubLeaderId") REFERENCES "ClubLeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allClubs" ADD CONSTRAINT "_allClubs_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_allClubs" ADD CONSTRAINT "_allClubs_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserConnections" ADD CONSTRAINT "_UserConnections_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
