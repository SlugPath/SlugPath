import { MajorService } from "@/graphql/major/service";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "sammyslug@ucsc.edu",
      name: "Sammy Slug",
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "samuelslug@ucsc.edu",
      name: "Samuel Slug",
    },
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
        number: "13S",
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
        number: "101",
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
        number: "102",
        credits: 5,
        prerequisites: "None",
        ge: ["None"],
        quartersOffered: ["Fall", "Winter", "Spring"],
      },
      {
        department: "Mathematics",
        departmentCode: "Math",
        title: "Calculus",
        number: "19A",
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
  ]);

  await prisma.$disconnect();
});

it("should add major information for 1 user", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  // create major
  const name = "Computer Science B.S";
  const catalogYear = "2020-2021";
  const majorData = {
    name,
    catalogYear,
  };
  await prisma.major.create({
    data: {
      ...majorData,
    },
  });

  if (user === null) fail("User was null (this should not happen)");

  const service = new MajorService();
  const userMajor = await service.getUserMajor(user.id);
  expect(userMajor).toBeNull();

  const defaultPlannerId = uuidv4();
  const res = await service.updateUserMajor({
    userId: user.id,
    ...majorData,
    defaultPlannerId,
  });
  expect(res.name).toBe(name);
  expect(res.catalogYear).toBe(catalogYear);

  const check = await service.getUserMajor(user.id);
  expect(check).not.toBeNull();
  expect(check?.catalogYear).toBe(catalogYear);
  expect(check?.name).toBe(name);
  expect(check?.defaultPlannerId).toBe(defaultPlannerId);

  // Clean up
  await prisma.major.deleteMany();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      major: undefined,
    },
  });
});

it("should fail since major doesn't exist", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();
  if (user === null) fail("User was null (this should not happen)");

  const service = new MajorService();
  const userMajor = await service.getUserMajor(user.id);
  expect(userMajor).toBeNull();

  const defaultPlannerId = uuidv4();
  const name = "Unknown major";
  const catalogYear = "2020-2021";

  await expect(
    service.updateUserMajor({
      userId: user.id,
      name,
      catalogYear,
      defaultPlannerId,
    }),
  ).rejects.toThrow(
    `could not find major with name ${name} and catalog year ${catalogYear}`,
  );
});

it("should return an empty list", async () => {
  const name = "Brand New Major B.S";
  const catalogYear = "2020-2021";

  await prisma.major.create({
    data: {
      name,
      catalogYear,
    },
  });

  const res = await new MajorService().getMajorDefaultPlanners({
    name,
    catalogYear,
  });

  await prisma.major.delete({
    where: {
      name_catalogYear: {
        name,
        catalogYear,
      },
    },
  });

  expect(res).toHaveLength(0);
});

it("should return correct number of majors", async () => {
  const res = await new MajorService().getAllMajors("2020-2021");
  expect(res).toHaveLength(0);

  await prisma.major.create({
    data: {
      catalogYear: "2020-2021",
      name: "Computer Engineering B.S.",
    },
  });

  const res2 = await new MajorService().getAllMajors("2020-2021");
  expect(res2).toHaveLength(1);
});

it("should correctly add major information for 2 users", async () => {
  const user1 = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user1).not.toBeNull();

  const user2 = await prisma.user.findFirst({
    where: {
      name: "Samuel Slug",
    },
  });
  expect(user2).not.toBeNull();

  // create major
  const name = "Computer Science B.S";
  const catalogYear = "2020-2021";
  const majorData = {
    name,
    catalogYear,
  };
  await prisma.major.create({
    data: {
      ...majorData,
    },
  });

  const service = new MajorService();
  const userMajor = await service.getUserMajor(user1?.id ?? "");
  expect(userMajor).toBeNull();
  const defaultPlannerId = uuidv4();

  // User 1
  const res = await service.updateUserMajor({
    userId: user1?.id ?? "",
    ...majorData,
    defaultPlannerId,
  });
  expect(res.name).toBe(name);
  expect(res.catalogYear).toBe(catalogYear);

  // User 2
  const res2 = await service.updateUserMajor({
    userId: user2?.id ?? "",
    ...majorData,
    defaultPlannerId,
  });
  expect(res2.name).toBe(name);
  expect(res2.catalogYear).toBe(catalogYear);

  const check = await service.getUserMajor(user1?.id ?? "");
  expect(check).not.toBeNull();
  expect(check?.catalogYear).toBe(catalogYear);
  expect(check?.name).toBe(name);
  expect(check?.defaultPlannerId).toBe(defaultPlannerId);

  const check2 = await service.getUserMajor(user2?.id ?? "");
  expect(check2).not.toBeNull();
  expect(check2?.catalogYear).toBe(catalogYear);
  expect(check2?.name).toBe(name);
  expect(check2?.defaultPlannerId).toBe(defaultPlannerId);
  // Clean up
  await prisma.major.deleteMany();

  await prisma.user.update({
    where: {
      id: user1?.id ?? "",
    },
    data: {
      major: undefined,
    },
  });
});
