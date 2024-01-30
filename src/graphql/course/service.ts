import { prisma } from "@/lib/prisma";
import { QueryDetails, SearchParams, StoredCourse } from "@customTypes/Course";
import { isAlpha } from "class-validator";
import { v4 as uuidv4 } from "uuid";

import { Course, SingleQueryInput } from "./schema";

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
  public async coursesBy(pred: QueryDetails): Promise<StoredCourse[]> {
    const departmentCodeParam = () => {
      if (pred.departmentCode?.length != 0) {
        return {
          departmentCode: {
            contains: pred.departmentCode,
          },
        };
      }
      return {};
    };

    const numberParam = () => {
      if (pred.number) {
        return {
          number: {
            contains: pred.number,
          },
        };
      }
      return {};
    };

    const geParam = () => {
      if (pred.ge) {
        return {
          ge: {
            has: pred.ge,
          },
        };
      }
      return {};
    };

    const courses = await prisma.course.findMany({
      where: {
        departmentCode: departmentCodeParam().departmentCode,
        number: numberParam().number,
        ge: geParam().ge,
      },
    });

    const res = courses.map((r) => {
      return {
        ...r,
        description: r.description ?? "",
      };
    });

    res.sort(compareCoursesByNum);
    // Convert to a stored course
    return res.map((r) => {
      return {
        ...r,
        id: uuidv4(),
        labels: [],
      };
    });
  }
  /**
   * `courseBy` returns a course that satisfies a predicate `pred`
   * or null if no such course exists
   * @returns a `Course` instance
   */
  public async courseBy(pred: SingleQueryInput): Promise<Course | null> {
    const course = await prisma.course.findFirst({
      where: {
        departmentCode: pred.departmentCode,
        number: pred.number,
      },
    });
    if (!course) return null;
    return { ...course, description: course.description ?? "" };
  }

  /**
   * Fetches all unique department names and their codes from the database.
   * Also sorts them.
   * @returns an array of Department instances
   */
  public async getAllDepartments(): Promise<SearchParams> {
    const departments = (
      await prisma.course.findMany({
        distinct: ["department", "departmentCode"],
        select: {
          department: true,
          departmentCode: true,
        },
      })
    ).map((dep) => {
      return {
        label: dep.department,
        value: dep.departmentCode,
      };
    }) as SearchParams;
    departments.sort((a, b) => a.label.localeCompare(b.label));
    return departments;
  }
}
