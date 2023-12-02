/*
  Warnings:

  - You are about to drop the column `userId` on the `Major` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[majorId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Major" DROP CONSTRAINT "Major_userId_fkey";

-- DropIndex
DROP INDEX "Major_userId_key";

-- AlterTable
ALTER TABLE "Major" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "majorId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_majorId_key" ON "User"("majorId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE SET NULL ON UPDATE CASCADE;
