-- CreateTable
CREATE TABLE "MajorRequirement" (
    "id" SERIAL NOT NULL,
    "requirementList" JSONB NOT NULL,
    "majorId" INTEGER NOT NULL,

    CONSTRAINT "MajorRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MajorRequirement_majorId_key" ON "MajorRequirement"("majorId");

-- AddForeignKey
ALTER TABLE "MajorRequirement" ADD CONSTRAINT "MajorRequirement_majorId_fkey" FOREIGN KEY ("majorId") REFERENCES "Major"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
