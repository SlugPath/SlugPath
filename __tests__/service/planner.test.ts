import { PlannerService } from "@/graphql/planner/service";
import { initialPlanner } from "@/lib/initialPlanner";
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
        name: "Computer Systems and Assembly Language and Lab",
        department: "CSE",
        number: "12",
        credits: 7,
      },
      {
        name: "Computer Systems and C Programming",
        department: "CSE",
        number: "13S",
        credits: 7,
      },
      {
        name: "Introduction to Data Structures and Algorithms",
        department: "CSE",
        number: "101",
        credits: 5,
      },
      {
        name: "Introduction to Algorithm Analysis",
        department: "CSE",
        number: "102",
        credits: 5,
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
    plannerData: initialPlanner,
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
    plannerData: initialPlanner,
  });
  expect(res1.plannerId).toBe(plannerId);

  const check1 = await service.getPlanner({ userId: user.id, plannerId });
  expect(check1).not.toBeNull();

  // Update planner with some courses
  const cseCourses = [
    {
      department: "CSE",
      number: "13S",
      quartersOffered: ["Fall", "Winter", "Spring"],
      credits: 7,
    },
    {
      department: "CSE",
      number: "16",
      quartersOffered: ["Fall", "Winter", "Spring"],
      credits: 5,
    },
    {
      department: "CSE",
      number: "30",
      quartersOffered: ["Fall", "Winter", "Spring"],
      credits: 5,
    },
  ];
  const plannerData = initialPlanner;
  initialPlanner.quarters[0].courses = cseCourses;

  const res2 = await service.upsertPlanner({
    userId: user.id,
    plannerId: plannerId,
    title: "Planner 1",
    order: 0,
    plannerData,
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
