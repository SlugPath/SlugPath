import prisma from "@/lib/prisma";
import { MajorInput, MajorDefaultsInput, UserMajorOutput } from "./schema";
import { PlannerTitle } from "../planner/schema";

export class MajorService {
  public async getAllMajors(catalogYear: string): Promise<string[]> {
    const res = await prisma.major.findMany({
      where: {
        catalogYear,
      },
      select: {
        name: true,
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          catalogYear: "desc",
        },
      ],
    });
    return res.map((major) => major.name);
  }

  public async getUserMajor(userId: string): Promise<UserMajorOutput | null> {
    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        major: {
          select: {
            name: true,
            catalogYear: true,
            id: true,
          },
        },
        defaultPlannerId: true,
      },
    });
    const major = userData?.major;
    if (major === undefined || major === null) {
      return null;
    }

    console.log({
      name: major.name,
      catalogYear: major.catalogYear,
      defaultPlannerId: userData?.defaultPlannerId ?? "",
      id: major.id,
    });

    return {
      name: major.name,
      catalogYear: major.catalogYear,
      defaultPlannerId: userData?.defaultPlannerId ?? "",
      id: major.id,
    };
  }

  public async updateUserMajor({
    userId,
    name,
    catalogYear,
    defaultPlannerId,
  }: MajorInput): Promise<UserMajorOutput> {
    const major = await prisma.major.findFirst({
      where: {
        name,
        catalogYear,
      },
    });
    const majorId = major?.id;

    if (majorId === undefined)
      throw new Error(
        `could not find major with name ${name} and catalog year ${catalogYear}`,
      );

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        majorId,
        defaultPlannerId,
      },
    });

    return {
      name: major!.name,
      catalogYear: major!.catalogYear,
      defaultPlannerId: user.defaultPlannerId!,
      id: major!.id,
    };
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
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }
}
