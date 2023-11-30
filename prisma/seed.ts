import { PrismaClient } from "@prisma/client";
import { getCourses, getPlanners } from "./csvreader";
import { majors, years } from "@/lib/defaultPlanners";

const prisma = new PrismaClient();

async function main() {
  const courses = await getCourses();
  const ops = [];

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

    ops.push(
      prisma.course.upsert({
        where: {
          departmentCode_number: {
            departmentCode: course.departmentCode,
            number: course.number,
          },
        },
        update: updatedCourse.data,
        create: updatedCourse.data,
      }),
    );
  }
  console.log(`Loaded ${courses.length} courses`);

  // Load all majors
  for (const m of majors) {
    for (const y of years) {
      ops.push(
        prisma.major.create({
          data: {
            name: m,
            catalogYear: y,
          },
        }),
      );
    }
  }
  await prisma.$transaction([...ops]);
  console.log(`Loaded all majors`);

  const planners = await getPlanners();

  // const terms = [Term.Fall, Term.Winter, Term.Spring, Term.Summer]
  // const yearKeys = ["Year 1", "Year 2", "Year 3", "Year 4"]

  Object.keys(planners).forEach((catalogYear) => {
    planners[catalogYear].forEach(async (planner: any) => {
      // get quarters and courses
      /*
      const quarters = []
      years.forEach((y) => {
        const qs = zip(planners[y], terms).forEach((ct => {
          const [cs, t] = ct;
          cs.map((c) => {
            return {
              ...customCourse
            }
          })
        }))
      })
      */

      const [majorName, order] = planner["planner_name"].split(" Planner ");
      const pid = (
        await prisma.planner.create({
          data: {
            title: planner["planner_name"],
            order,
          },
        })
      ).id;

      await prisma.major.update({
        where: {
          name_catalogYear: {
            name: majorName,
            catalogYear,
          },
        },
        data: {
          defaultPlanners: {
            connect: [{ id: pid }],
          },
        },
      });
    });
  });

  /*
  Object.keys(planners).forEach((year) => {
    
  })
  */

  console.log(`${JSON.stringify(planners, null, 2)}`);
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
