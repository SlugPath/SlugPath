import { v4 as uuidv4 } from "uuid";
import { DummyCourse } from "../ts-types/Course";

export function createStoredCourse(course: DummyCourse) {
  return {
    uuid: uuidv4(),
    id: course.id,
    credits: course.credits,
    department: course.department,
    name: course.name,
    number: course.number,
  };
}

export function getTitle(department: string, number: string) {
  return `${department} ${number}`;
}
