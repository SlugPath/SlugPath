/*
  Warnings:

  - A unique constraint covering the columns `[approvedMajorId]` on the table `MajorRequirement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[majorId,userId]` on the table `MajorRequirement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `MajorRequirement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MajorRequirement" DROP CONSTRAINT "MajorRequirement_majorId_fkey";

-- DropIndex
DROP INDEX "MajorRequirement_majorId_key";

-- AlterTable
ALTER TABLE "MajorRequirement" ADD COLUMN     "approvedMajorId" INTEGER,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "majorId" INTEGER;

-- CreateTable
CREATE TABLE "Upvote" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "majorRequirementId" INTEGER NOT NULL,

    CONSTRAINT "Upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_majorRequirementId_key" ON "Upvote"("userId", "majorRequirementId");

-- CreateIndex
CREATE UNIQUE INDEX "MajorRequirement_approvedMajorId_key" ON "MajorRequirement"("approvedMajorId");

-- CreateIndex
CREATE UNIQUE INDEX "MajorRequirement_majorId_userId_key" ON "MajorRequirement"("majorId", "userId");

-- AddForeignKey
ALTER TABLE "MajorRequirement" ADD CONSTRAINT "MajorRequirement_approvedMajorId_fkey" FOREIGN KEY ("approvedMajorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorRequirement" ADD CONSTRAINT "MajorRequirement_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorRequirement" ADD CONSTRAINT "MajorRequirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_majorRequirementId_fkey" FOREIGN KEY ("majorRequirementId") REFERENCES "MajorRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Upvote" ADD CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
