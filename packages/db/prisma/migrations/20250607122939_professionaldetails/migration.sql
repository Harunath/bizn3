-- CreateTable
CREATE TABLE "ProfessionalDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogoUrl" TEXT,
    "industry" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "renewalDueDate" TIMESTAMP(3) NOT NULL,
    "membershipStatus" TEXT NOT NULL,
    "directNumber" TEXT NOT NULL,
    "fax" TEXT,
    "tollFree" TEXT,
    "gstRegisteredState" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "myBusiness" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfessionalDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalDetails_userId_key" ON "ProfessionalDetails"("userId");

-- AddForeignKey
ALTER TABLE "ProfessionalDetails" ADD CONSTRAINT "ProfessionalDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
