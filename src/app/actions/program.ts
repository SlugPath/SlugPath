"use server";

import prisma from "@/lib/prisma";
import { PrismaClient, ProgramType } from "@prisma/client";

import { PlannerTitle } from "../types/Planner";
import { Program, ProgramInput } from "../types/Program";

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
  return res;
}

/**
 * Fetch all majors for a user by their email
 * @param email email for a user
 * @returns user's majors
 */
export async function getUserProgramsByEmail(
  email: string,
): Promise<Program[]> {
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
): Promise<Program[]> {
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

/**
 * Update the user's majors in the database
 * @param userId user id for the user to save majors for
 * @param programs programs to save
 * @returns updated majors
 */
export async function updateUserPrograms({
  userId,
  programs,
}: {
  userId: string;
  programs: ProgramInput[];
}): Promise<Program[]> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user === undefined) {
    throw new Error(`could not find user with id ${userId}`);
  }

  return await prisma.$transaction(async (tx) => {
    const userPrograms = await connectUserPrograms({
      userId,
      programs,
      client: tx as PrismaClient,
    });

    // if no programs, remove default planner
    if (programs.length == 0) {
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          defaultPlannerId: "",
        },
      });
    }

    return userPrograms;
  });
}

/**
 * Connects the user to the given progra while disconnecting any old majors.
 */

/**
 * Connects the user to the given programs while disconnecting any old majors
 * @param client prisma client
 * @param userId user id for the user to connect programs for
 * @param programs programs to connect
 * @returns updated programs
 */
export async function connectUserPrograms({
  client = prisma,
  userId,
  programs,
}: {
  client?: PrismaClient;
  userId: string;
  programs: ProgramInput[];
}): Promise<Program[]> {
  // disconnect any old majors
  const oldPrograms = await getUserProgramsById(userId, client);
  if (oldPrograms !== null) {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        majors: {
          disconnect: oldPrograms,
        },
      },
    });
  }

  // find major ids from the input
  const programIds = await Promise.all(
    programs.map(async (major) => {
      const programFound = await client.major.findFirst({
        where: {
          name: major.name,
          catalogYear: major.catalogYear,
          programType: major.programType,
        },
      });

      return programFound?.id;
    }),
  );

  const filteredProgramIds = programIds.filter(
    (id) => id !== undefined,
  ) as number[];

  // connect the new majors
  const userData = await client.user.update({
    where: {
      id: userId,
    },
    data: {
      majors: {
        connect: filteredProgramIds.map((id) => {
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

/**
 * Fetch all default planners for a user based on their default planner
 * @param userId user id for the user to get default planners for
 * @param program program to use for getting default planners
 * @returns default planners for the user
 */
export async function getProgramDefaultPlanners({
  userId,
  program,
}: {
  userId: string;
  program?: ProgramInput;
}): Promise<PlannerTitle[]> {
  async function getProgramToUse() {
    if (program) {
      return program;
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

  const programToUse = await getProgramToUse();

  // get the default planners for majorToUse
  if (programToUse) {
    return await prisma.planner.findMany({
      where: {
        major: programToUse,
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

/**
 * Fetch the default planner for a user
 * @param userId user id for the user to get default planner for
 * @returns
 */
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
 * Fetch the primary major for a user.
 *
 * Done by finding major of the default planner for the user,
 * otherwise returns first major in the user's list of majors,
 * otherwise returns null.
 * @param userId user id for the user to get primary major for
 * @returns primary major for the user
 */
export async function getUserPrimaryProgram(userId: string) {
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

/**
 * Fetches the list of unique catalog years, optionally for a specific program
 *
 * TODO: Add unit tests
 * @param programName The program to fetch catalog years for
 * @returns A list of catalog years
 */
export async function getCatalogYears(programName?: string) {
  // Used Raw SQL to allow for DISTINCT, as Prisma support is experimental in v6
  if (!programName) {
    const result =
      await prisma.$queryRaw`SELECT DISTINCT "catalogYear" FROM "Major" ORDER BY "catalogYear" ASC;`;
    return result as { catalogYear: string }[];
  }

  const result =
    await prisma.$queryRaw`SELECT DISTINCT "catalogYear" FROM "Major" WHERE name=${programName} ORDER BY "catalogYear" ASC;`;
  return result as { catalogYear: string }[];
}

/**
 * Update the user's default planner in the database
 * @param userId user id for the user to update default planner for
 * @param defaultPlannerId planner id to set as default
 * @returns
 */
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
