/*
  Warnings:

  - You are about to drop the column `majorId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,catalogYear,programType]` on the table `Major` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `programType` to the `Major` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('Major', 'Minor');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_majorId_fkey";

-- DropIndex
DROP INDEX "Major_name_catalogYear_key";

-- AlterTable
ALTER TABLE "Major" ADD COLUMN     "programType" "ProgramType" NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "majorId";

-- CreateTable
CREATE TABLE "_MajorToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MajorToUser_AB_unique" ON "_MajorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MajorToUser_B_index" ON "_MajorToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_catalogYear_programType_key" ON "Major"("name", "catalogYear", "programType");

-- AddForeignKey
ALTER TABLE "_MajorToUser" ADD CONSTRAINT "_MajorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MajorToUser" ADD CONSTRAINT "_MajorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
