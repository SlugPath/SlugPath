"use server";

import { initialPlanner } from "@/lib/plannerUtils";
import { toPlannerData } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";

import { PlannerData, PlannerTitle } from "../types/Planner";

export async function getAllMajors(catalogYear: string): Promise<string[]> {
  const res = await prisma.major.findMany({
    where: {
      catalogYear,
    },
    select: {
      name: true,
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

export type UserMajorOutput = {
  name: string;
  catalogYear: string;
  defaultPlanner: PlannerData;
};

export async function getUserMajorByEmail(
  email: string,
): Promise<UserMajorOutput | null> {
  const userData = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      major: {
        select: {
          name: true,
          catalogYear: true,
        },
      },
      defaultPlannerId: true,
    },
  });
  const major = userData?.major;
  if (major === undefined || major === null) {
    return null;
  }

  let defaultPlanner: PlannerData = initialPlanner();
  if (userData?.defaultPlannerId) {
    defaultPlanner = toPlannerData(
      await prisma.planner.findFirst({
        where: { id: userData?.defaultPlannerId },
        include: {
          quarters: {
            include: {
              courses: true,
            },
          },
          labels: true,
        },
      }),
    );
  }

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlanner,
  };
}

export async function getUserMajorById(
  id: string,
): Promise<UserMajorOutput | null> {
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      major: {
        select: {
          name: true,
          catalogYear: true,
        },
      },
      defaultPlannerId: true,
    },
  });
  const major = userData?.major;
  if (major === undefined || major === null) {
    return null;
  }

  let defaultPlanner: PlannerData = initialPlanner();
  if (userData?.defaultPlannerId) {
    defaultPlanner = toPlannerData(
      await prisma.planner.findFirst({
        where: { id: userData?.defaultPlannerId },
        include: {
          quarters: {
            include: {
              courses: true,
            },
          },
          labels: true,
        },
      }),
    );
  }

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlanner,
  };
}

export type MajorInput = {
  userId: string;
  name: string;
  catalogYear: string;
  defaultPlannerId: string;
};

export async function updateUserMajor({
  userId,
  name,
  catalogYear,
  defaultPlannerId,
}: MajorInput): Promise<string> {
  const major = await prisma.major.findFirst({
    where: {
      name,
      catalogYear,
    },
  });
  const majorId = major?.id;

  if (majorId === undefined)
    throw new Error(
      `could not find major with name ${name} and catalog year ${catalogYear}`,
    );

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majorId,
      defaultPlannerId,
    },
  });

  return user.id;
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
