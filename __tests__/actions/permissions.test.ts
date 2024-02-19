import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";
import prisma from "@/lib/prisma";
import {
  getPermissions,
  savePermissions,
  userHasMajorEditingPermission,
} from "@actions/permissions";
import { Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

/**
 * @param name is the name of the major
 * @param catalogYear is the catalog year of the major
 * @returns the object or the major that was created
 */
export async function createMajor(
  name: string,
  catalogYear: string,
): Promise<Major> {
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

// returns todays date + days
function createDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

beforeAll(async () => {
  const sammyEmail = "sammyslug@ucsc.edu";
  const newMajor = await createMajor("Computer Science B.S", "2020-2021");

  await prisma.user.create({
    data: {
      id: uuidv4(),
      email: "sammyslug@ucsc.edu",
      name: "Sammy Slug",
      role: Role.ADMIN,
      major: {
        connect: {
          id: newMajor.id,
        },
      },
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

  // add permissions
  await prisma.permissions.create({
    data: {
      userEmail: sammyEmail,
      majorEditingPermissions: {
        create: [
          {
            major: {
              connect: {
                id: newMajor.id,
              },
            },
            expirationDate: createDate(1),
          },
        ],
      },
    },
  });

  console.log("✨ 4 courses successfully created!");
});

afterAll(async () => {
  await prisma.user.deleteMany();
  await prisma.permissions.deleteMany();
  await prisma.major.deleteMany();

  expect(await prisma.user.count()).toBe(0);
  await prisma.$disconnect();
});

it("should check that user has major editing permission", async () => {
  const major = await prisma.major.findFirst();
  expect(major).not.toBeNull();
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  const hasPermission = await userHasMajorEditingPermission(user!.id);
  expect(hasPermission).toBe(true);
});

it("should check that other users do not have major editing permission", async () => {
  const major = await prisma.major.findFirst();
  expect(major).not.toBeNull();
  const user = await prisma.user.findFirst({
    where: {
      name: "Samuel Slug",
    },
  });
  expect(user).not.toBeNull();

  const hasPermission = await userHasMajorEditingPermission(user!.id);
  expect(hasPermission).toBe(false);
});

it("should check that getPermissions works using savePermissions", async () => {
  // delete permissions
  await prisma.permissions.deleteMany();

  const newMajor = await createMajor("Computer Science B.A", "2020-2021");

  const permissions: Permissions[] = [
    {
      userEmail: "sammyslug@ucsc.edu",
      majorEditingPermissions: [
        {
          major: newMajor,
          expirationDate: createDate(1),
        },
      ],
    },
  ];
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  const result = await savePermissions(user!.id, permissions);
  expect(result.title).toBe("OK");

  const allPermissions: Permissions[] = await getPermissions();

  // check that all permissions are in allPermissions
  expect(
    permissions.every((permission) => {
      return allPermissions.some((allPermission) => {
        return permission.userEmail === allPermission.userEmail;
      });
    }),
  ).toBe(true);
});
