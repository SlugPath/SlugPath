import { Course as CourseModel } from "@prisma/client";

export interface Course {
  id: string;
  name: string;
}
export interface CourseList {
  courses: CourseModel[];
}
