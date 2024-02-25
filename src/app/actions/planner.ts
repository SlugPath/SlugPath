"use server";

import { toPlannerData } from "@/lib/plannerUtils";
import prisma from "@/lib/prisma";
import { LabelColor } from "@prisma/client";

import { PlannerData } from "../types/Planner";

type PlannerCreateInput = {
  userId: string;
  plannerId: string;
  plannerData: PlannerData;
  title: string;
  order: number;
};

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
      return {
        ...c,
        ge: [...c.ge],
        quartersOffered: [...c.quartersOffered],
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
 * Creates a planner for a user
 * @param input PlannerCreateInput
 * @returns planner id of the updated planner
 */

export async function saveAllPlanners({
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
 * @param userId user id
 * @returns a list of planner titles and ids belonging to a user
 */
export async function getAllPlanners(email: string): Promise<PlannerData[]> {
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
 * @param userId author id
 * @param plannerId planner id
 * @returns a PlannerData instance if it exists, otherwise null
 */

export type PlannerInput = {
  userId: string;
  plannerId: string;
};

export async function getPlannerById(plannerId: string) {
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
