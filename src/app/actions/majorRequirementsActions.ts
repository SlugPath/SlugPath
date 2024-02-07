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
    //  const requirementsAsJSON = JSON.stringify(requirementList);

    // //get the entire requirement list
    // var majorRequirementList = await prisma.major.findUnique({
    //   where: {
    //     id: majorId,
    //   },
    //   select: {
    //     majorRequirements: true
    //   }
    // });
    // //append to the list manually - this one doesn't make sense
    // if(majorRequirementList == undefined){
    //   return
    // }
    // const majorRequirement = {
    //   majorId: majorId,
    //   requirementList: requirementsAsJSON
    // }
    // majorRequirementList.majorRequirements.push(majorRequirement)

    // //put it back into the database
    // await prisma.major.update({
    //   where: {
    //     id: majorId,
    //   },
    //   data: {
    //     majorRequirements: majorRequirementList,
    //   },
    // });

    // await prisma.majorRequirement.upsert({
    //   where: {
    //     majorId: majorId,
    //   },
    //   update: {
    //     requirementList: requirementsAsJSON,
    //   },
    //   create: {
    //     majorId: majorId,
    //     requirementList: requirementsAsJSON,
    //   },
    // });

    //get the entire requirement list

    //append to the list manually
    //put it back into the database
    //create in major requirement list

    const requirementsAsJSON = JSON.stringify(requirementList);

    // const major = await prisma.major.findUnique({
    //   where: {
    //     id: majorId,
    //   },
    //   include: {
    //     majorRequirements: true,
    //   }
    // })

    // if (major === undefined) {
    //   throw new Error("Major could not be found")
    // }

    const newMajorRequirement = await prisma.majorRequirement.create({
      data: {
        requirementList: requirementsAsJSON,
        major: {
          connect: {
            id: majorId,
          },
        },
      },
    });

    console.log("newMajorRequirement");
    console.log(newMajorRequirement);

    // const result = await prisma.major.update({
    //   where: {
    //     id: majorId,
    //   },
    //   data: {
    //     majorRequirements: {
    //       connect: {
    //         id: newMajorRequirement.id,
    //       }
    //     }
    //   },
    //   include: {
    //     majorRequirements: true,
    //   }
    // })

    // console.log("result")
    // console.log(result)

    // await prisma.major.upsert({
    //   where: { id: majorId },
    //   create: {
    //     where: {
    //       id: majorId,
    //     },
    //     majorRequirements: {
    //       connectOrCreate: {
    //         where: {

    //         }
    //       },
    //     },
    //   }
    //   data: {
    //     majorRequirements: {
    //       connectOrCreate: {
    //         where: {
    //           majorId: majorId,
    //         },
    //         create: {
    //           // majorId: majorId,
    //           requirementList: requirementsAsJSON,
    //         }
    //       }
    //     },
    //   },
    // })

    // const res = await prisma.major.create({
    //   data: {
    //     id: majorId,
    //     majorRequirements: {
    //       connectOrCreate: {
    //         where:{
    //           majorId: majorId
    //         },
    //         create: {
    //           majorId: majorId,
    //           requirementList: requirementsAsJSON,
    //         }
    //       }
    //     }
    //   }
    // })

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
