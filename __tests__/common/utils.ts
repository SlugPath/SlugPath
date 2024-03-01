import prisma from "@/lib/prisma";
import { Major } from "@customTypes/Major";
import { ProgramType, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
  programType: ProgramType,
): Promise<Major> {
  const majorData = {
    name,
    catalogYear,
    programType,
  };
  return prisma.major.create({
    data: {
      ...majorData,
    },
  });
}

/**
 * Creates a user in the database
 * @returns newly created user
 */
export async function createUser({
  email,
  name,
  role,
  majors,
}: {
  email: string;
  name: string;
  role?: Role;
  majors?: Major[];
}) {
  return await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name,
      role,
      majors: {
        connect: majors?.map((major) => ({ id: major.id })),
      },
    },
  });
}

// non prisma helper functions
export function removeIdFromMajorOutput(majors: Major[]) {
  return majors.map((r) => {
    return {
      name: r.name,
      catalogYear: r.catalogYear,
      programType: r.programType,
    };
  });
}
