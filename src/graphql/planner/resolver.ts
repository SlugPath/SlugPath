import { PlannerService } from "./service";
import {
  PlannerId,
  PlannerData,
  PlannerRetrieveInput,
  PlannerCreateInput,
} from "./schema";
import { Arg, Args, Query, Mutation, Resolver } from "type-graphql";

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
  async getAllPlanners(@Arg("userId") userId: string): Promise<PlannerData[]> {
    return await new PlannerService().allPlanners(userId);
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
