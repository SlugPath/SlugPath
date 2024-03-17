"use server";

import prisma from "@/lib/prisma";

/**
 * Fetches the list of unique catalog years, optionally for a specific program
 *
 * TODO: Add unit tests
 * @param programName The program to fetch catalog years for
 * @returns A list of catalog years
 */
export async function getCatalogYears(programName?: string) {
  // Used Raw SQL to allow for DISTINCT, as Prisma support is experimental in v6
  if (!programName) {
    const result =
      await prisma.$queryRaw`SELECT DISTINCT "catalogYear" FROM "Major" ORDER BY "catalogYear" ASC;`;
    return result as { catalogYear: string }[];
  }

  const result =
    await prisma.$queryRaw`SELECT DISTINCT "catalogYear" FROM "Major" WHERE name=${programName} ORDER BY "catalogYear" ASC;`;
  return result as { catalogYear: string }[];
}
