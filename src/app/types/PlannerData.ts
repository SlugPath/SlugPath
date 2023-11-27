import { StoredCourse } from "./Course";
import { Quarter, findQuarter } from "./Quarter";
import { Label } from "./Label";

/**
 * `PlannerData` is a placeholder type used to store courses, quarters, and other fields
 */
export interface PlannerData {
  quarters: Quarter[];
  years: number;
  courses: StoredCourse[];
  labels: Label[];
}

export interface CourseTable {
  [id: string]: StoredCourse;
}

export const findCourseById = (
  courseState: PlannerData,
  id: string,
): StoredCourse => {
  const course = courseState.courses.find((c) => c.id === id);
  if (course === undefined) throw new Error("course not found");
  return course;
};

export const findCoursesInQuarter = (
  courseState: PlannerData,
  qid: string,
): StoredCourse[] => {
  const { quarter } = findQuarter(courseState.quarters, qid);
  return quarter.courses.map((cid) => findCourseById(courseState, cid));
};
