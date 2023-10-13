import { Course } from "./schema";
import { CourseService } from "./service";
import { Query, Resolver } from "type-graphql";

@Resolver()
export class MemberResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [Course])
  async courses(): Promise<Course[]> {
    return await new CourseService().list();
  }
}
