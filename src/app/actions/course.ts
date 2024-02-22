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
  console.log("pred.departmentCode: ", pred.departmentCode);
  console.log("pred.number: ", pred.number);
  console.log("pred.numberRange: ", pred.numberRange);
  console.log("pred.ge: ", pred.ge);
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
      console.log("In number");
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

  let courses = [];
  if (
    pred.numberRange &&
    (pred.numberRange[0] !== 0 || pred.numberRange[1] !== 299) &&
    !pred.number
  ) {
    console.log("In range");
    if (pred.ge) {
      courses = await prisma.$queryRaw<Course[]>`
        SELECT *
        FROM "Course"
        WHERE ("departmentCode" = ${pred.departmentCode} OR ${pred.departmentCode} = '') 
        AND CAST(REGEXP_REPLACE("number", '[^0-9]', '', 'g') AS INT) BETWEEN ${pred.numberRange[0]} AND ${pred.numberRange[1]}
        AND ${pred.ge} = ANY("ge")
      `;
    } else {
      courses = await prisma.$queryRaw<Course[]>`
      SELECT *
      FROM "Course"
      WHERE ("departmentCode" = ${pred.departmentCode} OR ${pred.departmentCode} = '') 
      AND CAST(REGEXP_REPLACE("number", '[^0-9]', '', 'g') AS INT) BETWEEN ${pred.numberRange[0]} AND ${pred.numberRange[1]}
    `;
    }
  } else {
    courses = await prisma.course.findMany({
      where: {
        departmentCode: departmentCodeParam().departmentCode,
        number: numberParam().number,
        ge: geParam().ge,
      },
    });
  }
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
