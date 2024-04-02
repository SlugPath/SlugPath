"use server";

import { clonePlanner, toPlannerData } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
import { LabelColor } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { PlannerCreateInput, PlannerData } from "../types/Planner";

/**
 * Create a planner for a user
 * @param tx (transaction) prisma client
 * @param PlannerCreateInput data needed to create a planner for a user
 * @returns PlannerData instance
 */
async function createPlanner(
  tx: any,
  { userId, plannerId, plannerData, title, order }: PlannerCreateInput,
) {
  // Process labels and quarters outside the transaction
  const labels = plannerData.labels.map((l) => ({
    ...l,
    color: l.color as LabelColor,
  }));

  const notes = plannerData.notes;

  const newQuarters = plannerData.quarters.map((q) => {
    const { year, title: term } = q;
    const enrolledCourses = q.courses.map((cid) => {
      const c = plannerData.courses.find((c) => c.id === cid);
      if (!c) {
        throw new Error(`Course with id ${cid} not found`);
      }
      // Remove prerequisites from the course when saving
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { prerequisites: _, ...rest } = c;
      return {
        ...rest,
        ge: [...rest.ge],
        quartersOffered: [...rest.quartersOffered],
      };
    });

    return {
      year,
      term,
      courses: {
        create: enrolledCourses,
      },
    };
  });

  return tx.planner.create({
    data: {
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
  });
}

/**
 * Save all planners for a user
 * @param param userId and planner data
 * @returns planner id of the updated planner
 */
export async function updateUserPlanners({
  userId,
  planners,
}: {
  userId: string;
  planners: PlannerData[];
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.planner.deleteMany({
      where: {
        userId,
      },
    });

    await Promise.all(
      planners.map((p, i) =>
        createPlanner(tx, {
          userId,
          plannerId: p.id,
          plannerData: p,
          title: p.title,
          order: i,
        }),
      ),
    );
  });
}

/**
 * Duplicates a planner for a user
 * @param userId id of the user
 * @param plannerId if
 */
export async function duplicatePlanner(userId: string, plannerId: string) {
  await prisma.$transaction(async (tx) => {
    const plan = await getPlannerById(plannerId, tx);
    if (!plan) throw new Error("couldn't find planner to duplicate");
    const dupePlan = clonePlanner({
      ...plan,
      id: uuidv4(),
    });
    await createPlanner(tx, {
      userId,
      plannerId: dupePlan.id,
      title: `Copy of ${plan.title}`,
      plannerData: dupePlan,
      order: 0,
    });
  });
}

/**
 * Retrieves all planners for a user, sorted by `order` field in asc order.
 * @param userId user email
 * @returns a list of planner titles and ids belonging to a user
 */
export async function getUserPlanners(userId: string): Promise<PlannerData[]> {
  const plans = await prisma.planner.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      labels: true,
      quarters: {
        include: {
          courses: true,
        },
      },
    },
  });

  return plans.map(toPlannerData);
}

/**
 * Retrieves all planners for a program
 * @param programName name of the program
 * @returns a PlannerData instance if it exists, otherwise null
 */
export async function getPlannersByProgram(programName: string) {
  const plans = await prisma.planner.findMany({
    where: {
      major: {
        name: programName,
      },
    },
    include: {
      labels: true,
      quarters: {
        include: {
          courses: true,
        },
      },
    },
  });

  return plans.map(toPlannerData);
}

/**
 * Retrieves a single planner its id
 * @param plannerId planner id
 * @returns a PlannerData instance if it exists, otherwise null
 */
export async function getPlannerById(
  plannerId: string | undefined,
  tx: any = prisma,
) {
  if (!plannerId) return null;
  const p = await tx.planner.findUnique({
    where: {
      id: plannerId,
    },
    include: {
      labels: true,
      quarters: {
        include: {
          courses: true,
        },
      },
    },
  });

  if (!p) throw new Error(`Planner with id ${plannerId} not found`);

  return toPlannerData(p);
}
