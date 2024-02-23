import { Major } from "@/app/types/Major";
import { Binder, RequirementList } from "@/app/types/Requirements";
import prisma from "@/lib/prisma";
import {
  getAllRequirementLists,
  getMajorRequirements,
  saveMajorRequirements,
} from "@actions/majorRequirements";
import { ProgramType, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { User } from "../common/Types";
import { createDate, createMajor, createUser } from "../common/utils";

describe("Major Requirements Actions", () => {
  beforeAll(async () => {
    const major = await createMajor(
      "Computer Science B.S",
      "2019-2020",
      ProgramType.Major,
    );
    console.log("✨ 1 major successfully created!");
    const adminEmail = "sammyslug@ucsc.edu";

    const user = await createUser({
      email: adminEmail,
      name: "Sammy Slug",
      role: Role.ADMIN,
      majors: [major],
    });
    await createUser({
      email: "sslug@ucsc.edu",
      name: "Samuel Slug",
    });

    // add permissions
    await prisma.permissions.create({
      data: {
        userEmail: adminEmail,
        majorEditingPermissions: {
          create: [
            {
              major: {
                connect: {
                  id: major.id,
                },
              },
              expirationDate: createDate(1),
            },
          ],
        },
      },
    });

    console.log("✨ 2 users successfully created!");

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
    const { success } = await saveMajorRequirements(
      majorRequirementsData,
      major!.id,
      user!.id,
    );

    expect(success).toBe(true);

    console.log("✨ major requirements successfully created!");
  });

  afterAll(async () => {
    await prisma.permissions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.majorRequirement.deleteMany();
    await prisma.major.deleteMany();
  });

  let major: Major | null;
  let user: User;
  beforeEach(async () => {
    major = await prisma.major.findFirst();
    expect(major).not.toBeNull();

    user = await prisma.user.findFirst({
      where: {
        name: "Samuel Slug",
      },
    });
    expect(user).not.toBeNull();
  });

  it("should get major requirements for a major", async () => {
    const majorRequirements = await getMajorRequirements(major!.id);
    expect(majorRequirements.requirements).toHaveLength(1);
  });

  it("should fail to save major requirements for a user without permission", async () => {
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
    expect(result).toEqual({ success: false });
  });

  it("should return all requirement lists", async () => {
    const requirements = await getAllRequirementLists();
    expect(requirements).toHaveLength(1);
  });

  it("should return all major requirements", async () => {
    const majorRequirements = await getMajorRequirements(major!.id);
    expect(majorRequirements.requirements).toHaveLength(1);
  });

  it("should return an empty major requirement list if the major does not exist", async () => {
    const majorReqs = await getMajorRequirements(major!.id + 1);
    expect(majorReqs.requirements).toHaveLength(0);
  });
});
