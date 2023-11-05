import { PlannerService } from "@/graphql/planner/service";
import { createQuarters } from "@/lib/initialPlanner";
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
  const res = await service.upsert(user.id, {
    id: plannerId,
    title: "Planner 1",
    active: true,
    p: {
      quarterOrder: createQuarters().quarterOrder,
      quartersPerYear: 4,
      quarters: createQuarters().quarters,
      years: 4,
    },
  });
  expect(res).toBe(plannerId);

  const check = await service.getPlanner(user.id, plannerId);
  expect(check).not.toBeNull();

  // Cleanup
  const deleted = await service.deletePlanner(user.id, plannerId);
  expect(deleted).toBeTruthy();
  const deleteCheck = await service.getPlanner(user.id, plannerId);
  expect(deleteCheck).toBeNull();
});
