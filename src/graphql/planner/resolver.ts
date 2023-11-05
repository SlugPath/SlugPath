import { PlannerService } from "./service";
import {
  UserId,
  PlannerData,
  PlannerRetrieveInput,
  // PlannerCreateInput,
} from "./schema";
import { Args, Query, Resolver } from "type-graphql";

/**
 * PlannerResolver is a Resolver class that provides custom functionality for
 * planners
 */
@Resolver()
export class PlannerResolver {
  // FIXME: return something to signify if creation/update worked
  // @Query()
  // async upsert(@Args() input: PlannerCreateInput) {
  //   return await new PlannerService().upsert(input);
  // }

  @Query(() => [PlannerData])
  async getAllPlanners(@Args() input: UserId): Promise<PlannerData[]> {
    return await new PlannerService().allPlanners(input);
  }

  @Query(() => PlannerData)
  async getPlanner(@Args() input: PlannerRetrieveInput): Promise<PlannerData> {
    return await new PlannerService().getPlanner(input);
  }

  // FIXME: return something to signify if deletion worked
  // @Query()
  // async deletePlanner(@Args() input: PlannerRetrieveInput) {
  //   return await new PlannerService().deletePlanner(input);
  // }

  // FIXME: cannot pass argument of type any
  // @Query(() => PlannerData)
  // async convertPlannerData(@Args() input: any): Promise<PlannerData> {
  //   return await new PlannerService().toPlannerData(input);
  // }
}
