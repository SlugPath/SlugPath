/*
  Warnings:

  - Made the column `defaultPlannerId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "defaultPlannerId" SET NOT NULL,
ALTER COLUMN "defaultPlannerId" SET DEFAULT '';
