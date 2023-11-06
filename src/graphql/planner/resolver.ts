import { PlannerService } from "./service";
import {
  UserId,
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
} from "./schema";
import { Args, Query, Mutation, Resolver } from "type-graphql";

/**
 * PlannerResolver is a Resolver class that provides custom functionality for
 * planners
 */
@Resolver()
export class PlannerResolver {
  @Mutation(() => PlannerId)
  async upsert(@Args() input: PlannerCreateInput): Promise<PlannerId> {
    return await new PlannerService().upsert(input);
  }

  @Query(() => [PlannerData])
  async getAllPlanners(@Args() input: UserId): Promise<PlannerData[]> {
    return await new PlannerService().allPlanners(input);
  }

  @Query(() => PlannerData, { nullable: true })
  async getPlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerData | null> {
    return await new PlannerService().getPlanner(input);
  }

  @Mutation(() => PlannerId, { nullable: true })
  async deletePlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerId | null> {
    return await new PlannerService().deletePlanner(input);
  }
}
