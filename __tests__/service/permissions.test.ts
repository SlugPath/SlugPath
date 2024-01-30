import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Role } from "@prisma/client";
import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";
import {
  getPermissions,
  savePermissions,
  userHasMajorEditingPermission,
} from "@/app/actions/permissionsActions";

// returns major object
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

// returns todays date + days
function createDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

beforeAll(async () => {
  const sammyEmail = "sammyslug@ucsc.edu";
  await prisma.user.create({
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
      email: "samuelslug@ucsc.edu",
      name: "Samuel Slug",
    },
  });

  console.log("✨ 2 users successfully created!");

  const newMajor = await createAMajor("Computer Science B.S", "2020-2021");

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
});

it("should check that user has major editing permission", async () => {
  const major = await prisma.major.findFirst({});
  expect(major).not.toBeNull();
  const user = await prisma.user.findFirst({
    where: {
      name: "Sammy Slug",
    },
  });
  expect(user).not.toBeNull();

  const hasPermission = await userHasMajorEditingPermission(user!.id, major!);
  expect(hasPermission).toBe(true);
});

// it("should check that savePermissions works", async () => {

//   // create a different major
//   const newMajor = await createAMajor("Computer Science B.A", "2020-2021");

//   const permissions = [
//     {
//       userEmail: "sammyslug@ucsc.edu",
//       majorEditingPermissions: [
//         {
//           major: newMajor,
//           expirationDate: createDate(1),
//         },
//       ],
//     }
//   ]

//   const result = await savePermissions(permissions)
//   expect(result.title).toBe("OK")

//   const user = await prisma.user.findFirst({
//     where: {
//       name: "Sammy Slug",
//     },
//   });
//   expect(user).not.toBeNull();

//   const hasPermission = await userHasMajorEditingPermission(user!.id, newMajor);
//   expect(hasPermission).toBe(true);
// });

it("should check that other users do not have major editing permission", async () => {
  const major = await prisma.major.findFirst({});
  expect(major).not.toBeNull();
  const user = await prisma.user.findFirst({
    where: {
      name: "Samuel Slug",
    },
  });
  expect(user).not.toBeNull();

  const hasPermission = await userHasMajorEditingPermission(user!.id, major!);
  expect(hasPermission).toBe(false);
});

it("should check that getPermissions works using savePermissions", async () => {
  // delete permissions
  await prisma.permissions.deleteMany();

  const newMajor = await createAMajor("Computer Science B.A", "2020-2021");

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

  const result = await savePermissions(permissions);
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
