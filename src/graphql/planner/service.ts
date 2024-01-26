import {
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
  PlannerTitle,
  StoredCourse,
} from "./schema";
import prisma from "@/lib/prisma";
import { emptyPlanner } from "@/lib/plannerUtils";
import { LabelColor, Prisma, Term } from "@prisma/client";

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
    // Process labels and quarters outside the transaction
    const labels = plannerData.labels.map((l) => ({
      ...l,
      color: l.color as LabelColor,
    }));
    const notes = plannerData.notes;

    const newQuarters = plannerData.quarters.map((q) => {
      const [year, term] = q.id.split("-").slice(1);
      const enrolledCourses = q.courses.map((c) => ({
        ...c,
        ge: [...c.ge],
        quartersOffered: [...c.quartersOffered],
      }));

      return {
        year: parseInt(year),
        term: term as Term,
        courses: {
          create: enrolledCourses,
        },
      };
    });

    const result = await prisma.$transaction(
      [
        // Delete existing quarters and labels (if necessary)
        // Perform the upsert
        prisma.planner.upsert({
          where: {
            userId,
            id: plannerId,
          },
          create: {
            title,
            notes,
            userId,
            order,
            id: plannerId,
            quarters: {
              create: newQuarters,
            },
            labels: {
              createMany: {
                data: labels,
              },
            },
          },
          update: {
            title,
            notes,
            order,
            // Logic to replace quarters and labels
            quarters: {
              deleteMany: {}, // Deletes all quarters
              create: newQuarters,
            },
            labels: {
              deleteMany: {}, // Deletes all labels
              createMany: {
                data: labels,
              },
            },
          },
          select: {
            id: true,
          },
        }),
      ],
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
      },
    );

    // Return the result
    return { plannerId: result[0].id };
  }

  /**
   * Retrieves all planners for a user, sorted by `order` field in asc order.
   * @param userId user id
   * @returns a list of planner titles and ids belonging to a user
   */
  public async allPlanners(userId: string): Promise<PlannerTitle[]> {
    return await prisma.planner.findMany({
      where: {
        userId,
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
        labels: true,
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
    const newPlanner: PlannerData = JSON.parse(JSON.stringify(emptyPlanner()));
    planner?.quarters.forEach((q: any) => {
      const quarterId = `quarter-${q.year}-${q.term}`;
      const courses: StoredCourse[] = q.courses.map((c: StoredCourse) => {
        return {
          id: c.id,
          departmentCode: c.departmentCode,
          number: c.number,
          credits: c.credits,
          ge: [...c.ge],
          quartersOffered: [...c.quartersOffered],
          description: c.description,
          title: c.title,
          labels: c.labels,
        };
      });
      newPlanner.quarters.push({
        id: quarterId,
        title: `${q.term}`,
        courses,
      });
    });
    newPlanner.labels = [...planner.labels];
    newPlanner.notes = planner.notes ? planner.notes : "";

    // Return new modified planner
    return newPlanner;
  }
}
