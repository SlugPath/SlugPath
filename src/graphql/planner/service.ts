import { PlannerData } from "@/app/ts-types/PlannerData";
import prisma from "@/lib/prisma";
import { StoredCourse } from "@/app/ts-types/Course";
import { initialPlanner } from "@/lib/initialPlanner";
import { Course, Prisma, Term } from "@prisma/client";

export class PlannerService {
  public async upsert(
    userId: string,
    {
      p,
      id,
      title,
      active,
    }: { p: PlannerData; id: string; title: string; active: boolean },
  ): Promise<string> {
    // Delete old planner
    const operations = [];
    const old = await prisma.planner.findUnique({
      where: {
        id,
        userId,
      },
    });
    if (old !== null) {
      operations.push(
        prisma.planner.update({
          where: {
            id,
            userId,
          },
          data: {
            quarters: {
              deleteMany: {},
            },
          },
        }),
      );
    }

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
        year: parseInt(year),
        term: term as Term,
        courses: {
          connect: courses,
        },
      };
    });

    // Perform upsert
    operations.push(
      prisma.planner.upsert({
        where: {
          id,
          userId,
        },
        update: {
          title,
          active,
          userId,
          quarters: {
            create: newQuarters,
          },
        },
        create: {
          title,
          active,
          userId,
          id,
          quarters: {
            create: newQuarters,
          },
        },
        select: {
          id: true,
        },
      }),
    );

    // Perform all queries as a serial transaction
    const result = await prisma.$transaction(operations, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    // Return the id
    return result[0].id;
  }

  /**
   * Retrieves all planners for a user
   * @param userId user id
   * @returns a list of planners belonging to a user
   */
  public async allPlanners(userId: string): Promise<PlannerData[]> {
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
   * Retrieves a single planner for a user by its id
   * @param userId author id
   * @param plannerId planner id
   * @returns
   */
  public async getPlanner(
    userId: string,
    plannerId: string,
  ): Promise<PlannerData | null> {
    const p = await prisma.planner.findUnique({
      where: {
        userId,
        id: plannerId,
      },
      include: {
        quarters: {
          include: {
            courses: true,
          },
        },
      },
    });
    return p !== null ? this.toPlannerData(p) : null;
  }

  /**
   * Deletes a planner belonging to a particular user
   * @param userId user id
   * @param plannerId planner id
   * @returns true if record was successfully deleted
   */
  public async deletePlanner(
    userId: string,
    plannerId: string,
  ): Promise<string | null> {
    // Check if it exists first
    const exists = await prisma.planner.findUnique({
      where: {
        id: plannerId,
        userId,
      },
    });
    if (exists === null) return null;
    // Then delete it if it does exist
    await prisma.planner.delete({
      where: {
        id: plannerId,
        userId,
      },
    });
    return plannerId;
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
