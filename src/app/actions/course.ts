"use server";

import prisma from "@/lib/prisma";
import { compareCoursesByNum, toStoredCourse } from "@/lib/utils";
import { Course } from "@prisma/client";

import {
  CourseQuery,
  SearchParams,
  SearchQueryDetails,
  StoredCourse,
} from "../types/Course";

export async function coursesBy(
  pred: SearchQueryDetails,
): Promise<StoredCourse[]> {
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

  console.log("number range: ", pred.numberRange);

  /* If number is provided, it behaves as before. 
  If numberRange is provided with values different from the default range (0, 299), 
  it sets gte (greater than or equal to) and lte (less than or equal to) */
  const numberParam = () => {
    if (pred.number) {
      console.log("In number");
      return {
        number: {
          contains: pred.number,
        },
      };
    }
    if (
      pred.numberRange &&
      (pred.numberRange[0] !== 0 || pred.numberRange[1] !== 299)
    ) {
      console.log("In number range");
      return {
        number: {
          gte: pred.numberRange[0].toString(), // Greater than or equal to minNumber
          lte: pred.numberRange[1].toString(), // Less than or equal to maxNumber
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
      ...numberParam(),
      ge: geParam().ge,
    },
  });

  // Log the generated filter conditions for debugging
  console.log("Filter conditions:", {
    departmentCode: departmentCodeParam().departmentCode,
    ...numberParam(),
    ge: geParam().ge,
  });
  // Convert to a stored course and sort by number
  const res = courses.map(toStoredCourse);
  res.sort(compareCoursesByNum);
  return res;
}

export async function getSuggestedClasses(
  titles: string[],
): Promise<StoredCourse[]> {
  const courses: Course[] = [];
  for (const title of titles) {
    const res = await prisma.course.findFirst({
      where: {
        departmentCode: {
          equals: title.split(" ")[0],
        },
        number: {
          equals: title.split(" ")[1],
        },
      },
    });
    // Prevent duplicates and undefined
    if (
      res &&
      !courses.find(
        (c) =>
          c.number === res.number && c.departmentCode === res.departmentCode,
      )
    )
      courses.push(res);
  }
  return courses.map(toStoredCourse);
}

export async function courseInfo(
  pred: CourseQuery,
): Promise<StoredCourse | undefined> {
  const course = await prisma.course.findFirst({
    where: {
      departmentCode: pred.departmentCode,
      number: pred.number,
    },
  });
  if (!course) return undefined;
  return toStoredCourse(course);
}

export async function getAllDepartments(): Promise<SearchParams> {
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
