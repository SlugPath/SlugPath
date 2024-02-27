import { majors, minors, years } from "@/lib/defaultPlanners";
import { createQuarters, getRealEquivalent } from "@/lib/plannerUtils";
import { zip } from "@/lib/utils";
import {
  Major,
  PrismaClient,
  PrismaPromise,
  ProgramType,
  Term,
} from "@prisma/client";

import { getCourses, getPlanners } from "./csvreader";

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
        description: course.description,
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

  // Load all majors
  for (const m of majors) {
    for (const y of years) {
      ops.push(
        prisma.major.create({
          data: {
            name: m,
            catalogYear: y,
            programType: ProgramType.Major,
          },
        }),
      );
    }
  }

  // Load all minors
  for (const m of minors) {
    for (const y of years) {
      ops.push(
        prisma.major.create({
          data: {
            name: m,
            catalogYear: y,
            programType: ProgramType.Minor,
          },
        }),
      );
    }
  }
  await prisma.$transaction([...ops]);
  console.log(`✨ Loaded ${courses.length} courses ✨`);
  console.log(`✨ Loaded all majors ✨`);
  console.log(`✨ Loaded all minors ✨`);

  const planners = await getPlanners();

  for (const catalogYear of Object.keys(planners)) {
    await addPlannersInCatalogYear(planners, catalogYear);
    console.log(`✨ Loaded default planners for (${catalogYear}) ✨`);
  }
  console.log(`✨ Loaded all default planners ✨`);

  // remove the majors that don't have any default planners but have major as program type
  await prisma.major.findMany({
    where: {
      defaultPlanners: {
        none: {},
      },
      programType: ProgramType.Major,
    },
  });

  console.log(`✨ Pruned invalid majors ✨`);

  const allMajors = await prisma.major.findMany();

  const ops3 = [];
  for (const m of allMajors) {
    ops3.push(createNonePlannerForMajor(m));
  }
  await prisma.$transaction([...ops3]);
  console.log(`✨ Done ✨`);
}

function createNonePlannerForMajor(major: Major): PrismaPromise<any> {
  const noneQuarters: any[] = createQuarters();
  let idx = 0;
  for (const y of [1, 2, 3, 4]) {
    for (const t of [Term.Fall, Term.Winter, Term.Spring, Term.Summer]) {
      delete noneQuarters[idx].id;
      delete noneQuarters[idx].title;
      delete noneQuarters[idx].courses;
      noneQuarters[idx].year = y - 1; // prevent off by one error
      noneQuarters[idx].term = t;
      idx++;
    }
  }

  return prisma.planner.create({
    data: {
      title: "None",
      order: 10,
      quarters: {
        createMany: {
          data: noneQuarters,
        },
      },
      major: {
        connect: { id: major.id },
      },
    },
  });
}

async function addPlannersInCatalogYear(planners: any, catalogYear: string) {
  const terms = [Term.Fall, Term.Winter, Term.Spring, Term.Summer];
  const yearKeys = ["1", "2", "3", "4"];

  for (const planner of planners[catalogYear]) {
    // get quarters and courses
    let quarters: any[] = [];
    for (const y of yearKeys) {
      const quarterCourses = planner[`Year ${y}`] as any[];
      // Pad the list of quarter courses to get 4 quarters per year even if no courses
      // are taken during a quarter
      const paddedQuarterCourses = [
        ...quarterCourses,
        ...new Array(Math.max(4 - quarterCourses.length, 0)).fill([]),
      ];
      const qs = await Promise.all(
        zip(paddedQuarterCourses, terms).map(async (ct) => {
          const [cs, t] = ct;
          const plannedCourses = await Promise.all(
            cs.map(async (c: string) => {
              return await getRealEquivalent(prisma, c);
            }),
          );

          return {
            year: parseInt(y) - 1,
            term: t,
            courses: {
              create: plannedCourses,
            },
          };
        }),
      );
      quarters = quarters.concat(qs);
    }
    // create the default planner
    const [majorName, order] = planner["planner_name"].split(" Planner ");
    const pid = (
      await prisma.planner.create({
        data: {
          title: `${planner["planner_name"]} (${catalogYear})`,
          order: parseInt(order),
          quarters: {
            create: quarters,
          },
        },
      })
    ).id;
    await prisma.major.update({
      where: {
        name_catalogYear_programType: {
          name: majorName,
          catalogYear,
          programType: ProgramType.Major,
        },
      },
      data: {
        defaultPlanners: {
          connect: [{ id: pid }],
        },
      },
    });
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
