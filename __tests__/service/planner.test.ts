import { PlannerData } from "@/app/types/Planner";
import { initialPlanner } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
import { coursesBy, getAllDepartments } from "@actions/course";
import {
  getAllMajorsByCatalogYear,
  getMajorDefaultPlanners,
  getUserMajorByEmail,
  updateUserMajor,
} from "@actions/major";
import {
  deletePlanner,
  getAllPlanners,
  getPlanner,
  saveAllPlanners,
} from "@actions/planner";
import { expect } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "sammyslug@ucsc.edu",
      name: "Sammy Slug",
    },
  });

  console.log("✨ 1 user successfully created!");

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
        description:
          "Introduction to C programming language and computer programming in a UNIX environment. Topics include program structure, UNIX editors, compiling and linking, debugging tools, fundamentals of C programming, basic algorithms and data structures, and basic UNIX commands.",
        departmentCode: "CSE",
        title: "Computer Systems and C Programming",
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
          "introduction to the design and analysis of algorithms. Divide-and-conquer, dynamic programming, greedy algorithms, amortized analysis, randomization, and basic data structures. Credit is not given for both this course and CSE 101.",
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
        prerequisites: "None",
        description:
          "Introduction to differential calculus of functions of one variable. Definition of the derivative, basic differentiation techniques, applications to graphing, rates, approximations, and extremum problems. Introduction to integral calculus of functions of one variable. Fundamental theorem of calculus, basic techniques of integration. Applications of the integral to area, volume, work, average value, center of mass, and probability. Prerequisite(s): Two years of high school algebra and a score of 3 or higher on the AP Calculus AB exam, or Math Placement Exam qualifying score.",
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
    prisma.quarter.deleteMany(),
    prisma.course.deleteMany(),
    prisma.label.deleteMany(),
    prisma.major.deleteMany(),
  ]);

  await prisma.$disconnect();
});

it("should create 1 empty planner for 1 user", async () => {
  const user = await getUser();
  const planners = await getAllPlanners(user.email);
  expect(planners).toHaveLength(0);

  const plannerId = await createPlanner(initialPlanner(), user);

  // Cleanup
  const deleted = await deletePlanner({ userId: user.id, plannerId });
  expect(deleted).toBeTruthy();
  const deleteCheck = await getPlanner({
    userId: user.id,
    plannerId,
  });
  expect(deleteCheck).toBeNull();
});

it("should update 1 planner for 1 user", async () => {
  const user = await getUser();
  const planners = await getAllPlanners(user.email);
  expect(planners).toHaveLength(0);

  const plannerId = await createPlanner(initialPlanner(), user);

  // Update planner with some courses
  const cseCourses = [
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "12",
      title: "CSE 12",
      description:
        "Introduction to computer organization and systems programming. Study of number representations, assembly language, and machine organization. Includes laboratory.",
      credits: 7,
      ge: ["None"],
      quartersOffered: ["Fall", "Winter"],
      labels: [],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "16",
      title: "CSE 16",
      credits: 5,
      description:
        "Introduction to discrete mathematics, formal logic, and set theory. Topics include propositional and predicate logic; elementary set theory; proof techniques; mathematical induction; elementary combinatorics, probability theory, and graph theory; and applications in computer science.",
      ge: ["mf", "si"],
      quartersOffered: ["Fall", "Winter", "Spring"],
      labels: [],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      title: "CSE 30",
      description:
        "Introduction to Python programming. Topics include program structure, Python syntax and semantics, variables, expressions, conditionals, iteration, functions, objects, and classes. Assignments include programming problems and exercises on the theoretical concepts covered in class.",
      number: "30",
      credits: 5,
      ge: ["None"],
      quartersOffered: ["Fall", "Winter", "Spring"],
      labels: [],
    },
    {
      id: uuidv4(),
      departmentCode: "SGI",
      title: "Custom class",
      number: "40N",
      description: "My custom class",
      credits: 5,
      ge: [],
      quartersOffered: ["Summer"],
      labels: [],
    },
  ];
  const plannerData = initialPlanner();
  plannerData.id = plannerId;
  cseCourses.forEach((c) => {
    plannerData.quarters[0].courses.push(c.id);
    plannerData.courses.push(c);
  });

  await saveAllPlanners({
    userId: user.id,
    planners: [plannerData],
  });
  // Ensure there is only 1 planner for that user
  const allPlanners = await getAllPlanners(user.email);
  expect(allPlanners).toHaveLength(1);
  // Ensure the content of that planner is updated
  const check2 = await getPlanner({ userId: user.id, plannerId });
  expect(check2).not.toBeNull();
  const courses = check2?.quarters[0].courses;
  expect(courses).toBeDefined();
  expect(courses).toHaveLength(cseCourses.length);
  courses?.forEach((c, idx) => {
    expect(c).toStrictEqual(cseCourses[idx].id);
  });
  // Cleanup
  const deleted = await deletePlanner({ userId: user.id, plannerId });
  expect(deleted).toBeTruthy();
  const deleteCheck = await getPlanner({
    userId: user.id,
    plannerId,
  });
  expect(deleteCheck).toBeNull();
});

it("should return null to delete missing planner", async () => {
  const user = await getUser();
  const res = await deletePlanner({
    plannerId: uuidv4(),
    userId: user.id,
  });

  expect(res).toBeNull();
});

