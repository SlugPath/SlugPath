"use server";

import prisma from "@/lib/prisma";

export async function getMajors(): Promise<
  {
    name: string;
    id: number;
    catalogYear: string;
  }[]
> {
  const majors = await prisma.major.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      name: true,
      id: true,
      catalogYear: true,
    },
  });

  return majors;
}
