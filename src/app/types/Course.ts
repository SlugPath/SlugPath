import { Term } from "./Quarter";

/**
 * `StoredCourse` is a type to represent courses
 */
export interface StoredCourse {
  id: string;
  departmentCode: string;
  number: string; // because some course numbers are 12L, 115A etc.
  credits: number;
  title: string;
  ge: string[];
  quartersOffered: string[];
  description: string;
  labels: string[];
}

export type CourseTerm = [StoredCourse, Term | undefined] | undefined;

/**
 * `CustomCourseInput` is a type to represent the input for a custom course
 */
export interface CustomCourseInput {
  title: string;
  description: string;
  credits: number;
  quartersOffered: string[];
}
