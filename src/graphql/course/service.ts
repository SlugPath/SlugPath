import { prisma } from "@/lib/prisma";
import Course from "@/app/ts-types/Course";
import { QueryInput, UpsertInput } from "@/app/ts-types/Args";

const COURSES_LIMIT = 100;

/**
 * CourseService is a service class used to execute custom functions
 * on courses through an instance of a `Prisma` client
 */
export class CourseService {
  /**
   * `allCourses` returns a list of all courses, limited by `COURSES_LIMIT`
   * @returns a list of `Course`
   */
  public async allCourses(): Promise<Course[]> {
    return await prisma.course.findMany({
      take: COURSES_LIMIT,
    });
  }

  /**
   * `coursesBy` returns a list of courses that satisfies a predicate `pred`,
   * limited by `COURSES_LIMIT`.
   * @returns a list of `Course`
   */
  public async coursesBy(pred: QueryInput): Promise<Course[]> {
    return await prisma.course.findMany({
      where: {
        id: pred.id,
        name: {
          contains: pred.name,
        },
        department: pred.department,
        number: pred.number,
        credits: pred.credits,
      },
      take: COURSES_LIMIT,
    });
  }

  /**
   *  `coursesAboveOrBelow` returns a list of `Course` values that are either
   *  above or below `courseNumber` depending on the value of the
   *  `above` flag.
   * @param courseNumber integer value representing a course number
   * @param above a flag. If true it returns courses above, otherwise courses below
   * @returns a list of `Course` instances.
   */
  public async coursesAboveOrBelow(
    { department, courseNum }: { department: string; courseNum: number },
    above: boolean = false,
  ): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: {
        department: department,
      },
    });
    return courses.filter((c: Course) => {
      const num = parseInt(c.number.replace(/[A-Za-z]/g, ""));
      return above ? num > courseNum : num < courseNum;
    });
  }

  /**
   *  `createCourse` creates a course if one with the same `department`
   *  and course `number` does not exist already
   * @param input an `CreateInput` instance
   * @returns the created `Course` instance upon success
   */
  public async createCourse(input: UpsertInput): Promise<Course> {
    return await prisma.course.create({
      data: {
        ...input,
      },
    });
  }

  /**
   *  `updateCourse` updates a course provided a valid `department`
   *  and course `number` in the input
   * @param input an `UpdateInput` instance
   * @returns the updated `Course` instance upon success
   */
  public async updateCourse(input: UpsertInput): Promise<Course> {
    return await prisma.course.update({
      data: {
        ...input,
      },
      where: {
        department_number: {
          department: input.department,
          number: input.number,
        },
      },
    });
  }
}
