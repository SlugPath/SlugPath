import { Major } from "@/app/types/Major";
import { Binder, RequirementList } from "@/app/types/Requirements";
import prisma from "@/lib/prisma";
import {
  getMajorRequirements,
  saveMajorRequirements,
} from "@actions/majorRequirements";
import { Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

async function createAMajor(name: string, catalogYear: string): Promise<Major> {
  const majorData = {
    name,
    catalogYear,
  };
  return prisma.major.create({
    data: {
      ...majorData,
    },
  });
}

beforeAll(async () => {
  const sammyEmail = "sammyslug@ucsc.edu";
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email: sammyEmail,
      name: "Sammy Slug",
      role: Role.ADMIN,
    },
  });
  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "sslug@ucsc.edu",
      name: "Samuel Slug",
    },
  });

  console.log("✨ 2 users successfully created!");

  const major = await createAMajor("Computer Science B.S", "2020-2021");
  console.log("✨ 1 major successfully created!");

  const majorRequirementsData: RequirementList = {
    id: uuidv4(),
    binder: Binder.AND,
    requirements: [
      {
        id: "1",
        departmentCode: "CSE",
        number: "12",
        credits: 5,
        title: "Coding class",
        quartersOffered: ["Fall", "Winter", "Spring"],
        description: "This is a coding class",
        labels: [],
        ge: [],
      },
    ],
  };
  await saveMajorRequirements(majorRequirementsData, major!.id, user!.id);

  console.log("✨ major requirements successfully created!");
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.majorRequirement.deleteMany();
  await prisma.major.deleteMany();
});

it("should get major requirements for a major", async () => {
  const major = await prisma.major.findFirst({});
  const majorRequirements = await getMajorRequirements(major!.id);
  expect(majorRequirements.requirements).toHaveLength(1);
});

it("should fail to save major requirements for a user without permission", async () => {
  const user = await prisma.user.findFirst({
    where: {
      name: "Samuel Slug",
    },
  });
  expect(user).not.toBeNull();

  const major = await prisma.major.findFirst({});
  expect(major).not.toBeNull();

  const majorRequirementsData: RequirementList = {
    id: uuidv4(),
    binder: Binder.AND,
    requirements: [
      {
        id: "1",
        departmentCode: "CSE",
        number: "12",
        credits: 5,
        title: "Coding class",
        quartersOffered: ["Fall", "Winter", "Spring"],
        description: "This is a coding class",
        labels: [],
        ge: [],
      },
    ],
  };
  const result = await saveMajorRequirements(
    majorRequirementsData,
    major!.id,
    user!.id,
  );
  expect(result!.error).not.toBeNull();
});
