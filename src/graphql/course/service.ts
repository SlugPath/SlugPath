import { Course } from "@generated/type-graphql/models/Course";
import { prisma } from "../../lib/prisma";

export class CourseService {
  // Retrieve all courses above or below a number
  public async coursesAboveOrBelow(
    courseNumber: number,
    above: boolean = false,
  ): Promise<Course[]> {
    const res = await prisma.course.findMany();
    return res.filter((r: Course) => {
      const num = parseInt(r.number.replace(/[A-Za-z]/g, ""));
      return above ? num > courseNumber : num < courseNumber;
    });
  }
}
