import { Major } from "@/app/types/Major";
import prisma from "@/lib/prisma";
import {
  getMajorDefaultPlanners,
  getPrograms,
  getUserProgramsByEmail,
  saveUserMajors,
} from "@actions/major";
import { ProgramType } from "@prisma/client";

import { User } from "../common/Types";
import { createUser, removeIdFromMajorOutput } from "../common/utils";

describe("Major actions", () => {
  beforeAll(async () => {
    await createUser({
      email: `sammyslug@ucsc.edu`,
      name: "Sammy Slug",
    });

    await createUser({
      email: "samuelslug@ucsc.edu",
      name: "Samuel Slug",
    });

    console.log("✨ 2 users successfully created!");

    await prisma.course.createMany({
      data: [
        {
          department: "Computer Science and Engineering",
          departmentCode: "CSE",
          title: "Computer Systems and Assembly Language and Lab",
          description:
            "Introduction to computer organization and systems programming. Study of number representations, assembly language, and machine organization. Includes laboratory.",
          number: "12",
          credits: 7,
          prerequisites: "CSE 20",
          ge: ["mf"],
          quartersOffered: ["Fall", "Winter", "Spring"],
        },
        {
          department: "Computer Science and Engineering",
          departmentCode: "CSE",
          title: "Computer Systems and C Programming",
          description:
            "Introduction to C programming language and computer programming in a UNIX environment. Topics include program structure, UNIX editors, compiling and linking, debugging tools, fundamentals of C programming, basic algorithms and data structures, and basic UNIX commands.",
          number: `13S`,
          credits: 7,
          prerequisites: "None",
          ge: ["si", "peT"],
          quartersOffered: ["Fall", "Winter"],
        },
        {
          department: "Computer Science and Engineering",
          departmentCode: "CSE",
          title: "Introduction to Data Structures and Algorithms",
          description:
            "Introduction to data structures and algorithms. Abstract data types including stacks, queues, priority queues, hash tables, binary trees, search trees, balanced trees and graphs. Sorting; asymptotic analysis; fundamental graph algorithms including graph search, shortest path, and minimum spanning trees; concurrency and synchronization. Credit is not given for both this course and CSE 100.",
          number: `101`,
          credits: 5,
          prerequisites: "None",
          ge: ["None"],
          quartersOffered: ["Fall", "Winter"],
        },
        {
          department: "Computer Science and Engineering",
          departmentCode: "CSE",
          title: "Introduction to Algorithm Analysis",
          description:
            "Introduction to the design and analysis of algorithms. Divide-and-conquer, dynamic programming, greedy algorithms, amortized analysis, randomization, and basic data structures. Credit is not given for both this course and CSE 101.",
          number: `102`,
          credits: 5,
          prerequisites: "None",
          ge: ["None"],
          quartersOffered: ["Fall", "Winter", "Spring"],
        },
        {
          department: "Mathematics",
          departmentCode: "Math",
          title: "Calculus",
          number: `19A`,
          credits: 5,
          description:
            "Introduction to differential and integral calculus of functions of one variable. Emphasis is on applications and problem solving using the tools of calculus. Topics include limits, the derivative, rules for differentiation, graphing strategy, optimization problems, differentials, implicit differentiation, related rates, exponential and logarithmic functions, antiderivatives, definite integrals, areas, and methods of integration. Further topics may include integration by parts, trigonometric substitution, partial fractions, integration by tables, arc length, and surface area.",
          prerequisites: "None",
          ge: ["None"],
          quartersOffered: ["Fall", "Winter", "Spring"],
        },
      ],
    });

    console.log("✨ 4 courses successfully created!");
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.major.deleteMany(),
      prisma.course.deleteMany(),
      prisma.planner.deleteMany(),
      prisma.permission.deleteMany(),
    ]);
  });

  let user: User;
  beforeEach(async () => {
    user = await prisma.user.findFirst({
      where: {
        name: "Sammy Slug",
      },
    });
    expect(user).not.toBeNull();
    expect(user!.email).toMatch(/sammyslug/);
  });

  afterEach(async () => {
    // Clean up
    await saveUserMajors({
      userId: user!.id,
      majors: [],
    });
    await prisma.major.deleteMany();
  });

  it("should add major information for 1 user", async () => {
    // Create major
    const name = "Anthropology B.A";
    const catalogYear = "2020-2021";
    const majorData = {
      name,
      catalogYear,
      programType: ProgramType.Major,
    };
    await prisma.major.create({
      data: {
        ...majorData,
      },
    });

    // const defaultPlannerId = uuidv4();
    const majors = [majorData];

    // Update user majors
    const res = removeIdFromMajorOutput(
      await saveUserMajors({
        userId: user!.id,
        majors: majors,
      }),
    );

    expect(majors).toStrictEqual(res);

    const check = removeIdFromMajorOutput(
      await getUserProgramsByEmail(user!.email),
    );
    expect(check).toStrictEqual(res);
  });

  it("should fail since major doesn't exist", async () => {
    const name = "Unknown major";
    const catalogYear = "2020-2021";

    await expect(
      await saveUserMajors({
        userId: user!.id,
        majors: [
          {
            name,
            catalogYear,
            programType: ProgramType.Major,
          },
        ],
      }),
    ).toStrictEqual([]);
  });

  it("should return an empty list", async () => {
    const name = "Brand New Major B.S";
    const catalogYear = "2020-2021";

    // get user
    const user = await prisma.user.findFirst({
      where: {
        name: "Samuel Slug",
      },
    });

    await prisma.major.create({
      data: {
        name,
        catalogYear,
        programType: ProgramType.Major,
      },
    });

    expect(
      await getMajorDefaultPlanners({
        userId: user!.id,
        major: {
          name,
          catalogYear,
          programType: ProgramType.Major,
        },
      }),
    ).toHaveLength(0);
  });

  it("should return correct number of majors", async () => {
    expect(await getPrograms()).toHaveLength(0);

    await prisma.major.create({
      data: {
        catalogYear: "2020-2021",
        name: "Robotics Engineering B.S.",
        programType: ProgramType.Major,
      },
    });

    expect(await getPrograms()).toHaveLength(1);
  });

  it('should return "null" for a user without a major', async () => {
    expect(await getUserProgramsByEmail("invalid@example.com")).toHaveLength(0);
  });

  it("should correctly add major information for 2 users", async () => {
    const user2 = await prisma.user.findFirst({
      where: {
        name: "Samuel Slug",
      },
    });
    expect(user2).not.toBeNull();
    expect(await getUserProgramsByEmail(user!.email)).toHaveLength(0);
    expect(await getUserProgramsByEmail(user2!.email)).toHaveLength(0);

    // Create major
    const name = "Computer Science B.S";
    const catalogYear = "2023-2024";
    const majorData = {
      name,
      catalogYear,
      programType: ProgramType.Major,
    };

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      updatedAt: _,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      createdAt: __,
      ...createdMajor
    } = await prisma.major.create({
      data: {
        ...majorData,
      },
    });

    const majorResult: Major[] = [createdMajor];

    // Update User 1
    expect(
      await saveUserMajors({
        userId: user!.id,
        majors: [majorData],
      }),
    ).toStrictEqual(majorResult);
    // Update User 2
    expect(
      await saveUserMajors({
        userId: user2!.id,
        majors: [majorData],
      }),
    ).toStrictEqual(majorResult);

    // Check if both users have the same major
    expect(await getUserProgramsByEmail(user!.email)).toStrictEqual(
      majorResult,
    );
    expect(await getUserProgramsByEmail(user2!.email)).toStrictEqual(
      majorResult,
    );
  });
});
