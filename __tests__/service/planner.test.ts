import { CourseService } from "@/graphql/course/service";
import { PlannerService } from "@/graphql/planner/service";
import { initialPlanner, serializePlanner } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
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
        ge: ["None"],
        quartersOffered: ["Fall", "Winter", "Spring"],
      },
    ],
  });

  console.log("✨ 4 courses successfully created!");
});

afterAll(async () => {
  const deleteUsers = prisma.user.deleteMany();
  const deleteQuarters = prisma.quarter.deleteMany();
  const deleteCourses = prisma.course.deleteMany();

  await prisma.$transaction([deleteUsers, deleteQuarters, deleteCourses]);

  await prisma.$disconnect();
});

it("should create 1 empty planner for 1 user", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  if (user === null) fail("User was null (this should not happen)");

  const service = new PlannerService();
  const planners = await service.allPlanners(user.id);
  expect(planners).toHaveLength(0);

  // Empty planner
  const plannerId = uuidv4();
  const res = await service.upsertPlanner({
    userId: user.id,
    plannerId: plannerId,
    title: "Planner 1",
    order: 0,
    plannerData: serializePlanner(initialPlanner),
  });
  expect(res.plannerId).toBe(plannerId);

  const check = await service.getPlanner({ userId: user.id, plannerId });
  expect(check).not.toBeNull();

  // Cleanup
  const deleted = await service.deletePlanner({ userId: user.id, plannerId });
  expect(deleted).toBeTruthy();
  const deleteCheck = await service.getPlanner({ userId: user.id, plannerId });
  expect(deleteCheck).toBeNull();
});

it("should update 1 planner for 1 user", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  if (user === null) fail("User was null (this should not happen)");

  const service = new PlannerService();
  const planners = await service.allPlanners(user.id);
  expect(planners).toHaveLength(0);
  const plannerId = uuidv4();

  // Create empty planner
  const res1 = await service.upsertPlanner({
    userId: user.id,
    plannerId,
    title: "Planner 1",
    order: 0,
    plannerData: serializePlanner(initialPlanner),
  });
  expect(res1.plannerId).toBe(plannerId);

  const check1 = await service.getPlanner({ userId: user.id, plannerId });
  expect(check1).not.toBeNull();

  // Update planner with some courses
  const cseCourses = [
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "12",
      credits: 7,
      ge: ["None"],
      quartersOffered: ["Fall", "Winter"],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "16",
      credits: 5,
      ge: ["mf", "si"],
      quartersOffered: ["Fall", "Winter", "Spring"],
    },
    {
      id: uuidv4(),
      departmentCode: "CSE",
      number: "30",
      credits: 5,
      ge: ["None"],
      quartersOffered: ["Fall", "Winter", "Spring"],
    },
  ];
  const plannerData = initialPlanner;
  cseCourses.forEach((c) => {
    const { id, ...rest } = c;
    plannerData.quarters[0].courses.push(id);
    plannerData.courseTable[id] = rest;
  });

  const res2 = await service.upsertPlanner({
    userId: user.id,
    plannerId: plannerId,
    title: "Planner 1",
    order: 0,
    plannerData: serializePlanner(plannerData),
  });
  expect(res2.plannerId).toBe(plannerId);

  // Ensure there is only 1 planner for that user
  const allPlanners = await service.allPlanners(user.id);
  expect(allPlanners).toHaveLength(1);
  // Ensure the content of that planner is updated
  const check2 = await service.getPlanner({ userId: user.id, plannerId });
  expect(check2).not.toBeNull();
  const courses = check2?.quarters[0].courses;
  expect(courses).toBeDefined();
  expect(courses).toHaveLength(3);
  courses?.forEach((c, idx) => {
    expect(c).toStrictEqual(cseCourses[idx]);
  });
  // Cleanup
  const deleted = await service.deletePlanner({ userId: user.id, plannerId });
  expect(deleted).toBeTruthy();
  const deleteCheck = await service.getPlanner({ userId: user.id, plannerId });
  expect(deleteCheck).toBeNull();
});

it("should return null to delete missing planner", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  if (user === null) fail("User was null (this should not happen)");

  const service = new PlannerService();

  const res = await service.deletePlanner({
    plannerId: uuidv4(),
    userId: user.id,
  });

  expect(res).toBeNull();
});

it("should handle department retrieval correctly", async () => {
  const service = new CourseService();

  const departments = await service.getAllDepartments();

  expect(departments).toBeDefined();
  expect(Array.isArray(departments)).toBe(true);
  expect(departments).toContainEqual(
    expect.objectContaining({ name: "Computer Science and Engineering" }),
  );
  expect(departments).toContainEqual(
    expect.objectContaining({ name: "Mathematics" }),
  );
});
