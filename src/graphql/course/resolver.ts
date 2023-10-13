import { Course } from "./schema";
import { CourseService } from "./service";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class CourseResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [Course])
  async courses(): Promise<Course[]> {
    return await new CourseService().list();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [Course])
  async course(
    @Arg("name", {defaultValue: "Introduction to Data Structures and Algorithms"}) name: string,
    @Arg("department", { defaultValue: "CSE" }) department: string,
    @Arg("number", { defaultValue: "101" }) number: string,
    @Arg("credits", { defaultValue: 5 }) credits: number,
  ): Promise<Course[]> {
    return await new CourseService().get({name, department, number, credits});
  }
}
