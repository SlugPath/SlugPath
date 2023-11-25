/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - Added the required column `departmentCode` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prerequisites` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentCode` to the `EnrolledCourses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `EnrolledCourses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "createdAt",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "departmentCode" TEXT NOT NULL,
ADD COLUMN     "ge" TEXT[],
ADD COLUMN     "prerequisites" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "EnrolledCourses" ADD COLUMN     "departmentCode" TEXT NOT NULL,
ADD COLUMN     "ge" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL;
