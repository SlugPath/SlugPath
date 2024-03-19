import { PlannerData } from "@/app/types/Planner";
import { initialPlanner } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
import {
  getPlannerById,
  getUserPlanners,
  updateUserPlanners,
} from "@actions/planner";
import { expect } from "@jest/globals";
import { v4 as uuidv4 } from "uuid";

import { User } from "../common/Types";
import { createUser } from "../common/utils";

describe("Planner actions", () => {
  const cseCourses = () => [
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

  beforeAll(async () => {
    await createUser({
      email: `sammyslug@ucsc.edu`,
      name: "Sammy Slug",
    });

    console.log("✨ 1 user successfully created!");
  });

  afterAll(async () => {
    await prisma.$transaction([
      prisma.user.deleteMany(),
      prisma.quarter.deleteMany(),
      prisma.course.deleteMany(),
      prisma.label.deleteMany(),
      prisma.major.deleteMany(),
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
  });

  afterEach(async () => {
    await prisma.planner.deleteMany();
  });

  it("should create 1 empty planner for 1 user", async () => {
    expect(await getUserPlanners(user!.id)).toHaveLength(0);
    const id = await createPlanner(initialPlanner(), user!);
    expect(await getPlannerById(id)).toBeDefined();
  }, 7000);

  it("should update 1 planner for 1 user", async () => {
    expect(await getUserPlanners(user!.id)).toHaveLength(0);

    const plannerId = await createPlanner(initialPlanner(), user!);
    const plannerData = initialPlanner();
    const plannerCourses = cseCourses();

    plannerData.id = plannerId;
    plannerCourses.forEach((c) => {
      plannerData.quarters[0].courses.push(c.id);
      plannerData.courses.push(c);
    });

    await updateUserPlanners({
      userId: user!.id,
      planners: [plannerData],
    });
    // Ensure there is only 1 planner for that user
    const allPlanners = await getUserPlanners(user!.id);
    expect(allPlanners).toHaveLength(1);

    // Ensure the content of that planner is updated
    const check2 = await getPlannerById(plannerId);
    expect(check2).not.toBeNull();

    const courses = check2!.quarters[0].courses;
    expect(courses).toHaveLength(plannerCourses.length);
    courses?.forEach((c, idx) => {
      expect(c).toStrictEqual(plannerCourses[idx].id);
    });
  });

  it("should return an empty list if user is invalid", async () => {
    expect(await getUserPlanners("invalid-userid")).toHaveLength(0);
  });

  it("should throw an error if planner id is invalid", async () => {
    const plannerId = "invalid-id";
    await expect(getPlannerById(plannerId)).rejects.toThrow(
      `Planner with id ${plannerId} not found`,
    );
  });

  it("should throw an error if course id not found", async () => {
    const plannerData = initialPlanner();
    const plannerCourses = cseCourses();

    plannerData.id = uuidv4();
    plannerCourses.forEach((c, idx) => {
      plannerData.quarters[0].courses.push(`invalid-${idx}`);
      plannerData.courses.push(c);
    });

    await expect(
      updateUserPlanners({
        userId: user!.id,
        planners: [plannerData],
      }),
    ).rejects.toThrow(`Course with id invalid-0 not found`);
  });

  it("should return the correct labels for each course", async () => {
    const planners = await getUserPlanners(user!.id);
    expect(planners).toHaveLength(0);

    const plannerData = initialPlanner();
    const plannerCourses = cseCourses();
    plannerData.labels[0].name = "Elective";
    plannerData.labels[1].name = "Capstone";
    plannerData.labels[2].name = "DC";
    plannerData.courses = plannerCourses;
    plannerData.quarters[0].courses = plannerData.courses.map((c) => c.id);

    await updateUserPlanners({
      userId: user!.id,
      planners: [plannerData],
    });
    // Ensure there is only 1 planner for that user
    const allPlanners = await getUserPlanners(user!.id);
    expect(allPlanners).toHaveLength(1);
    // Ensure the content of that planner is updated
    const check2 = await getPlannerById(plannerData.id);
    expect(check2).not.toBeNull();
    const courses = check2?.quarters[0].courses;
    expect(courses).toBeDefined();
    expect(courses).toHaveLength(cseCourses().length);
    courses?.forEach((c, idx) => {
      expect(c).toStrictEqual(plannerCourses[idx].id);
    });
  });
});

async function createPlanner(
  planner: PlannerData,
  user: { id: string },
): Promise<string> {
  await updateUserPlanners({
    userId: user.id,
    planners: [planner],
  });

  const check = await getPlannerById(planner.id);
  expect(check).not.toBeNull();

  return planner.id;
}
