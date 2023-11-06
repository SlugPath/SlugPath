import {
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
} from "./schema";
import prisma from "@/lib/prisma";
import { StoredCourse } from "@/app/ts-types/Course";
import { initialPlanner } from "@/lib/initialPlanner";
import { Course, Prisma, Term } from "@prisma/client";

export class PlannerService {
  /**
   * Creates and/or updates a planner for a user
   * @param input PlannerCreateInput
   * @returns planner id of the updated planner
   */
  public async upsertPlanner({
    userId,
    plannerId,
    plannerData,
    title,
    order,
  }: PlannerCreateInput): Promise<PlannerId> {
    // Delete old planner
    const operations = [];
    const old = await prisma.planner.findUnique({
      where: {
        userId,
        id: plannerId,
      },
    });
    if (old !== null) {
      operations.push(
        prisma.planner.update({
          where: {
            userId,
            id: plannerId,
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
    const newQuarters = Object.keys(plannerData.quarters).map((qid) => {
      const quarter = plannerData.quarters[qid];
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
          userId,
          id: plannerId,
        },
        update: {
          title,
          userId,
          quarters: {
            create: newQuarters,
          },
        },
        create: {
          title,
          userId,
          order,
          id: plannerId,
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
    return { plannerId: result[0].id };
  }

  /**
   * Retrieves all planners for a user, sorted by `order` field in asc order.
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
      orderBy: {
        order: "asc",
      },
    });

    return planners.map((p: any) => this.toPlannerData(p));
  }

  /**
   * Retrieves a single planner for a user by its id
   * @param userId author id
   * @param plannerId planner id
   * @returns a PlannerData instance if it exists, otherwise null
   */
  public async getPlanner({
    userId,
    plannerId,
  }: PlannerRetrieveInput): Promise<PlannerData | null> {
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
   * @returns id of the planner if record was successfully deleted, otherwise null
   */
  public async deletePlanner({
    plannerId,
    userId,
  }: PlannerRetrieveInput): Promise<PlannerId | null> {
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
    return { plannerId };
  }

  /**
   * Converts a Planner from the database to a PlannerData
   * @param planner planner from the database
   * @returns a PlannerData instance
   */
  private toPlannerData(planner: any): PlannerData {
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
