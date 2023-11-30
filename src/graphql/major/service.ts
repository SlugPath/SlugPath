import prisma from "@/lib/prisma";
import { Major, MajorInput } from "./schema";

export class MajorService {
  public async getUserMajor(userId: string): Promise<Major | null> {
    const major = (
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          major: {
            select: {
              name: true,
              catalogYear: true,
              defaultPlanners: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      })
    )?.major;
    if (major === undefined || major === null) {
      throw new Error("Major does not exist");
    }

    return {
      name: major.name,
      catalogYear: major.catalogYear,
      defaultPlanners: major.defaultPlanners.map((p) => p.id),
    };
  }

  public async updateUserMajor(major: MajorInput): Promise<string> {
    const majorId = (
      await prisma.major.findFirst({
        where: {
          name: major.name,
          catalogYear: major.catalogYear,
        },
      })
    )?.id;

    if (majorId === undefined)
      throw new Error(
        `could not find major with name ${major.name} and catalog year ${major.catalogYear}`,
      );

    return (
      await prisma.user.update({
        where: {
          id: major.userId,
        },
        data: {
          major: {
            connect: { id: majorId },
          },
          defaultPlannerId: major.defaultPlannerId,
        },
      })
    ).id;
  }
}
