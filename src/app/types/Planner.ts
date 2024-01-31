import { StoredCourse } from "./Course";
import { Label } from "./Label";
import { Quarter, findQuarter } from "./Quarter";

/**
 * `PlannerData` is a type used to store courses, quarters, and other fields
 */
export type PlannerData = {
  quarters: Quarter[];
  years: number;
  courses: StoredCourse[];
  labels: Label[];
  notes: string;
};

export type PlannerTitle = {
  title: string;
  id: string;
};

/**
 * `CourseTable` is a type used to store courses by id
 */
export type CourseTable = {
  [id: string]: StoredCourse;
};

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
