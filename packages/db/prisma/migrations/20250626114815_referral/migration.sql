-- CreateEnum
CREATE TYPE "ThankYouNoteBusinessType" AS ENUM ('NEW', 'REPEAT');

-- AlterTable
ALTER TABLE "Referral" ADD COLUMN     "Email" TEXT,
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "ThankYouNote" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "businessType" "ThankYouNoteBusinessType" NOT NULL DEFAULT 'NEW',
    "comment" TEXT NOT NULL,

    CONSTRAINT "ThankYouNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThankYouNote_referralId_key" ON "ThankYouNote"("referralId");

-- AddForeignKey
ALTER TABLE "ThankYouNote" ADD CONSTRAINT "ThankYouNote_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThankYouNote" ADD CONSTRAINT "ThankYouNote_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThankYouNote" ADD CONSTRAINT "ThankYouNote_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
