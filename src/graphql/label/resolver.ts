/* eslint-disable @typescript-eslint/no-unused-vars */
import { LabelService } from "./service";
import { Label } from "./schema";
import { Arg, Query, Resolver } from "type-graphql";

/**
 * LabelResolver is a Resolver class that provides custom functionality for
 * labels
 */
@Resolver()
export class LabelResolver {
  @Query(() => [Label])
  async getLabels(@Arg("userId") userId: string): Promise<Label[]> {
    return await new LabelService().getLabels(userId);
  }
}
