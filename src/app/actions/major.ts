"use server";

import prisma from "@/lib/prisma";
import { ProgramType } from "@prisma/client";

import { PlannerTitle } from "../types/Planner";

export async function getMajors() {
  return await prisma.major.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
      id: true,
      catalogYear: true,
      programType: true,
    },
  });
}

export async function getAllMajorsBy(
  programType: ProgramType,
  catalogYear: string,
) {
  const res = await prisma.major.findMany({
    where: {
      catalogYear,
      programType,
    },
    select: {
      name: true,
      id: true,
      catalogYear: true,
      programType: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        catalogYear: "desc",
      },
    ],
  });
  return res.map((major) => major.name);
}

export type MajorOutput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
  id: number;
};

export async function getUserMajorsByEmail(
  email: string,
): Promise<MajorOutput[]> {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      majors: {
        select: {
          name: true,
          catalogYear: true,
          id: true,
          programType: true,
        },
      },
    },
  });

  if (userData === null) {
    return [];
  }

  return userData?.majors;
}

export async function getUserMajorsById(id: string): Promise<MajorOutput[]> {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      majors: {
        select: {
          name: true,
          catalogYear: true,
          id: true,
          programType: true,
        },
      },
      defaultPlannerId: true,
    },
  });

  if (userData === null) {
    return [];
  }

  return userData?.majors;
}

export type MajorInput = {
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

export async function saveUserMajors({
  userId,
  majors,
}: {
  userId: string;
  majors: MajorInput[];
}): Promise<MajorOutput[]> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === undefined) {
    throw new Error(`could not find user with id ${userId}`);
  }

  // disconnect any old majors
  const oldMajors = await getUserMajorsById(userId);
  if (oldMajors !== null) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        majors: {
          disconnect: oldMajors,
        },
      },
    });
  }

  // find major ids from the input
  const majorIds = await Promise.all(
    majors.map(async (major) => {
      const majorFound = await prisma.major.findFirst({
        where: {
          name: major.name,
          catalogYear: major.catalogYear,
          programType: major.programType,
        },
      });
      return majorFound?.id;
    }),
  );

  // connect the new majors
  const userData = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majors: {
        connect: majorIds.map((id) => {
          return {
            id,
          };
        }),
      },
    },
    select: {
      majors: {
        select: {
          name: true,
          catalogYear: true,
          programType: true,
          id: true,
        },
      },
    },
  });

  return userData.majors;
}

export type MajorDefaultsInput = {
  userId: string;
  major?: MajorInput;
};

export async function getMajorDefaultPlanners({
  userId,
  major,
}: MajorDefaultsInput): Promise<PlannerTitle[]> {
  async function getMajorToUse() {
    if (major) {
      return major;
    } else {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          defaultPlannerId: true,
        },
      });
      if (user !== null) {
        const result = await prisma.planner.findUnique({
          where: {
            id: user.defaultPlannerId!,
          },
          select: {
            major: true,
          },
        });

        if (result !== null) {
          return {
            name: result?.major?.name as string,
            catalogYear: result?.major?.catalogYear as string,
            programType: result?.major?.programType as ProgramType,
          };
        }
        return null;
      }
      return null;
    }
  }

  const majorToUse = await getMajorToUse();

  // get the default planners for majorToUse
  if (majorToUse) {
    return await prisma.planner.findMany({
      where: {
        major: majorToUse,
      },
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }

  return [];
}

export async function getUserDefaultPlannerId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      defaultPlannerId: true,
    },
  });

  if (user === null) {
    return null;
  }
  return user.defaultPlannerId;
}

/**
 * Get the primary major for a user.
 * Done by finding major of the default planner for the user,
 * otherwise returns first major in the user's list of majors,
 * otherwise returns null.
 */
export async function getUserPrimaryMajor(userId: string) {
  // first find major based on user's default planner
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      defaultPlannerId: true,
    },
  });

  if (user === null || user.defaultPlannerId === null) {
    return null;
  }

  const planner = await prisma.planner.findUnique({
    where: {
      id: user.defaultPlannerId,
    },
    select: {
      major: true,
    },
  });

  if (planner !== null) {
    return planner.major;
  }

  // if no default planner, find first major in user's list of majors
  const userMajors = await getUserMajorsById(userId);
  if (userMajors !== null && userMajors.length > 0) {
    return userMajors[0];
  }

  return null;
}

export async function updateUserDefaultPlanner({
  userId,
  defaultPlannerId,
}: {
  userId: string;
  defaultPlannerId: string;
}) {
  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      defaultPlannerId,
    },
  });

  return {
    defaultPlannerId: user.defaultPlannerId,
  };
}
