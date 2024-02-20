"use server";

import prisma from "@/lib/prisma";

import { Permissions } from "../types/Permissions";
import { getUserMajorById } from "./major";

export async function savePermissions(
  userId: string,
  permissions: Permissions[],
) {
  if ((await getUserRole(userId)) !== "ADMIN")
    throw new Error("User is not an admin");

  const operations: any[] = [];
  operations.push(prisma.permissions.deleteMany());

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

  await prisma.$transaction([...operations]);

  return { success: true };
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
      role: true,
    },
  });

  if (!user) throw new Error(`User ${userId} not found`);

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

  if (!user) throw new Error(`User ${userId} not found`);
  return user.role;
}
