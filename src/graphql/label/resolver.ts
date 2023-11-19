/* eslint-disable @typescript-eslint/no-unused-vars */
import { LabelService } from "./service";
import { Label, LabelInput } from "./schema";
import { Arg, Query, Resolver } from "type-graphql";

/**
 * LabelResolver is a Resolver class that provides custom functionality for
 * labels
 */
@Resolver()
export class LabelResolver {
  @Query(() => [Label])
  async getLabels(@Arg("input") input: LabelInput): Promise<Label[]> {
    return await new LabelService().getLabels(input.userId);
  }
}
