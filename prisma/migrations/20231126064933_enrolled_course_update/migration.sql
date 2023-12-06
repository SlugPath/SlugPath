/*
  Warnings:

  - You are about to drop the column `department` on the `EnrolledCourse` table. All the data in the column will be lost.
  - Added the required column `departmentCode` to the `EnrolledCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnrolledCourse" DROP COLUMN "department",
ADD COLUMN     "departmentCode" TEXT NOT NULL,
ADD COLUMN     "ge" TEXT[];
