/*
  Warnings:

  - The primary key for the `EnrolledCourse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Label` table. All the data in the column will be lost.
  - You are about to drop the `_EnrolledCourseToLabel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `EnrolledCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plannerId` to the `Label` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_EnrolledCourseToLabel" DROP CONSTRAINT "_EnrolledCourseToLabel_A_fkey";

-- DropForeignKey
ALTER TABLE "_EnrolledCourseToLabel" DROP CONSTRAINT "_EnrolledCourseToLabel_B_fkey";

-- AlterTable
ALTER TABLE "EnrolledCourse" DROP CONSTRAINT "EnrolledCourse_pkey",
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EnrolledCourse_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "EnrolledCourse_id_seq";

-- AlterTable
ALTER TABLE "Label" DROP COLUMN "userId",
ADD COLUMN     "plannerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_EnrolledCourseToLabel";

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