it("should handle department retrieval correctly", async () => {
  const departments = await getAllDepartments();

  expect(departments).toBeDefined();
  expect(Array.isArray(departments)).toBe(true);
  expect(departments).toContainEqual(
    expect.objectContaining({ label: "Computer Science and Engineering" }),
  );
  expect(departments).toContainEqual(
    expect.objectContaining({ label: "Mathematics" }),
  );
});

it("should filter courses by GE requirement", async () => {
  // Test filtering by a specific GE requirement
  const geFilter = "mf";
  const filteredCourses = await coursesBy({
    departmentCode: "CSE",
    ge: geFilter,
  });

  // Assert that all returned courses have the specified GE requirement
  expect(filteredCourses).toBeDefined();
  expect(Array.isArray(filteredCourses)).toBe(true);
  filteredCourses.forEach((course) => {
    expect(course.ge).toContain(geFilter);
  });

  // Assert that at least one course is returned
  expect(filteredCourses.length).toBeGreaterThan(0);
});

it("should return the correct labels for each course", async () => {
  const user = await getUser();
  const planners = await getAllPlanners(user.email);
  expect(planners).toHaveLength(0);

  const plannerData = initialPlanner();
  plannerData.labels[0].name = "Elective";
  plannerData.labels[1].name = "Capstone";
  plannerData.labels[2].name = "DC";
  const cseCourses = [
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "12",
      title: "CSE 12",
      credits: 7,
      ge: ["None"],
      quartersOffered: ["Fall", "Winter"],
      description:
        "Introduction to computer organization and systems programming. Study of number representations, assembly language, and machine organization. Includes laboratory.",
      labels: [],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "16",
      title: "CSE 16",
      description:
        "Introduction to discrete mathematics, formal logic, and set theory. Topics include propositional and predicate logic; elementary set theory; proof techniques; mathematical induction; elementary combinatorics, probability theory, and graph theory; and applications in computer science.",
      credits: 5,
      ge: ["mf", "si"],
      quartersOffered: ["Fall", "Winter", "Spring"],
      labels: [plannerData.labels[0].id, plannerData.labels[2].id],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      title: "CSE 30",
      number: "30",
      credits: 5,
      description:
        "Introduction to Python programming. Topics include program structure, Python syntax and semantics, variables, expressions, conditionals, iteration, functions, objects, and classes. Assignments include programming problems and exercises on the theoretical concepts covered in class.",
      ge: ["None"],
      quartersOffered: ["Fall", "Winter", "Spring"],
      labels: [plannerData.labels[0].id, plannerData.labels[1].id],
    },
    {
      id: uuidv4(),
      departmentCode: "SGI",
      title: "Custom class",
      number: "40N",
      credits: 5,
      ge: [],
      description: "My custom class",
      quartersOffered: ["Summer"],
      labels: [plannerData.labels[0].id],
    },
  ];
  plannerData.courses = cseCourses;
  plannerData.quarters[0].courses = plannerData.courses.map((c) => c.id);

  await saveAllPlanners({
    userId: user.id,
    planners: [plannerData],
  });
  // Ensure there is only 1 planner for that user
  const allPlanners = await getAllPlanners(user.email);
  expect(allPlanners).toHaveLength(1);
  // Ensure the content of that planner is updated
  const check2 = await getPlanner({
    userId: user.id,
    plannerId: plannerData.id,
  });
  expect(check2).not.toBeNull();
  const courses = check2?.quarters[0].courses;
  expect(courses).toBeDefined();
  expect(courses).toHaveLength(cseCourses.length);
  courses?.forEach((c, idx) => {
    expect(c).toStrictEqual(cseCourses[idx].id);
  });

  // Cleanup
  await prisma.planner.deleteMany();
});

it("should add major information for 1 user", async () => {
  const user = await getUser();

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

  const userMajor = await getUserMajorByEmail(user.email);
  expect(userMajor).toBeNull();

  const defaultPlannerId = uuidv4();
  const res = await updateUserMajor({
    userId: user.id,
    ...majorData,
    defaultPlannerId,
  });
  expect(res).not.toBeNull();
  expect(res?.name).toBe(name);
  expect(res?.catalogYear).toBe(catalogYear);

  const check = await getUserMajorByEmail(user.email);
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
  const user = await getUser();
  const userMajor = await getUserMajorByEmail(user.email);
  expect(userMajor).toBeNull();

  const defaultPlannerId = uuidv4();
  const name = "Unknown major";
  const catalogYear = "2020-2021";

  await expect(
    updateUserMajor({
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

  const res = await getMajorDefaultPlanners({
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
  const res = await getAllMajorsByCatalogYear("2020-2021");
  expect(res).toHaveLength(0);

  await prisma.major.create({
    data: {
      catalogYear: "2020-2021",
      name: "Computer Engineering B.S.",
    },
  });

  const res2 = await getAllMajorsByCatalogYear("2020-2021");
  expect(res2).toHaveLength(1);
});

async function getUser() {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  if (user === null) fail("User was null (this should not happen)");

  return user;
}

async function createPlanner(planner: PlannerData, user: any): Promise<string> {
  await saveAllPlanners({
    userId: user.id,
    planners: [planner],
  });

  const check = await getPlanner({ userId: user.id, plannerId: planner.id });
  expect(check).not.toBeNull();

  return planner.id;
}
