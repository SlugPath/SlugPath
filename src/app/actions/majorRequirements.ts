"use server";

import prisma from "@/lib/prisma";
import { isRequirementList } from "@/lib/requirementsUtils";
import { v4 as uuid4 } from "uuid";

import { Binder, RequirementList } from "../types/Requirements";
import { courseInfo } from "./course";
import { userHasMajorEditingPermission } from "./permissions";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
  userId: string,
) {
  const start = Date.now();

  // check if user is allowed to edit this major
  if (!userHasMajorEditingPermission(userId)) return;

  const requirementsAsJSON = await convertRequirementListToJSON(requirements);

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

    const timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");

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
  const start = Date.now();

  const majorRequirement = await prisma.majorRequirement.findUnique({
    where: {
      majorId: majorId,
    },
  });

  // if no requirements are found, return an empty requirement list
  if (majorRequirement === null) {
    return createEmptyRequirementList(majorId);
  }

  const requirementList: RequirementList = await convertJSONToRequirementList(
    majorRequirement.requirementList as string,
  );

  const timeTaken = Date.now() - start;
  console.log("Total time taken : " + timeTaken + " milliseconds");

  return requirementList;
}

export async function getAllRequirementLists(): Promise<RequirementList[]> {
  const requirementLists = await prisma.majorRequirement.findMany();

  const convertedRequirementLists: RequirementList[] = [];

  requirementLists.forEach(async (reqList) => {
    const r = await convertJSONToRequirementList(
      reqList.requirementList as string,
    );
    convertedRequirementLists.push(r);
  });

  return convertedRequirementLists;
}

// ==================================================================================
// Helper functions start ===========================================================
// ==================================================================================

async function convertRequirementListToJSON(requirementList: RequirementList) {
  const newReqList = await requirementListMapper((req) => {
    return {
      departmentCode: req.departmentCode,
      number: req.number,
    };
  }, requirementList);

  return JSON.stringify(newReqList);
}

async function convertJSONToRequirementList(requirementListJSON: string) {
  const requirementList = JSON.parse(requirementListJSON) as RequirementList;

  return await requirementListMapper(async (req) => {
    return await courseInfo({
      departmentCode: req.departmentCode,
      number: req.number,
    });
  }, requirementList);
}

// This function maps over a requirement list and applies a function to each class within the requirement list.
// It uses (requirement: any) => any type to avoid making convoluted types to take just the departmentCode and number
async function requirementListMapper(
  f: (requirement: any) => any,
  requirementList: RequirementList,
): Promise<RequirementList> {
  return {
    ...requirementList,
    requirements: await Promise.all(
      requirementList.requirements.map(async (req) => {
        if (isRequirementList(req)) {
          return await requirementListMapper(f, req);
        } else {
          return await f(req);
        }
      }),
    ),
  };
}
