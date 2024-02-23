"use server";

import prisma from "@/lib/prisma";
import { v4 as uuid4 } from "uuid";

import { Binder, RequirementList } from "../types/Requirements";
import { userHasMajorEditingPermission } from "./permissions";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
  userId: string,
) {
  // check if user is allowed to edit this major
  if (!(await userHasMajorEditingPermission(userId))) {
    return { success: false };
  }

  const requirementsAsJSON = JSON.stringify(requirements);

  await prisma.majorRequirement.upsert({
    where: {
      majorId_userId: {
        majorId: majorId,
        userId: userId,
      },
    },
    update: {
      requirementList: requirementsAsJSON,
    },
    create: {
      majorId: majorId,
      userId: userId,
      requirementList: requirementsAsJSON,
    },
  });

  return { success: true };
}

/**
 * @returns an empty requirement list with a title using the major's name and catalog year
 */
async function createEmptyRequirementList(
  majorId: number,
): Promise<RequirementList> {
  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
  });
  const majorName = major?.name ?? "No major name";
  const catalogYear = major?.catalogYear ?? "No catalog year";
  const title = `${majorName} ${catalogYear}`;

  const emptyReqList: RequirementList = {
    binder: Binder.AND,
    title: title,
    id: uuid4(),
    requirements: [],
  };

  return emptyReqList;
}

export async function getMajorRequirements(
  userId: string,
  majorId: number,
): Promise<RequirementList> {
  const majorRequirement = await prisma.majorRequirement.findUnique({
    where: {
      majorId_userId: {
        majorId: majorId,
        userId,
      },
    },
  });

  // if no requirements are found, return an empty requirement list
  if (!majorRequirement) {
    return await createEmptyRequirementList(majorId);
  }

  const requirementList: RequirementList = JSON.parse(
    majorRequirement.requirementList as string,
  );

  return requirementList;
}

export async function getAllRequirementLists(): Promise<RequirementList[]> {
  const requirementLists = await prisma.majorRequirement.findMany();

  return requirementLists.map((reqList) => {
    return JSON.parse(reqList.requirementList as string);
  });
}

export async function getApprovedMajorRequirement(
  majorId: number,
): Promise<RequirementList | null> {
  const approvedMajorRequirement = await prisma.major.findFirst({
    where: {
      id: majorId,
    },
    select: {
      approvedRequirement: true,
    },
  });

  const approvedRequirement = approvedMajorRequirement?.approvedRequirement;
  if (approvedRequirement !== null) {
    const parseRequirementsList = JSON.parse(
      approvedRequirement?.requirementList as string,
    ) as RequirementList;
    return parseRequirementsList;
  }

  return null;
}

export async function getMajorRequirementLists(
  majorId: number,
): Promise<RequirementList[]> {
  const majorRequirements = await prisma.majorRequirement.findMany({
    where: {
      majorId: majorId,
    },
  });

  if (majorRequirements == undefined) {
    return [];
  }

  const majorRequirementsList = majorRequirements.map((majorRequirement) => {
    const parseRequirementsList = JSON.parse(
      majorRequirement.requirementList as string,
    ) as RequirementList;
    return parseRequirementsList;
  });

  return majorRequirementsList;
}

// this is part of crowd sourcing feature
export async function addMajorRequirementList(
  userId: string,
  majorId: number,
  requirementList: RequirementList,
) {
  try {
    const requirementsAsJSON = JSON.stringify(requirementList);

    const newMajorRequirement = await prisma.majorRequirement.create({
      data: {
        userId: userId,
        majorId: majorId,
        requirementList: requirementsAsJSON,
      },
    });

    await prisma.major.update({
      where: {
        id: majorId,
      },
      data: {
        majorRequirements: {
          connect: {
            id: newMajorRequirement.id,
          },
        },
      },
    });

    return { title: "OK" };
  } catch (e) {
    console.log(e);
    return { error: "error" };
  }
}
// this is also part of crowd sourcing feature
export async function removeMajorRequirementList(
  userId: string,
  majorRequirementId: number,
) {
  try {
    await prisma.majorRequirement.delete({
      where: {
        userId: userId,
        id: majorRequirementId,
      },
    });

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
}
