/*
  Warnings:

  - Added the required column `credits` to the `EnrolledCourses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnrolledCourses" ADD COLUMN     "credits" INTEGER NOT NULL;
