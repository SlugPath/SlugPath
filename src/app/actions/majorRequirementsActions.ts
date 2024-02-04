"use server";

import prisma from "@/lib/prisma";
import { v4 as uuid4 } from "uuid";

import { Binder, RequirementList } from "../types/Requirements";
import { userHasMajorEditingPermission } from "./permissionsActions";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
  userId: string,
) {
  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
  });

  // check if user is allowed to edit this major
  if (major && !userHasMajorEditingPermission(userId, major)) return;

  const requirementsAsJSON = JSON.stringify(requirements);

  try {
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

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
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
  if (majorRequirement === null) {
    return createEmptyRequirementList(majorId);
  }

  const requirementList: RequirementList = parseRequirementList(
    majorRequirement.requirementList as string,
  );

  return requirementList;
}

export async function getAllRequirementLists(): Promise<RequirementList[]> {
  const requirementLists = await prisma.majorRequirement.findMany();

  return requirementLists.map((reqList) => {
    return parseRequirementList(reqList.requirementList as string);
  });
}

function parseRequirementList(requirementList: string): RequirementList {
  return JSON.parse(requirementList) as RequirementList;
}
