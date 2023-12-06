/*
  Warnings:

  - A unique constraint covering the columns `[name,catalogYear]` on the table `Major` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Planner" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "majorId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_catalogYear_key" ON "Major"("name", "catalogYear");
