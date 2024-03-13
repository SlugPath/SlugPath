-- CreateEnum
CREATE TYPE "LabelColor" AS ENUM ('RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'PURPLE', 'PINK');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Term" AS ENUM ('Fall', 'Winter', 'Spring', 'Summer');

-- CreateEnum
CREATE TYPE "ProgramType" AS ENUM ('Major', 'Minor');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "defaultPlannerId" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Planner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL,
    "userId" TEXT,
    "majorId" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Planner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quarter" (
    "id" SERIAL NOT NULL,
    "term" "Term" NOT NULL,
    "year" INTEGER NOT NULL,
    "plannerId" TEXT NOT NULL,

    CONSTRAINT "Quarter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrolledCourse" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "ge" TEXT[],
    "quartersOffered" TEXT[],
    "quarterId" INTEGER NOT NULL,
    "labels" TEXT[],
    "description" TEXT,

    CONSTRAINT "EnrolledCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "department" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 5,
    "prerequisites" TEXT NOT NULL,
    "ge" TEXT[],
    "quartersOffered" TEXT[],
    "description" TEXT,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("departmentCode","number")
);

-- CreateTable
CREATE TABLE "Major" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "catalogYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "programType" "ProgramType" NOT NULL DEFAULT 'Major',

    CONSTRAINT "Major_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MajorRequirement" (
    "id" SERIAL NOT NULL,
    "requirementList" JSONB NOT NULL,
    "majorId" INTEGER NOT NULL,

    CONSTRAINT "MajorRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MajorEditingPermission" (
    "id" SERIAL NOT NULL,
    "majorId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MajorEditingPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Label" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "color" "LabelColor" NOT NULL,
    "plannerId" TEXT NOT NULL,

    CONSTRAINT "Label_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MajorToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Major_name_catalogYear_programType_key" ON "Major"("name", "catalogYear", "programType");

-- CreateIndex
CREATE UNIQUE INDEX "MajorRequirement_majorId_key" ON "MajorRequirement"("majorId");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_userEmail_key" ON "Permission"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "MajorEditingPermission_majorId_key" ON "MajorEditingPermission"("majorId");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_userEmail_key" ON "Permissions"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_MajorToUser_AB_unique" ON "_MajorToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MajorToUser_B_index" ON "_MajorToUser"("B");

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planner" ADD CONSTRAINT "Planner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quarter" ADD CONSTRAINT "Quarter_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrolledCourse" ADD CONSTRAINT "EnrolledCourse_quarterId_fkey" FOREIGN KEY ("quarterId") REFERENCES "Quarter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorRequirement" ADD CONSTRAINT "MajorRequirement_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorEditingPermission" ADD CONSTRAINT "MajorEditingPermission_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MajorEditingPermission" ADD CONSTRAINT "MajorEditingPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_plannerId_fkey" FOREIGN KEY ("plannerId") REFERENCES "Planner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MajorToUser" ADD CONSTRAINT "_MajorToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Major"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MajorToUser" ADD CONSTRAINT "_MajorToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
