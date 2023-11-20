/*
  Warnings:

  - You are about to drop the column `department` on the `EnrolledCourses` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `EnrolledCourses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EnrolledCourses" DROP COLUMN "department",
DROP COLUMN "title";
