"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

import { Permissions } from "../types/Permissions";

export async function savePermissions(
  userId: string,
  permissions: Permissions[],
) {
  if ((await getUserRole(userId)) !== Role.ADMIN)
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
              programType: true,
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

export async function getUserPermissions(
  userId: string,
): Promise<Permissions | null> {
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

  const permissions = await prisma.permissions.findUnique({
    where: {
      userEmail: user?.email,
    },
    select: {
      majorEditingPermissions: {
        select: {
          major: {
            select: {
              id: true,
              name: true,
              catalogYear: true,
              programType: true,
            },
          },
          expirationDate: true,
        },
      },
      userEmail: true,
    },
  });

  return permissions;
}

export async function userHasMajorEditPermission(
  userId: string,
  majorId: number,
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);

  if (permissions?.majorEditingPermissions) {
    return permissions?.majorEditingPermissions.some((majorEditPerm) => {
      return majorEditPerm.major.id == majorId;
    });
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
