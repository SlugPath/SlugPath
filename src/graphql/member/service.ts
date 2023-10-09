import { Member, MemberEmail } from "./schema";
import { prisma } from "../../lib/prisma";

export class MemberService {
  // Retreive all team members
  public async list(): Promise<Member[]> {
    return await prisma.member.findMany();
  }

  // Retrieve one team member by email
  public async get(memberEmail: MemberEmail): Promise<Member | undefined> {
    const res = await prisma.member.findFirst({
      where: {
        email: memberEmail.email,
      },
    });
    return res !== null ? res : undefined;
  }
}
