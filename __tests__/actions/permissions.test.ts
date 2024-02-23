import { saveUserMajors } from "@/app/actions/major";
import { Major } from "@/app/types/Major";
import { Permissions } from "@/app/types/Permissions";
import prisma from "@/lib/prisma";
import {
  getPermissions,
  getUserPermissions,
  getUserRole,
  savePermissions,
  userHasMajorEditPermission,
} from "@actions/permissions";
import { ProgramType, Role } from "@prisma/client";

import { User } from "../common/Types";
import { createDate, createMajor, createUser } from "../common/utils";

describe("Permissions Actions", () => {
  const adminEmail = `sammyslug@ucsc.edu`;
  const userEmail = `samuelslime@ucsc.edu`;

  let newMajor: Major;

  beforeAll(async () => {
    newMajor = await createMajor(
      "Applied Physics B.S",
      "2020-2021",
      ProgramType.Major,
    );
    await createUser({
      email: adminEmail,
      name: "Sammy Slug",
      role: Role.ADMIN,
      majors: [newMajor],
    });

    await createUser({
      email: userEmail,
      name: "Samuel Slime",
    });

    console.log("✨ 2 users successfully created!");

    // add permissions
    await prisma.permissions.create({
      data: {
        userEmail: adminEmail,
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

  let adminUser: User;
  let user: User;

  beforeEach(async () => {
    adminUser = await prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    });

    expect(adminUser).not.toBeNull();

    user = await prisma.user.findFirst({
      where: {
        email: userEmail,
      },
    });

    expect(user).not.toBeNull();
  });

  afterEach(async () => {
    await prisma.permissions.deleteMany({
      where: {
        userEmail,
      },
    });
  });

  it("should check that other users do not have major editing permission", async () => {
    const major = await prisma.major.findFirst();
    expect(major).not.toBeNull();
    expect(await userHasMajorEditPermission(user!.id, major!.id)).toBe(false);
  });

  it("should check that user has major editing permission", async () => {
    const major = await prisma.major.findFirst();
    expect(major).not.toBeNull();
    expect(await userHasMajorEditPermission(adminUser!.id, major!.id)).toBe(
      true,
    );
  });

  it("should check that getPermissions works using savePermissions", async () => {
    const newMajor = await createMajor(
      "Theater B.A",
      "2020-2021",
      ProgramType.Major,
    );

    const permissions: Permissions[] = [
      {
        userEmail: adminEmail,
        majorEditingPermissions: [
          {
            major: newMajor,
            expirationDate: createDate(1),
          },
        ],
      },
    ];
    await expect(savePermissions(user!.id, permissions)).rejects.toThrow(
      "User is not an admin",
    );

    await expect(savePermissions(adminUser!.id, permissions)).resolves.toEqual({
      success: true,
    });

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

  describe("userHasMajorEditingPermission", () => {
    it("should return false if permissions are expired", async () => {
      const major = await prisma.major.findFirst();
      expect(major).not.toBeNull();

      const permissions: Permissions[] = [
        {
          userEmail: adminEmail,
          majorEditingPermissions: [
            {
              major: major!,
              expirationDate: createDate(-7),
            },
          ],
        },
      ];

      expect(await savePermissions(adminUser!.id, permissions)).toEqual({
        success: true,
      });
      expect(await userHasMajorEditPermission(user!.id, major!.id)).toBe(false);
    });

    it("should throw if user not found", async () => {
      await expect(await getUserPermissions("invalid")).rejects.toThrow(
        `User invalid not found`,
      );
    });

    it("should return false if permissions are not for current major", async () => {
      const major = await createMajor(
        "Marine Biology B.S",
        "2020-2021",
        ProgramType.Major,
      );
      const permissions: Permissions[] = [
        {
          userEmail,
          majorEditingPermissions: [
            {
              major: major!,
              expirationDate: createDate(1),
            },
          ],
        },
      ];

      expect(await savePermissions(adminUser!.id, permissions)).toEqual({
        success: true,
      });

      expect(await userHasMajorEditPermission(user!.id, newMajor.id)).toBe(
        false,
      );
    });

    it("should return false if user has no permissions but has a major", async () => {
      expect(await userHasMajorEditPermission(user!.id, newMajor.id)).toBe(
        false,
      );
    });

    beforeEach(async () => {
      await saveUserMajors({
        userId: user!.id,
        majors: [newMajor],
      });
    });

    afterAll(async () => {
      await saveUserMajors({
        userId: user!.id,
        majors: [],
      });
    });
  });

  it("should throw if user not found", async () => {
    await expect(getUserRole("invalid")).rejects.toThrow(
      `User invalid not found`,
    );
  });
});
