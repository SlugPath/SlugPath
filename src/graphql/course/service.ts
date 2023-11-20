import { prisma } from "@/lib/prisma";
import {
  Course,
  DeleteInput,
  OrderedInput,
  QueryInput,
  UpsertInput,
  Department,
} from "./schema";
import { isAlpha } from "class-validator";

// const COURSES_LIMIT = 100;
const MAX_COURSE_NUM: number = 299;

const compareCoursesByNum = function (a: Course, b: Course): number {
  // Check numbers first
  const aNum = parseInt(a.number.replace(/[A-Z]/g, ""));
  const bNum = parseInt(b.number.replace(/[A-Z]/g, ""));

  if (aNum > bNum) return 1;
  if (bNum > aNum) return -1;

  // Check letters for cases like 115A and 115B
  const aLastChar = a.number[a.number.length - 1];
  const aLet = isAlpha(aLastChar) ? aLastChar : "";

  const bLastChar = b.number[b.number.length - 1];
  const bLet = isAlpha(bLastChar) ? bLastChar : "";

  if (aLet == "") return 0;

  if (aLet > bLet) return 1;
  if (bLet > aLet) return -1;

  return 0;
};

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
    return await prisma.course.findMany({});
  }

  /**
   * Returns `numCourses` `Course` instances in
   * @param department string value representing a school department
   * @param numCourses number of courses to return
   * @returns a list of `Course` instances
   */
  public async coursesInOrder(input: OrderedInput): Promise<Course[]> {
    return (
      await this.coursesAboveOrBelow({
        departmentCode: input.departmentCode,
        courseNum: MAX_COURSE_NUM,
      })
    )
      .sort(compareCoursesByNum)
      .slice(0, input.numCourses);
  }

  /**
   * `coursesBy` returns a list of courses that satisfies a predicate `pred`,
   * @returns a list of `Course`
   */
  public async coursesBy(pred: QueryInput): Promise<Course[]> {
    if (pred.number && pred.number?.length > 0) {
      return await prisma.course.findMany({
        where: {
          departmentCode: pred.departmentCode,
          number: {
            contains: pred.number,
          },
        },
      });
    } else {
      return await prisma.course.findMany({
        where: {
          departmentCode: pred.departmentCode,
        },
      });
    }
  }

  /**
   * `courseBy` returns a course that satisfies a predicate `pred`
   * or null if no such course exists
   * @returns a `Course` instance
   */
  public async courseBy(pred: QueryInput): Promise<Course | null> {
    return await prisma.course.findFirst({
      where: {
        departmentCode: pred.departmentCode,
        number: pred.number,
      },
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
    {
      departmentCode,
      courseNum,
    }: { departmentCode: string; courseNum: number },
    above: boolean = false,
  ): Promise<Course[]> {
    const courses = await prisma.course.findMany({
      where: {
        departmentCode: departmentCode,
      },
    });
    return courses.filter((c: Course) => {
      const num = parseInt(c.number.replace(/[A-Za-z]/g, ""));
      return above ? num > courseNum : num < courseNum;
    });
    // .slice(0, COURSES_LIMIT);
  }

  /**
   * Fetches all unique department names from the database.
   * @returns an array of Department instances
   */
  public async getAllDepartments(): Promise<Department[]> {
    const departments = await prisma.course.findMany({
      distinct: ["department"],
      select: {
        department: true,
      },
    });
    // Map the result to match the Department type
    return departments.map((dep) => ({
      name: dep.department,
    }));
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
        departmentCode_number: {
          departmentCode: input.departmentCode,
          number: input.number,
        },
      },
    });
  }

  /**
   *  `deleteCourse` deletes a course provided a valid `department`
   *  and course `number` in the input
   * @param input a `DeleteInput` instance
   * @returns the deleted `Course` instance upon success
   */
  public async deleteCourse(input: DeleteInput): Promise<Course> {
    return await prisma.course.delete({
      where: {
        departmentCode_number: {
          departmentCode: input.departmentCode,
          number: input.number,
        },
      },
    });
  }
}
