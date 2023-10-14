import { MutableCourseInput, QueryableCourseInput } from "./args";
import { Course } from "./schema";
import { CourseService } from "./service";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

@Resolver()
export class CourseResolver {
  @Query(() => [Course])
  async courses(): Promise<Course[]> {
    return await new CourseService().list();
  }

  @Query(() => [Course])
  async course(@Arg("input") input: QueryableCourseInput): Promise<Course[]> {
    return await new CourseService().get(input);
  }

  @Mutation(() => Course)
  async upsertCourse(@Arg("input") input: MutableCourseInput): Promise<Course> {
    return await new CourseService().upsert(input);
  }

  @Mutation(() => Course)
  async deleteCourse(@Arg("id") id: string): Promise<Course> {
    return new CourseService().delete(id);
  }
}
