import { PlannerService } from "./service";
import {
  UserId,
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
} from "./schema";
import { Args, Query, Resolver } from "type-graphql";

/**
 * PlannerResolver is a Resolver class that provides custom functionality for
 * planners
 */
@Resolver()
export class PlannerResolver {
  @Query(() => PlannerCreateInput)
  async upsert(@Args() input: PlannerCreateInput): Promise<PlannerId> {
    return await new PlannerService().upsert(input);
  }

  @Query(() => [PlannerData])
  async getAllPlanners(@Args() input: UserId): Promise<PlannerData[]> {
    return await new PlannerService().allPlanners(input);
  }

  @Query(() => PlannerData)
  async getPlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerData | null> {
    return await new PlannerService().getPlanner(input);
  }

  @Query(() => PlannerRetrieveInput)
  async deletePlanner(
    @Args() input: PlannerRetrieveInput,
  ): Promise<PlannerId | null> {
    return await new PlannerService().deletePlanner(input);
  }
}
