"use server";

import prisma from "@/lib/prisma";

import { PlannerTitle } from "../types/Planner";

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
  defaultPlannerId: string;
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

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlannerId: userData?.defaultPlannerId || "",
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

  return {
    name: major.name,
    catalogYear: major.catalogYear,
    defaultPlannerId: userData?.defaultPlannerId ?? "",
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
  const majorId = major?.id;

  if (majorId === undefined)
    throw new Error(
      `could not find major with name ${name} and catalog year ${catalogYear}`,
    );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      majorId,
      defaultPlannerId,
    },
  });

  return {
    name,
    catalogYear,
    defaultPlannerId,
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
