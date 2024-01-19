"use server";

import prisma from "@/lib/prisma";
import { Binder, RequirementList } from "../types/Requirements";
import { v4 as uuid4 } from "uuid";

export async function saveMajorRequirements(
  requirements: RequirementList,
  majorId: number,
) {
  const requirementsAsJSON = JSON.stringify(requirements);
  const result = await prisma.majorRequirement.upsert({
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

  return result;
}

export async function getMajorRequirements(
  majorId: number,
): Promise<RequirementList> {
  const majorRequirement = await prisma.majorRequirement.findUnique({
    where: {
      majorId: majorId,
    },
  });

  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
  });
  const majorName = major?.name ?? "No major name";
  const catalogYear = major?.catalogYear ?? "No catalog year";
  const title = `${majorName} ${catalogYear}`;

  if (majorRequirement === null) {
    const emptyReqList = {
      binder: Binder.AND,
      title: title,
      id: uuid4(),
      requirements: [],
    };

    return emptyReqList;
  }

  const requirementList = JSON.parse(
    majorRequirement.requirementList as string,
  ) as RequirementList;

  return requirementList;
}
