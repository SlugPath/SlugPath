import prisma from "@/lib/prisma";
import { MajorInput, MajorDefaultsInput, UserMajorOutput } from "./schema";
import { PlannerTitle } from "../planner/schema";

export class MajorService {
  public async getUserMajor(userId: string): Promise<UserMajorOutput> {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        major: {
          select: {
            name: true,
            catalogYear: true,
          },
        },
        defaultPlannerId: true,
      },
    });
    const major = userData?.major;
    if (major === undefined || major === null) {
      throw new Error("Major does not exist");
    }

    return {
      name: major.name,
      catalogYear: major.catalogYear,
      defaultPlannerId: userData?.defaultPlannerId ?? "",
    };
  }

  public async updateUserMajor({
    userId,
    name,
    catalogYear,
    defaultPlannerId,
  }: MajorInput): Promise<string> {
    const majorId = (
      await prisma.major.findFirst({
        where: {
          name,
          catalogYear,
        },
      })
    )?.id;

    if (majorId === undefined)
      throw new Error(
        `could not find major with name ${name} and catalog year ${catalogYear}`,
      );

    return (
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          major: {
            connect: { id: majorId },
          },
          defaultPlannerId: defaultPlannerId,
        },
      })
    ).id;
  }

  public async getMajorDefaultPlanners({
    name,
    catalogYear,
  }: MajorDefaultsInput): Promise<PlannerTitle[]> {
    return await prisma.planner.findMany({
      where: {
        major: {
          name,
          catalogYear,
        },
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
        title: true,
      },
    });
  }
}
