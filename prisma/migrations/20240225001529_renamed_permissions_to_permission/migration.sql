/*
  Warnings:

  - You are about to drop the column `permissionsId` on the `MajorEditingPermission` table. All the data in the column will be lost.
  - You are about to drop the `Permissions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `permissionId` to the `MajorEditingPermission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MajorEditingPermission" DROP CONSTRAINT "MajorEditingPermission_permissionsId_fkey";

-- AlterTable
ALTER TABLE "MajorEditingPermission" DROP COLUMN "permissionsId",
ADD COLUMN     "permissionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Permissions";

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userEmail_key" ON "Permission"("userEmail");

-- AddForeignKey
ALTER TABLE "MajorEditingPermission" ADD CONSTRAINT "MajorEditingPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
