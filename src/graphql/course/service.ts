import { Course } from "./schema";
import { prisma } from "../../lib/prisma";

export class CourseService {
  // Retreive all team members
  public async list(): Promise<Course[]> {
    return await prisma.course.findMany();
  }

  // Retrieve one team member by email
  // public async get(memberEmail: MemberEmail): Promise<Member | undefined> {
  //   const res = await prisma.member.findFirst({
  //     where: {
  //       email: memberEmail.email,
  //     },
  //   });
  //   return res !== null ? res : undefined;
  // }

  // Create a member with name and email
  // public async create(member: Member): Promise<Member> {
  //   return await prisma.member.create({
  //     data: {
  //       name: member.name,
  //       email: member.email,
  //     }
  //   });
  // }

  // Delete a member by id
  // public async delete(id: string): Promise<Member> {
  //   return await prisma.member.delete({
  //     where: {
  //       id: id
  //     }
  //   });
  // }
}
