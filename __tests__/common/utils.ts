import { createUser as createUserAction } from "@/app/actions/user";
import { Program } from "@/app/types/Program";
import prisma from "@/lib/prisma";
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
): Promise<Program> {
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
export async function createUser(user: {
  email: string;
  name: string;
  role?: Role;
  majors?: Program[];
}) {
  const { majors, ...userData } = user;
  const majorIds = majors ? majors?.map((major) => major.id) : [];
  return await createUserAction({ ...userData, userId: uuidv4() }, majorIds);
}

// non prisma helper functions
export function removeIdFromMajorOutput(majors: Program[]) {
  return majors.map((r) => {
    return {
      name: r.name,
      catalogYear: r.catalogYear,
      programType: r.programType,
    };
  });
}
