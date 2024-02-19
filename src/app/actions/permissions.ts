"use server";

import prisma from "@/lib/prisma";

import { Permissions } from "../types/Permissions";
import { getUserMajorById } from "./major";

export async function savePermissions(
  userId: string,
  permissions: Permissions[],
) {
  if ((await getUserRole(userId)) !== "ADMIN")
    return { error: "User is not an admin" };

  await prisma.permissions.deleteMany();

  const operations: any[] = [];

  permissions.forEach(async (permission) => {
    if (permission.userEmail !== undefined) {
      operations.push(
        prisma.permissions.upsert({
          where: {
            userEmail: permission.userEmail,
          },
          update: {
            majorEditingPermissions: {
              create: permission.majorEditingPermissions.map(
                (majorEditPerm) => {
                  return {
                    major: {
                      connect: {
                        id: majorEditPerm.major.id,
                      },
                    },
                    expirationDate: majorEditPerm.expirationDate,
                  };
                },
              ),
            },
          },
          create: {
            userEmail: permission.userEmail,
            majorEditingPermissions: {
              create: permission.majorEditingPermissions.map(
                (majorEditPerm) => {
                  return {
                    major: {
                      connect: {
                        id: majorEditPerm.major.id,
                      },
                    },
                    expirationDate: majorEditPerm.expirationDate,
                  };
                },
              ),
            },
          },
        }),
      );
    }
  });

  try {
    await prisma.$transaction([...operations]);
    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
}

export async function getPermissions(): Promise<Permissions[]> {
  const usersPermissions = await prisma.permissions.findMany({
    select: {
      userEmail: true,
      majorEditingPermissions: {
        select: {
          major: {
            select: {
              id: true,
              name: true,
              catalogYear: true,
            },
          },
          expirationDate: true,
          id: true,
        },
      },
    },
  });

  if (usersPermissions === null) {
    return [];
  }

  return usersPermissions;
}

export async function userHasMajorEditingPermission(
  userId: string,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) return false;

  const major = await getUserMajorById(userId);
  if (!major) return false;

  const permissions = await prisma.permissions.findUnique({
    where: {
      userEmail: user.email,
    },
    select: {
      majorEditingPermissions: {
        select: {
          major: {
            select: {
              id: true,
            },
          },
          expirationDate: true,
        },
      },
    },
  });

  if (!permissions) return false;

  for (const majorEditPerm of permissions.majorEditingPermissions) {
    if (majorEditPerm.major.id == major.id) {
      return majorEditPerm.expirationDate > new Date();
    }
  }
  return false;
}

export async function getUserRole(userId: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      role: true,
    },
  });

  if (user?.role !== undefined) {
    return user.role;
  }

  return "USER";
}
