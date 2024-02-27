"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

import { Permission } from "../types/Permission";

export async function upsertPermission({
  userId,
  permission,
}: {
  userId: string;
  permission: Permission;
}): Promise<Permission> {
  if ((await getUserRole(userId)) !== Role.ADMIN)
    throw new Error("User is not an admin");

  // delete previous permissions if they exist
  if (
    await prisma.permission.findUnique({
      where: {
        userEmail: permission.userEmail,
      },
    })
  ) {
    await prisma.permission.delete({
      where: {
        userEmail: permission.userEmail,
      },
    });
  }

  const result = prisma.permission.upsert({
    where: {
      userEmail: permission.userEmail,
    },
    update: {
      majorEditingPermissions: {
        create: permission.majorEditingPermissions.map((majorEditPerm) => {
          return {
            major: {
              connect: {
                id: majorEditPerm.major.id,
              },
            },
            expirationDate: majorEditPerm.expirationDate,
          };
        }),
      },
    },
    create: {
      userEmail: permission.userEmail,
      majorEditingPermissions: {
        create: permission.majorEditingPermissions.map((majorEditPerm) => {
          return {
            major: {
              connect: {
                id: majorEditPerm.major.id,
              },
            },
            expirationDate: majorEditPerm.expirationDate,
          };
        }),
      },
    },
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
        },
      },
    },
  });

  return result;
}

/**
 * userId is the id of the potential admin making the request
 * userEmail is the email of the user to remove permissions from
 */
export async function removePermission({
  userId,
  userEmail,
}: {
  userId: string;
  userEmail: string;
}) {
  if ((await getUserRole(userId)) !== Role.ADMIN)
    throw new Error("User is not an admin");

  const result = prisma.permission.delete({
    where: {
      userEmail,
    },
  });

  return result;
}

export async function getPermissions(): Promise<Permission[]> {
  const usersPermissions = await prisma.permission.findMany({
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

export async function getUserPermissions(userId: string): Promise<Permission> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
      role: true,
    },
  });

  if (user == null) throw new Error(`User ${userId} not found`);

  const permissions = await prisma.permission.findUnique({
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

  if (permissions == null)
    return { userEmail: user.email, majorEditingPermissions: [] };

  return permissions;
}

export async function userHasMajorEditPermission(
  userId: string,
  majorId: number,
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);

  if (permissions?.majorEditingPermissions) {
    return permissions?.majorEditingPermissions.some((majorEditPerm) => {
      return (
        majorEditPerm.major.id == majorId &&
        majorEditPerm.expirationDate > new Date()
      );
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
