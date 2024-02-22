"use server";

import prisma from "@/lib/prisma";
import { v4 as uuid4 } from "uuid";

import { Binder, RequirementList } from "../types/Requirements";
import { getUserPermissions } from "./permissions";

async function userHasMajorEditingPermission(userId: string, majorId: number) {
  const permissions = await getUserPermissions(userId);

  if (permissions?.majorEditingPermissions) {
    return permissions?.majorEditingPermissions.some((majorEditPerm) => {
      return majorEditPerm.major.id == majorId;
    });
  }

  return false;
}

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
  userId: string,
) {
  // check if user is allowed to edit this major
  if (!userHasMajorEditingPermission(userId, majorId)) return;

  const requirementsAsJSON = JSON.stringify(requirements);

  await prisma.majorRequirement.upsert({
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
  majorId: number,
): Promise<RequirementList> {
  const majorRequirement = await prisma.majorRequirement.findUnique({
    where: {
      majorId: majorId,
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
