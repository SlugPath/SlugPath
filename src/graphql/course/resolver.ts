import { Course } from "@generated/type-graphql/models/Course";
import { CourseService } from "./service";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver(Course)
export class CourseResolver {
  @Query(() => [Course])
  async coursesBelow(@Arg("number") courseNum: number): Promise<Course[]> {
    return await new CourseService().coursesAboveOrBelow(courseNum);
  }

  @Query(() => [Course])
  async coursesAbove(@Arg("number") courseNum: number): Promise<Course[]> {
    return await new CourseService().coursesAboveOrBelow(courseNum, true);
  }
}
