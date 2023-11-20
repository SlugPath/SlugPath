/*
  Warnings:

  - The primary key for the `Course` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Course" DROP CONSTRAINT "Course_pkey",
ADD CONSTRAINT "Course_pkey" PRIMARY KEY ("departmentCode", "number");
