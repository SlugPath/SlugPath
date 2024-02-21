"use server";

import prisma from "@/lib/prisma";
import { isRequirementList } from "@/lib/requirementsUtils";
import { v4 as uuid4 } from "uuid";

import { Binder, Requirement, RequirementList } from "../types/Requirements";
import { courseInfo } from "./course";
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

  const requirementsAsJSON = convertRequirementListToJSON(requirements);

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

  const requirementList: RequirementList = await convertJSONToRequirementList(
    majorRequirement.requirementList as string,
  );

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

function convertRequirementListToJSON(requirementList: RequirementList) {
  const newReqList = requirementListMapperSync((req) => {
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
    const course = await courseInfo({
      departmentCode: req.departmentCode,
      number: req.number,
    });
    if (!course) {
      throw new Error("Course not found");
    }
    return course;
  }, requirementList);
}

// This function maps over a requirement list and applies an asynchronous function to each class within the requirement list.
async function requirementListMapper(
  f: (requirement: Requirement) => Promise<Requirement>,
  requirementList: RequirementList,
): Promise<RequirementList> {
  return {
    ...requirementList,
    requirements: await Promise.all(
      requirementList.requirements.map((req) => {
        if (isRequirementList(req)) {
          return requirementListMapper(f, req);
        } else {
          return f(req);
        }
      }),
    ),
  };
}

// This function maps over a requirement list and applies a synchronous function to each class within the requirement list.
function requirementListMapperSync(
  f: (requirement: Requirement) => Requirement,
  requirementList: RequirementList,
): RequirementList {
  return {
    ...requirementList,
    requirements: requirementList.requirements.map((req) => {
      if (isRequirementList(req)) {
        return requirementListMapperSync(f, req);
      } else {
        return f(req);
      }
    }),
  };
}
