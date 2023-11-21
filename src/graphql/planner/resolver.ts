import { PlannerService } from "./service";
import {
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
  PlannerTitle,
} from "./schema";
import { Arg, Args, Query, Mutation, Resolver } from "type-graphql";

/**
 * PlannerResolver is a Resolver class that provides custom functionality for
 * planners
 */
@Resolver()
export class PlannerResolver {
  /**
   * Updates or creates a new planner
   * @param input input containing the planner data to create/update
   * @returns planner id of updated planner
   */
  @Mutation(() => PlannerId)
  async upsertPlanner(
    @Arg("input") input: PlannerCreateInput,
  ): Promise<PlannerId> {
    return await new PlannerService().upsertPlanner(input);
  }

  /**
   * Retrieves all planners for a particular user
   * @param userId UUID of the user id
   * @returns list of Planner titles and ID's
   */
  @Query(() => [PlannerTitle])
  async getAllPlanners(@Arg("userId") userId: string): Promise<PlannerTitle[]> {
    return await new PlannerService().allPlanners(userId);
  }

  /**
   * Retrieves a single planner
   * @param input object containing information on which planner to retrieve
   * @returns a PlannerData instance or null
   */
  @Query(() => PlannerData, { nullable: true })
  async getPlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerData | null> {
    return await new PlannerService().getPlanner(input);
  }

  /**
   * Deletes a single planner
   * @param input object containing information on which planner to delete
   * @returns id of deleted planner or null
   */
  @Mutation(() => PlannerId, { nullable: true })
  async deletePlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerId | null> {
    return await new PlannerService().deletePlanner(input);
  }
}
