"use server";

import prisma from "@/lib/prisma";
import { Binder, RequirementList } from "../types/Requirements";
import { v4 as uuid4 } from "uuid";
import { Major } from "../types/Major";
import { Permissions } from "../types/Permissions";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
  userId: string,
) {
  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
  });

  // check if user is allowed to edit this major
  if (major && !userHasMajorEditingPermission(userId, major)) return;

  const requirementsAsJSON = JSON.stringify(requirements);
  const result = await prisma.majorRequirement.upsert({
    where: {
      majorId: majorId,
    },
    update: {
      requirementList: requirementsAsJSON,
    },
    create: {
      majorId: majorId,
      requirementList: requirementsAsJSON,
    },
  });

  return result;
}

export async function getMajorRequirements(
  majorId: number,
): Promise<RequirementList> {
  const majorRequirement = await prisma.majorRequirement.findUnique({
    where: {
      majorId: majorId,
    },
  });

  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
  });
  const majorName = major?.name ?? "No major name";
  const catalogYear = major?.catalogYear ?? "No catalog year";
  const title = `${majorName} ${catalogYear}`;

  if (majorRequirement === null) {
    const emptyReqList = {
      binder: Binder.AND,
      title: title,
      id: uuid4(),
      requirements: [],
    };

    return emptyReqList;
  }

  const requirementList = JSON.parse(
    majorRequirement.requirementList as string,
  ) as RequirementList;

  return requirementList;
}

export async function getMajors(): Promise<
  {
    name: string;
    id: number;
    catalogYear: string;
  }[]
> {
  const majors = await prisma.major.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
      id: true,
      catalogYear: true,
    },
  });

  return majors;
}

export async function savePermissions(permissions: Permissions[]) {
  await prisma.permissions.deleteMany();

  permissions.forEach(async (permission) => {
    if (permission.userEmail !== undefined) {
      await prisma.permissions.upsert({
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
      });
    }
  });
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
  major: Major,
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (user?.email !== undefined) {
    const permissions = await prisma.permissions.findUnique({
      where: {
        userEmail: user.email ? user.email : "",
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

    if (permissions?.majorEditingPermissions !== undefined) {
      for (const majorEditPerm of permissions.majorEditingPermissions) {
        if (majorEditPerm.major.id == major.id) {
          return majorEditPerm.expirationDate > new Date();
        }
      }
    }
  }

  return false;
}
