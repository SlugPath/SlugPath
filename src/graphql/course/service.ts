import { Course } from "./schema";
import { prisma } from "../../lib/prisma";
import { MutableCourseInput, QueryableCourseInput } from "./args";

export class CourseService {
  // Retreive all courses
  public async list(): Promise<Course[]> {
    return await prisma.course.findMany();
  }

  // Retrieve a subset of the courses based on constraints
  public async get(input: QueryableCourseInput): Promise<Course[]> {
    return await prisma.course.findMany({
      where: {
        name: {
          contains: input.name,
        },
        department: input.department,
        number: {
          contains: input.number,
        },
        credits: input.credits,
      },
    });
  }

  // Creates a new course in the database with a unique department
  // and course number, or updates an existing one
  public async upsert(input: MutableCourseInput): Promise<Course> {
    return await prisma.course.upsert({
      where: {
        department_number: {
          department: input.department,
          number: input.number,
        },
      },
      create: {
        department: input.department,
        number: input.number,
        name: input.name,
        credits: input.credits,
      },
      update: {
        name: input.name,
        credits: input.credits,
      },
    });
  }

  // Delete a course by id
  public async delete(id: string): Promise<Course> {
    return await prisma.course.delete({
      where: {
        id: id,
      },
    });
  }
}
