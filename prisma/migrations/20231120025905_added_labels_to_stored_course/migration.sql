/*
  Warnings:

  - You are about to drop the `EnrolledCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LabelColor" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'PINK');

-- DropForeignKey
ALTER TABLE "EnrolledCourses" DROP CONSTRAINT "EnrolledCourses_quarterId_fkey";

-- DropTable
DROP TABLE "EnrolledCourses";

-- CreateTable
CREATE TABLE "EnrolledCourse" (
    "id" SERIAL NOT NULL,
    "department" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "quartersOffered" TEXT[],
    "credits" INTEGER NOT NULL,
    "quarterId" INTEGER NOT NULL,

    CONSTRAINT "EnrolledCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" "LabelColor" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EnrolledCourseToLabel" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EnrolledCourseToLabel_AB_unique" ON "_EnrolledCourseToLabel"("A", "B");

-- CreateIndex
CREATE INDEX "_EnrolledCourseToLabel_B_index" ON "_EnrolledCourseToLabel"("B");

-- AddForeignKey
ALTER TABLE "EnrolledCourse" ADD CONSTRAINT "EnrolledCourse_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrolledCourseToLabel" ADD CONSTRAINT "_EnrolledCourseToLabel_A_fkey" FOREIGN KEY ("A") REFERENCES "EnrolledCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EnrolledCourseToLabel" ADD CONSTRAINT "_EnrolledCourseToLabel_B_fkey" FOREIGN KEY ("B") REFERENCES "Label"("id") ON DELETE CASCADE ON UPDATE CASCADE;
