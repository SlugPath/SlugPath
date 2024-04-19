-- CreateTable
CREATE TABLE "TransferCourse" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "courseDepartmentCode" TEXT,
    "courseNumber" TEXT,

    CONSTRAINT "TransferCourse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransferCourse" ADD CONSTRAINT "TransferCourse_courseDepartmentCode_courseNumber_fkey" FOREIGN KEY ("courseDepartmentCode", "courseNumber") REFERENCES "Course"("departmentCode", "number") ON DELETE SET NULL ON UPDATE CASCADE;
