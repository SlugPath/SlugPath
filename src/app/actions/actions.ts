"use server";

import prisma from "@/lib/prisma";
import { Binder, RequirementList } from "../types/Requirements";
import { v4 as uuid4 } from "uuid";
import { Major } from "../types/Major";
import { Permissions } from "../types/Permissions";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
) {
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
      const result = await prisma.permissions.upsert({
        where: {
          userEmail: permission.userEmail,
        },
        update: {
          majorsAllowedToEdit: {
            connect: permission.majorsAllowedToEdit.map((major) => {
              return {
                id: major.id,
              };
            }),
          },
        },
        create: {
          userEmail: permission.userEmail,
          majorsAllowedToEdit: {
            connect: permission.majorsAllowedToEdit.map((major) => {
              return {
                id: major.id,
              };
            }),
          },
        },
      });

      console.log("result=====");
      console.log(result);
    }
  });

  // return;
}

export async function getPermissions(): Promise<Permissions[]> {
  const usersPermissions = await prisma.permissions.findMany({
    select: {
      userEmail: true,
      majorsAllowedToEdit: {
        select: {
          name: true,
          catalogYear: true,
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
        majorsAllowedToEdit: {
          select: {
            id: true,
          },
        },
      },
    });
    if (permissions?.majorsAllowedToEdit !== undefined) {
      const majorIds = permissions.majorsAllowedToEdit.map((major) => major.id);
      return majorIds.includes(major.id);
    }
  }

  return false;
}
