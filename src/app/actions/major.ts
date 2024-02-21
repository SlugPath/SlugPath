"use server";

import prisma from "@/lib/prisma";

import { PlannerTitle } from "../types/Planner";

export async function getMajors(catalogYear?: string) {
  const query: any = {
    orderBy: [
      {
        name: "asc",
      },
      {
        catalogYear: "asc",
      },
    ],
    select: {
      name: true,
      id: true,
      catalogYear: true,
    },
  };
  if (catalogYear) {
    query.where = {
      catalogYear,
    };
  }
  return await prisma.major.findMany(query);
}

export type UserMajorOutput = {
  name: string;
  catalogYear: string;
  defaultPlannerId: string;
  id: number;
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
          id: true,
        },
      },
      defaultPlannerId: true,
    },
  });
  if (!userData) return null;

  const { major, defaultPlannerId } = userData;

  if (!major) return null;

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlannerId,
    id: major.id,
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
          id: true,
        },
      },
      defaultPlannerId: true,
    },
  });
  const major = userData?.major;
  if (!major) {
    return null;
  }

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlannerId: userData!.defaultPlannerId,
    id: major.id,
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
}: MajorInput): Promise<UserMajorOutput | null> {
  const major = await prisma.major.findFirst({
    where: {
      name,
      catalogYear,
    },
  });
  if (!major)
    throw new Error(
      `could not find major with name ${name} and catalog year ${catalogYear}`,
    );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majorId: major.id,
      defaultPlannerId,
    },
  });

  return {
    name,
    catalogYear,
    defaultPlannerId,
    id: major!.id,
  };
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
