import { PrismaClient } from "@prisma/client";
import { getCourses } from "./csvreader";

const prisma = new PrismaClient();

async function main() {
  const courses = await getCourses();

  // load all the courses into the database
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const updatedCourse = {
      // this helps avoid bugs and makes the code more DRY
      data: {
        department: course.department,
        departmentCode: course.departmentCode,
        number: course.number,
        title: course.title,
        credits: course.credits,
        prerequisites: course.prerequisites,
        ge: course.ge,
        quartersOffered: course.quartersOffered,
      },
    };

    await prisma.course.upsert({
      where: {
        department_number: {
          department: course.department,
          number: course.number,
        },
      },
      update: updatedCourse.data,
      create: updatedCourse.data,
    });
  }
  console.log(`Loaded ${courses.length} courses`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
