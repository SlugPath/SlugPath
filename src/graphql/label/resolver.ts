/* eslint-disable @typescript-eslint/no-unused-vars */
import { LabelService } from "./service";
import {
  Label,
  // LabelInput,
} from "./schema";
import { Arg, Args, Query, Mutation, Resolver } from "type-graphql";
import { use } from "react";

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
  // async getLabels(@Arg("input") input: LabelInput): Promise<Label[]> {
  //   return await new LabelService().getLabels(input);
  // }
}
