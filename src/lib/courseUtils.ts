import { StoredCourse } from "../app/ts-types/Course";

export function getTitle(department: string, number: string) {
  return `${department} ${number}`;
}

/**
 * Creates a `StoredCourse` from an id
 * @param id course id
 * @returns a `StoredCourse` object
 */
export function createCourseFromId(id: string): StoredCourse {
  const [department, number] = id.split("-");
  return {
    number,
    department,
  };
}

/**
 * Creates an id from a `StoredCourse` object
 * @param course `StoredCourse` object
 * @returns an id
 */
export function createIdFromCourse(course: StoredCourse): string {
  const { department, number } = course;
  return `${department}-${number}`;
}
