import { Course } from "@prisma/client"

export interface CourseQueryResult {
  courses: Course[]
}