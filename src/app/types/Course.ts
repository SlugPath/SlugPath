import { z } from "zod";

import { Term } from "./Quarter";

// TODO: Add more rigorous validation
export const storedCourseSchema = z.object({
  id: z.string(),
  departmentCode: z.string(),
  number: z.string(),
  credits: z.number(),
  title: z.string(),
  ge: z.array(z.string()),
  prerequisites: z.string().optional(),
  quartersOffered: z.array(z.string()),
  description: z.string(),
  labels: z.array(z.string()),
});

export type StoredCourse = z.infer<typeof storedCourseSchema>;

export const storedCoursesSchema = z.array(storedCourseSchema);

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

// Search Params is a type to represent the search params for the search bar i.e. GE options
// and department options
export const searchParamsSchema = z.array(
  z.object({
    label: z.string(),
    value: z.string().nullable(),
  }),
);

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Query Details is a type to represent the query details for the search bar i.e. GE and course number
export const queryDetailsSchema = z.object({
  departmentCode: z.string(),
  number: z.string(),
  ge: z.string(),
});

export type QueryDetails = z.infer<typeof queryDetailsSchema>;

export const courseQuerySchema = z.object({
  departmentCode: z.string(),
  number: z.string(),
});

export type CourseQuery = z.infer<typeof courseQuerySchema>;
