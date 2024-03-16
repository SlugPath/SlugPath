"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

import { Permission } from "../types/Permission";

/**
 * Delete existing then insert a new permission for a user
 * @param param0 userId, permission to upsert
 * @returns the upserted permission
 */
export async function replacePermission({
  userId,
  permission,
}: {
  userId: string;
  permission: Permission;
}): Promise<Permission> {
  if ((await getUserRole(userId)) !== Role.ADMIN)
    throw new Error("User is not an admin");

  // delete previous permissions if they exist
  return prisma.$transaction(async (tx) => {
    if (
      await tx.permission.findUnique({
        where: {
          userEmail: permission.userEmail,
        },
      })
    ) {
      await tx.permission.delete({
        where: {
          userEmail: permission.userEmail,
        },
      });
    }

    // Create new permissions
    const result = await tx.permission.upsert({
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
  });
}

/**
 * Remove a permission from a user
 * @param param0 userid, userEmail to remove permission from
 * @returns the removed permission
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

/**
 * Fetch all permissions for all users
 * @returns List of all permissions
 */
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

/**
 * Fetch a user's permissions
 * @param userId a unique id that identifies a user
 * @returns user's permissions
 */
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

/**
 * Fetch user permissions and check if the user has permission to edit a program
 *
 * NOTE: decieving function, should be purely database logic / sql filtering.
 * Frontend filtering should be left to the frontend if pure javascript filter
 * @param userId
 * @param programId
 * @returns
 */
export async function userHasProgramEditPermission(
  userId: string,
  programId: number,
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);

  const major = await prisma.major.findUnique({
    where: {
      id: programId,
    },
    select: {
      name: true,
    },
  });

  if (!major) throw new Error(`Major ${programId} not found`);

  if (permissions?.majorEditingPermissions) {
    return permissions?.majorEditingPermissions.some((majorEditPerm) => {
      return (
        majorEditPerm.major.name == major.name &&
        majorEditPerm.expirationDate > new Date()
      );
    });
  }

  return false;
}

/**
 * Fetch a user's role
 * @param userId unique id that identifies a user
 * @returns
 */
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
