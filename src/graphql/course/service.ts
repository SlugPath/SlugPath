import { prisma } from "@/lib/prisma";
import { Course, QueryInput, Department } from "./schema";
import { isAlpha } from "class-validator";

/**
 * Compares two course instances by number, and returns a
 * number representing the order in which they should appear.
 * @param a Course instance
 * @param b another Course instance
 * @returns
 */
export const compareCoursesByNum = function (a: Course, b: Course): number {
  // Check departments first
  if (a.departmentCode !== b.departmentCode)
    return a.departmentCode.localeCompare(b.departmentCode);

  // Check course numbers
  const aNum = parseInt(a.number.replace(/[A-Z]/g, ""));
  const bNum = parseInt(b.number.replace(/[A-Z]/g, ""));

  if (aNum > bNum) return 1;
  if (bNum > aNum) return -1;

  // Check letters for cases like 115A and 115B
  const aLastChar = a.number[a.number.length - 1];
  const aLet = isAlpha(aLastChar) ? aLastChar : "";

  const bLastChar = b.number[b.number.length - 1];
  const bLet = isAlpha(bLastChar) ? bLastChar : "";

  if (aLet == "" && bLet == "") return 0;
  if (aLet == "") return -1;
  if (bLet == "") return 1;

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
   * `coursesBy` returns a list of courses that satisfies a predicate `pred`,
   * @returns a list of `Course`
   */
  public async coursesBy(pred: QueryInput): Promise<Course[]> {
    const deptCodeQuery = () => {
      return pred.departmentCode?.length != 0
        ? {
            departmentCode: {
              contains: pred.departmentCode,
            },
          }
        : {};
    };

    const numberQuery = () => {
      return pred.number
        ? {
            number: {
              contains: pred.number,
            },
          }
        : {};
    };

    const geQuery = () => {
      return pred.ge
        ? {
            ge: {
              has: pred.ge,
            },
          }
        : {};
    };

    const res = await prisma.course.findMany({
      where: {
        departmentCode: deptCodeQuery().departmentCode,
        number: numberQuery().number,
        ge: geQuery().ge,
      },
    });

    return res.sort(compareCoursesByNum);
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
   * Fetches all unique department names and their codes from the database.
   * @returns an array of Department instances
   */
  public async getAllDepartments(): Promise<Department[]> {
    const departments = await prisma.course.findMany({
      distinct: ["department", "departmentCode"],
      select: {
        department: true,
        departmentCode: true,
      },
    });
    // Map the result to match the Department type
    return departments.map((dep) => ({
      name: dep.department,
      code: dep.departmentCode,
    }));
  }
}
