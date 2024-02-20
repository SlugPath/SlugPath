import prisma from "@/lib/prisma";
import { Major } from "@customTypes/Major";

// returns todays date + days
export function createDate(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * @param name is the name of the major
 * @param catalogYear is the catalog year of the major
 * @returns the object or the major that was created
 */
export async function createMajor(
  name: string,
  catalogYear: string,
): Promise<Major> {
  const majorData = {
    name,
    catalogYear,
  };
  return prisma.major.create({
    data: {
      ...majorData,
    },
  });
}
