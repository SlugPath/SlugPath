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

//ADDON: RETURN VALUE NOW HAS USERID ATTACHED TO THE REQUIREMENTLIST [RequirementList, string]
export async function getMajorRequirementLists(
  majorId: number,
): Promise<Array<[RequirementList, string]>> {
  const majorRequirements = await prisma.majorRequirement.findMany({
    where: {
      majorId: majorId,
    },
    select: {
      requirementList: true,
      userId: true,
    },
  });

  if (majorRequirements.length === 0) {
    return [];
  }

  const majorRequirementsList: Array<[RequirementList, string]> =
    await Promise.all(
      majorRequirements.map(async (majorRequirement) => {
        const parseRequirementsList = JSON.parse(
          majorRequirement.requirementList as string,
        ) as RequirementList;
        const userName = (await getUserName(majorRequirement.userId)) ?? "";
        return [parseRequirementsList, userName];
      }),
    );

  return majorRequirementsList;
}

async function getUserName(userId: string) {
  const name = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (name !== null && name.name !== null) {
    return name.name;
  }
  return null;
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

//returns a list of names who upvoted a specific major requirement
export async function getUpvotes(majorRequirementId: number): Promise<number> {
  // return an integer
  const upvotes = await prisma.upvote.findMany({
    where: {
      majorRequirementId: majorRequirementId,
    },
  });

  if (upvotes !== null) {
    return upvotes.length;
  }
  return 0;
}

export async function addUpvote(userId: string, majorRequirementId: number) {
  try {
    const newUpvote = await prisma.upvote.create({
      data: {
        userId: userId,
        majorRequirementId: majorRequirementId,
      },
    });

    await prisma.majorRequirement.update({
      where: {
        id: majorRequirementId,
      },
      data: {
        upvotes: {
          connect: {
            id: newUpvote.id,
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

export async function removeUpvote(userId: string, upvoteId: number) {
  try {
    await prisma.upvote.delete({
      where: {
        userId: userId,
        id: upvoteId,
      },
    });

    return { title: "OK" };
  } catch (e) {
    return { error: e };
  }
}
