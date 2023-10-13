import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import getCourses from "./csvreader";

async function main() {
  const courses = await getCourses();

  // load all the courses into the database
  for (let i = 0; i < courses.length; i++) {
    const course = courses[i];
    const c = await prisma.course.create({
      data: {
        name: course.name,
        credits: course.credits,
        department: course.department,
        number: course.number,
      },
    });
    console.log(c);
  }
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
