"use server";

import prisma from "@/lib/prisma";

import { RequirementList } from "../types/Requirements";
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

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
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

// ADDITION: I added userId, because we want all majorRequirements to always be connected to the user that created
// them
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
