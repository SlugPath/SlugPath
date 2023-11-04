/*
  Warnings:

  - A unique constraint covering the columns `[department,number]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Course_department_number_key" ON "Course"("department", "number");
