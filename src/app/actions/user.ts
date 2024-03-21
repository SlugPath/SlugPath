"use server";

import prisma from "@/lib/prisma";

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
  }: {
    userId: string;
    email: string;
    name: string;
  },
  programIds: number[],
) {
  return await prisma.user.upsert({
    create: {
      id: userId,
      email,
      name,
      majors: {
        connect: programIds.map((id) => ({ id })),
      },
    },
    where: {
      id: userId,
    },
    update: {
      name,
    },
  });
}
