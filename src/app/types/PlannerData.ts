import { StoredCourse } from "./Course";
import { Quarter, findQuarter } from "./Quarter";

/**
 * `PlannerData` is a placeholder type used to store courses, quarters, and other fields
 */
export interface PlannerData {
  quarters: Quarter[];
  years: number;
  courseTable: CourseTable;
}

export interface CourseTable {
  [id: string]: StoredCourse;
}

export const findCourseById = (
  courseState: PlannerData,
  id: string,
): StoredCourse => {
  return courseState.courseTable[id];
};

export const findCoursesInQuarter = (
  courseState: PlannerData,
  qid: string,
): StoredCourse[] => {
  const { quarter } = findQuarter(courseState.quarters, qid);
  return quarter.courses.map((cid) => findCourseById(courseState, cid));
};
