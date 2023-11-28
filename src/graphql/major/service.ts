import prisma from "@/lib/prisma";
import { Major, MajorInput } from "./schema";

export class CourseService {
  public async getMajor(userId: string): Promise<Major | null> {
    return await prisma.major.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  public async upsertMajor(userId: string, major: MajorInput): Promise<Major> {
    return await prisma.major.upsert({
      where: {
        userId: userId,
      },
      update: {
        name: major.name,
      },
      create: {
        name: major.name,
        catalog_year: major.catalog_year,
        default_planner_id: major.default_planner_id,
        userId: userId,
      },
    });
  }
}
