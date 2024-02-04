"use server";

import prisma from "@/lib/prisma";
import { compareCoursesByNum, toStoredCourse } from "@/lib/utils";

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

  // Convert to a stored course and sort by number
  const res = courses.map(toStoredCourse);
  res.sort(compareCoursesByNum);
  return res;
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
