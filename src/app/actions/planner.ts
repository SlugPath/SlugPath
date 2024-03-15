"use server";

import { toPlannerData } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
import { LabelColor } from "@prisma/client";

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
export async function saveAllUserPlanners({
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
 * Retrieves all planners for a user, sorted by `order` field in asc order.
 * @param email user email
 * @returns a list of planner titles and ids belonging to a user
 */
export async function getUserPlannersByEmail(
  email: string,
): Promise<PlannerData[]> {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) return [];

  const plans = await prisma.planner.findMany({
    where: {
      userId: user.id,
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
 * Retrieves a single planner for a user by its id
 * @param plannerId planner id
 * @returns a PlannerData instance if it exists, otherwise null
 */
export async function getPlannerById(plannerId: string | undefined) {
  if (!plannerId) return null;
  const p = await prisma.planner.findUnique({
    where: {
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

  if (!p) throw new Error(`Planner with id ${plannerId} not found`);

  return toPlannerData(p);
}
