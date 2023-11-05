import { PlannerData } from "@/app/ts-types/PlannerData";
import prisma from "@/lib/prisma";
import { StoredCourse } from "@/app/ts-types/Course";
import { initialPlanner } from "@/lib/initialPlanner";
import { Course, Term } from "@prisma/client";

export class PlannerService {
  public async upsert(
    userId: number,
    {
      p,
      id,
      title,
      active,
    }: { p: PlannerData; id: string; title: string; active: boolean },
  ) {
    // Delete old quarters in the current planner
    const deleteQuarters = prisma.planner.update({
      where: {
        userId,
        id,
      },
      data: {
        quarters: {
          deleteMany: {},
        },
      },
    });

    // Get the new quarters
    const newQuarters = Object.keys(p.quarters).map((qid) => {
      const quarter = p.quarters[qid];
      const [year, term] = qid.split("-").slice(1);

      const courses = quarter.courses.map((c) => {
        return {
          department_number: {
            department: c.department,
            number: c.number,
          },
        };
      });
      return {
        id: qid,
        year: parseInt(year),
        term: term as Term,
        courses: {
          connect: courses,
        },
      };
    });

    // Perform upsert
    const upsert = prisma.planner.upsert({
      where: {
        userId,
        id,
      },
      include: {
        quarters: {
          include: {
            courses: true,
          },
        },
      },
      update: {
        title,
        active,
        quarters: {
          create: newQuarters,
        },
      },
      create: {
        title,
        active,
        userId,
        quarters: {
          create: newQuarters,
        },
      },
    });

    // Perform all queries as a transaction
    await prisma.$transaction([deleteQuarters, upsert]);
  }

  /**
   * Retrieves all planners for a user
   * @param userId user id
   * @returns a list of planners belonging to a user
   */
  public async allPlanners(userId: number): Promise<PlannerData[]> {
    const planners = await prisma.planner.findMany({
      where: {
        userId,
      },
      include: {
        quarters: {
          include: {
            courses: true,
          },
        },
      },
    });

    return planners.map((p) => this.toPlannerData(p));
  }

  /**
   * Deletes a planner belonging to a particular user
   * @param userId user id
   * @param plannerId planner id
   */
  public async deletePlanner(userId: number, plannerId: string) {
    await prisma.planner.delete({
      where: {
        userId: userId,
        id: plannerId,
      },
    });
  }

  /**
   * Converts a Planner from the database to a PlannerData
   * @param planner planner from the database
   * @returns a PlannerData instance
   */
  public toPlannerData(planner: any): PlannerData {
    // Set all the courses for each quarter
    const newPlanner: PlannerData = JSON.parse(JSON.stringify(initialPlanner));
    planner?.quarters.forEach((q: any) => {
      const quarterId = `quarter-${q.year}-${q.term}`;
      const courses: StoredCourse[] = q.courses.map((c: Course) => {
        return {
          department: c.department,
          number: c.number,
        };
      });
      newPlanner.quarters[quarterId] = {
        title: `Year ${q.year}: ${q.term}`,
        courses,
      };
    });

    // Return new modified planner
    return newPlanner;
  }
}
