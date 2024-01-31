import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { PlannerTitle } from "../planner/schema";
import { MajorDefaultsInput, MajorInput, UserMajorOutput } from "./schema";
import { MajorService } from "./service";

/**
 * CourseResolver is a Resolver class that provides custom functionality for
 * courses, which cannot be generated by Prisma
 */
@Resolver()
export class MajorResolver {
  @Query(() => [String])
  async getAllMajors(@Arg("catalogYear") catalogYear: string) {
    return new MajorService().getAllMajors(catalogYear);
  }
  /**
   * @returns a unique `Major` associated with a userId
   */
  @Query(() => UserMajorOutput, { nullable: true })
  async getUserMajor(
    @Arg("userId") userId: string,
  ): Promise<UserMajorOutput | null> {
    return await new MajorService().getUserMajor(userId);
  }

  /**
   * Returns the ids and titles of all the planners associated with a major
   * in a catalog year
   * @param input catalog year and major name
   * @returns a PlannerTitle list
   */
  @Query(() => [PlannerTitle])
  async getMajorDefaults(
    @Arg("input") input: MajorDefaultsInput,
  ): Promise<PlannerTitle[]> {
    return await new MajorService().getMajorDefaultPlanners(input);
  }

  /**
   * Updates a user's major and defaultPlannerId fields
   * @param input is a type containing a students' major information
   * @returns the users major information after updating
   */
  @Mutation(() => UserMajorOutput)
  async updateUserMajor(
    @Arg("input") input: MajorInput,
  ): Promise<UserMajorOutput> {
    return await new MajorService().updateUserMajor(input);
  }
}
