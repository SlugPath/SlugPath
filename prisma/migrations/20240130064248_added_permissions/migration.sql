-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MajorEditingPermission" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "permissionsId" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MajorEditingPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_userEmail_key" ON "Permissions"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "MajorEditingPermission_majorId_key" ON "MajorEditingPermission"("majorId");

-- AddForeignKey
ALTER TABLE "MajorEditingPermission" ADD CONSTRAINT "MajorEditingPermission_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorEditingPermission" ADD CONSTRAINT "MajorEditingPermission_permissionsId_fkey" FOREIGN KEY ("permissionsId") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
