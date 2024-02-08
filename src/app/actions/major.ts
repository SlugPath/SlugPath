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
    },
  });
}

export async function getAllMajorsByCatalogYear(catalogYear: string) {
  const res = await prisma.major.findMany({
    where: {
      catalogYear,
    },
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
): Promise<MajorOutput[] | null> {
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
    return null;
  }

  return userData?.majors;
}

export async function getUserMajorsById(
  id: string,
): Promise<MajorOutput[] | null> {
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
    return null;
  }

  return userData?.majors;
}

export type MajorInput = {
  userId: string;
  name: string;
  catalogYear: string;
  programType: ProgramType;
};

export async function addUserMajor({
  userId,
  name,
  catalogYear,
  programType,
}: MajorInput): Promise<MajorOutput[] | null> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const major = await prisma.major.findFirst({
    where: {
      name,
      catalogYear,
      programType,
    },
  });
  const majorId = major?.id;

  if (user === undefined) {
    throw new Error(`could not find user with id ${userId}`);
  }

  if (majorId === undefined)
    throw new Error(
      `could not find major with name ${name} and catalog year ${catalogYear}`,
    );
  console.log("majorId", majorId);

  const userData = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majors: {
        connect: {
          id: majorId,
        },
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

export async function removeUserMajor(userId: string, majorId: number) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majors: {
        disconnect: {
          id: majorId,
        },
      },
    },
  });
}

export type MajorDefaultsInput = {
  name: string;
  catalogYear: string;
};

export async function getMajorDefaultPlanners({
  name,
  catalogYear,
}: MajorDefaultsInput): Promise<PlannerTitle[]> {
  return await prisma.planner.findMany({
    where: {
      major: {
        name,
        catalogYear,
      },
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

export async function getUserDefaultPlannerId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      defaultPlannerId: true,
    },
  });

  return user?.defaultPlannerId;
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
