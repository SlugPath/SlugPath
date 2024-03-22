"use server";

import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

/**
 * Create a user in the database, and associate them with Program(s)
 * @param UserParams user's name, email, and id
 * @param programIds the ids of the programs to associate the user with
 */
export async function createUser(
  {
    userId,
    email,
    name,
    role,
  }: {
    userId: string;
    email: string;
    name: string;
    role?: Role;
  },
  programIds: number[],
) {
  return await prisma.user.create({
    data: {
      id: userId,
      email,
      name,
      role,
      majors: {
        connect: programIds.map((id) => ({ id })),
      },
    },
  });
}
