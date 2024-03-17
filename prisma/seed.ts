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

const majors = [
  "Art & Design: Games + Playable Media B.A.",
  "Environmental Studies B.A.",
  "Physics B.S.",
  "Music B.M.",
  "Art and Design: Games and Playable Media B.A.",
  "Computer Science B.A.",
  "Education, Democracy, and Justice B.A.",
  "Chemistry B.A.",
  "Computer Engineering B.S.",
  "Literature B.A.",
  "Chemistry B.S.",
  "Anthropology Combined Major B.A.",
  "Network and Digital Technology B.A.",
  "Economics Combined Major B.A.",
  "Computer Science: Computer Game Design B.S.",
  "Molecular, Cell, and Developmental Biology B.S.",
  "Sociology Combined B.A.",
  "Italian Studies B.A.",
  "Classical Studies B.A.",
  "Film and Digital Media B.A.",
  "Politics Combined B.A.",
  "Economics B.A.",
  "Mathematics B.A.",
  "Mathematics Theory and Computation B.S.",
  "Earth Sciences B.S.",
  "Biochemistry and Molecular Biology B.S.",
  "Anthropology B.A.",
  "Linguistics B.A.",
  "Applied Linguistics and Multilingualism B.A.",
  "Biotechnology B.A.",
  "Community Studies B.A.",
  "Science Education B.S.",
  "Legal Studies B.A.",
  "Plant Sciences B.S.",
  "Physics (Astrophysics) B.S.",
  "Earth Sciences Combined Major B.A.",
  "Marine Biology B.S.",
  "Language Studies B.A.",
  "Human Biology B.S.",
  "Art B.A.",
  "Ecology and Evolution B.S.",
  "Robotics Engineering B.S.",
  "Microbiology B.S.",
  "Jewish Studies B.A.",
  "History of Art and Visual Culture B.A.",
  "Music B.A.",
  "Electrical Engineering B.S.",
  "Global and Community Health B.S.",
  "Spanish Studies B.A.",
  "History B.A.",
  "Environmental Sciences B.S.",
  "Latin American and Latino Studies B.A.",
  "Applied Physics B.S.",
  "Psychology B.A.",
  "Computer Science B.S.",
  "Neuroscience B.S.",
  "Biology Combined Major B.A.",
  "Mathematics B.S.",
  "Mathematics Education B.A.",
  "Mathematics Combined B.A.",
  "Critical Race and Ethnic Studies B.A.",
  "Global and Community Health B.A.",
  "Biology B.S.",
  "Human Biology B.S. (Discontinued)",
  "Cognitive Science B.S.",
  "Sociology B.A.",
  "Technology and Information Management B.S.",
  "Agroecology B.A.",
  "Applied Mathematics B.S.",
  "Biology B.A.",
  "Global Economics B.A.",
  "Feminist Studies B.A.",
  "Theater Arts B.A.",
  "Business Management Economics B.A.",
  "Biomolecular Engineering and Bioinformatics B.S.",
  "Politics B.A.",
  "Philosophy B.A.",
];

const minors = [
  "Anthropology",
  "Applied Mathematics",
  "Assistive Technology",
  "Astrophysics",
  "Bioelectronics and Biophotonics",
  "Bioinformatics",
  "Biology",
  "Black Studies",
  "Chemistry",
  "Classical Studies",
  "Computer Engineering",
  "Computer Science",
  "Dance",
  "Earth Sciences",
  "East Asian Studies",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Electronic Music",
  "Film and Digital Media",
  "Global Information Social Enterprise Studies",
  "History of Art and Visual Culture",
  "History",
  "Italian Studies",
  "Jazz, Spontaneous Composition and Improvisation",
  "Jewish Studies",
  "Latin American/Latino Studies",
  "Language Studies",
  "Legal Studies",
  "Linguistics",
  "Literature",
  "Mathematics",
  "Middle Eastern and North African Studies",
  "Philosophy",
  "Physics",
  "Politics",
  "Statistics",
  "Science, Technology, Engineering, and Mathematics Education",
  "Spanish Studies",
  "Sustainability Studies",
  "Technology and Information Management",
  "Theater Arts",
  "Western Art Music",
];

const catalogYears = ["2020-2021", "2021-2022", "2022-2023", "2023-2024"];

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
    for (const y of catalogYears) {
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
    for (const y of catalogYears) {
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
