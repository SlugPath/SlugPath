import { Course as CourseModel } from "@prisma/client";

export interface Course {
  id: string;
  name: string;
  credits: number;
  department: string;
  number: string;           // because some course numbers are 12L, 115A etc.
}
export interface CourseList {
  courses: CourseModel[];
}
