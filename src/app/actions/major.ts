"use server";

import prisma from "@/lib/prisma";
import { PrismaClient, ProgramType } from "@prisma/client";

import { Major, MajorInput } from "../types/Major";
import { PlannerTitle } from "../types/Planner";

/**
 * Fetch all majors, optionally filtered by catalog year
 * @param catalogYear Year of the catalog to get majors for
 * @returns major degree programs
 */
export async function getMajors(catalogYear?: string) {
  const query: any = {
    where: { programType: "Major" },
    select: {
      name: true,
      id: true,
      catalogYear: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        catalogYear: "asc",
      },
    ],
  };
  if (catalogYear) {
    query.where = {
      catalogYear,
    };
  }
  return await prisma.major.findMany(query);
}

/**
 * Fetch all mionrs, optionally filtered by catalog year
 * @param catalogYear Year of the catalog to get minors for
 * @returns minor degree programs
 */
export async function getMinors(catalogYear?: string) {
  const query: any = {
    where: { programType: "Minor" },
    select: {
      name: true,
      id: true,
      catalogYear: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        catalogYear: "asc",
      },
    ],
  };
  if (catalogYear) {
    query.where = {
      catalogYear,
    };
  }
  return await prisma.major.findMany(query);
}

/**
 * Fetch all majors and minors, optionally filtered by catalog year
 * @param catalogYear Year of the catalog to get programs for
 * @returns degree programs
 */
export async function getPrograms(catalogYear?: string) {
  const query: any = {
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
        catalogYear: "asc",
      },
    ],
  };
  if (catalogYear) {
    query.where = {
      catalogYear,
    };
  }
  return await prisma.major.findMany(query);
}

/**
 * Fetch all majors or minors for a specified year
 * @param programType Major or Minor
 * @param catalogYear Year of the catalog to get majors or minors for
 * @returns filtered degree programs
 */
export async function getProgramsByTypeInYear(
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

/**
 * Fetch all majors for a user by their email
 * @param email email for a user
 * @returns user's majors
 */
export async function getUserProgramsByEmail(email: string): Promise<Major[]> {
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

/**
 * Fetch all majors for a user by their user id
 * @param userId id for a user
 * @param client prisma client
 * @returns user's majors
 */
export async function getUserProgramsById(
  userId: string,
  client: PrismaClient = prisma,
): Promise<Major[]> {
  const userData = await client.user.findUnique({
    where: {
      id: userId,
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

export async function saveUserMajors({
  userId,
  majors,
}: {
  userId: string;
  majors: MajorInput[];
}): Promise<Major[]> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === undefined) {
    throw new Error(`could not find user with id ${userId}`);
  }

  return await prisma.$transaction(async (tx) => {
    const userMajors = await connectUserMajors({
      userId,
      majors,
      client: tx as PrismaClient,
    });

    // if no majors, remove default planner
    if (majors.length == 0) {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          defaultPlannerId: "",
        },
      });
    }

    return userMajors;
  });
}

/**
 * Connects the user to the given majors while disconnecting any old majors.
 */
export async function connectUserMajors({
  client = prisma,
  userId,
  majors,
}: {
  client?: PrismaClient;
  userId: string;
  majors: MajorInput[];
}): Promise<Major[]> {
  // disconnect any old majors
  const oldMajors = await getUserProgramsById(userId, client);
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
      const majorFound = await client.major.findFirst({
        where: {
          name: major.name,
          catalogYear: major.catalogYear,
          programType: major.programType,
        },
      });

      return majorFound?.id;
    }),
  );

  const filteredMajorIds = majorIds.filter(
    (id) => id !== undefined,
  ) as number[];

  // connect the new majors
  const userData = await client.user.update({
    where: {
      id: userId,
    },
    data: {
      majors: {
        connect: filteredMajorIds.map((id) => {
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
  const userMajors = await getUserProgramsById(userId);
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
