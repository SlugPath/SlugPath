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
        userId: userId,
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

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
}

export async function getMajorRequirements(
  majorId: number,
): Promise<RequirementList> {
  //converted this into getApprovedMajorRequirement
  const major = await prisma.major.findUnique({
    where: {
      id: majorId,
    },
    select: {
      name: true,
      catalogYear: true,
      approvedRequirement: {
        select: {
          requirementList: true,
        },
      },
    },
  });

  const majorName = major?.name ?? "No major name";
  const catalogYear = major?.catalogYear ?? "No catalog year";
  const title = `${majorName} ${catalogYear}`;

  if (major === null) {
    const emptyReqList = {
      binder: Binder.AND,
      title: title,
      id: uuid4(),
      requirements: [],
    };

    return emptyReqList;
  }

  const requirementList = JSON.parse(
    major.approvedRequirement as string,
  ) as RequirementList;

  return requirementList;
  /*
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
  */
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
    // const newMajorRequirement = {
    //   ...majorRequirement,
    //  requirementList: parseRequirementsList
    // }
    return parseRequirementsList;
  });

  return majorRequirementsList;
}

export async function addMajorRequirementList(
  majorId: number,
  requirementList: RequirementList,
) {
  try {
    const requirementsAsJSON = JSON.stringify(requirementList);

    const newMajorRequirement = await prisma.majorRequirement.create({
      data: {
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

export async function removeMajorRequirementList(majorRequirementId: number) {
  // make sure it's the same user that created it

  try {
    await prisma.major.delete({
      where: {
        id: majorRequirementId,
      },
    });

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
}
