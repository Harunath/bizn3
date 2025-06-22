-- AlterTable
ALTER TABLE "BusinessDetails" ADD COLUMN     "generalCategory" TEXT;

-- CreateTable
CREATE TABLE "ChapterCategoryAssignment" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChapterCategoryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterCategoryAssignment_userId_key" ON "ChapterCategoryAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterCategoryAssignment_chapterId_categoryId_key" ON "ChapterCategoryAssignment"("chapterId", "categoryId");

-- AddForeignKey
ALTER TABLE "ChapterCategoryAssignment" ADD CONSTRAINT "ChapterCategoryAssignment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterCategoryAssignment" ADD CONSTRAINT "ChapterCategoryAssignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BusinessCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChapterCategoryAssignment" ADD CONSTRAINT "ChapterCategoryAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
