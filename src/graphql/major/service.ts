import prisma from "@/lib/prisma";
import { Major, MajorInput } from "./schema";

export class MajorService {
  public async getMajor(userId: string): Promise<Major | null> {
    const major = await prisma.major.findUnique({
      where: {
        userId: userId,
      },
    });

    return major ? major : null;
  }

  public async upsertMajor(major: MajorInput): Promise<Major> {
    return await prisma.major.upsert({
      where: {
        userId: major.userId,
      },
      update: {
        name: major.name,
        catalog_year: major.catalog_year,
        default_planner_id: major.default_planner_id,
      },
      create: {
        name: major.name,
        catalog_year: major.catalog_year,
        default_planner_id: major.default_planner_id,
        userId: major.userId,
      },
    });
  }

  public async deleteMajor(userId: string): Promise<Major> {
    return await prisma.major.delete({
      where: {
        userId: userId,
      },
    });
  }
}
