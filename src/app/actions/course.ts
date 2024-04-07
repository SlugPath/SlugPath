"use server";

import prisma from "@/lib/prisma";
import {
  compareCoursesByNum,
  fromTransferToStoredCourse,
  toStoredCourse,
} from "@/lib/utils";
import { Course, Prisma } from "@prisma/client";

import {
  CourseQuery,
  SearchParams,
  SearchQueryDetails,
  StoredCourse,
} from "../types/Course";

/**
 * Fetches courses from the database based on specified query details
 * @param pred query details
 * @returns Courses that match the query details
 */
export async function getCoursesBy(
  pred: SearchQueryDetails,
): Promise<StoredCourse[]> {
  const query: any = {
    where: {},
  };

  if (pred.departmentCode) {
    query.where.departmentCode = {
      contains: pred.departmentCode,
    };
  }

  if (pred.number) {
    query.where.number = {
      contains: pred.number,
    };
  }

  if (pred.ge) {
    query.where.ge = {
      has: pred.ge,
    };
  }

  if (pred.creditRange) {
    query.where.credits = {
      gte: pred.creditRange[0],
      lte: pred.creditRange[1],
    };
  }

  // Since course numbers can contain non-integer characters, a raw SQL query is necessary.
  // If the number field is empty, a raw query is used. If not, regular Prisma Client commands are used,
  // as the course number slider has no effect when the number field is active.
  let courses = [];
  if (pred.number) {
    courses = await prisma.course.findMany(query);
  } else {
    // Raw query filters integers from course number characters to see if in slider range
    // If department or ge fields are empty an empty query is used
    courses = await prisma.$queryRaw<Course[]>`
      SELECT *
      FROM "Course"
      WHERE
      ${
        pred.departmentCode
          ? Prisma.sql`"departmentCode" = ${pred.departmentCode} AND`
          : Prisma.empty
      }
      ${pred.ge ? Prisma.sql`${pred.ge} = ANY("ge") AND` : Prisma.empty}
      CAST(REGEXP_REPLACE("number", '[^0-9]', '', 'g') AS INT) >= ${
        pred.numberRange[0]
      } 
      AND CAST(REGEXP_REPLACE("number", '[^0-9]', '', 'g') AS INT) <= ${
        pred.numberRange[1]
      }
      AND "credits" >= ${pred.creditRange[0]} 
      AND "credits" <= ${pred.creditRange[1]};
    `;
  }

  // Convert to a stored course and sort by number
  const res = courses.map(toStoredCourse);
  res.sort(compareCoursesByNum);
  return res;
}

/**
 * Returns a list of transfer alternatives for a particular course at UCSC
 * across the UC-CCC-CSU system
 * @param course an official UCSC course
 * @returns a list of transfer alternatives for `course`
 */
export async function getTransferEquivalents(
  course: StoredCourse,
): Promise<StoredCourse[]> {
  const res = await prisma.course.findFirst({
    where: {
      departmentCode: course.departmentCode,
      number: course.number,
    },
    select: {
      ge: true,
      transferCourses: {
        select: {
          id: true,
          title: true,
          departmentCode: true,
          number: true,
          school: true,
        },
      },
    },
  });
  if (!res) return [];

  const { transferCourses, ge } = res;

  return transferCourses.map((t) => fromTransferToStoredCourse(t, ge));
}

/**
 * Fetch courses that match the specified titles
 * @param titles course titles to match
 * @returns courses that match the specified titles
 */
export async function getSuggestedCourses(
  titles: string[],
): Promise<StoredCourse[]> {
  const courses: Course[] = [];
  for (const title of titles) {
    const res = await prisma.course.findFirst({
      where: {
        departmentCode: {
          equals: title.split(" ")[0].toUpperCase(),
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

/**
 * Fetch course information based on the specified query details
 * @param pred query details
 * @returns course that matches the query details
 */
export async function getCourse(
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

/**
 * Fetches all departments
 * @returns all departments in the database
 */
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
