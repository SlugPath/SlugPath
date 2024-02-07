import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export async function createUser(email: string, name: string, role?: Role) {
  return await prisma.user.create({
    data: {
      id: uuidv4(),
      email: email,
      name: name,
      role: role,
    },
  });
}
