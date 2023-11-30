import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

/**
 * `Major` is an `ObjectType` class used as a data transfer object
 * for major information.
 */

@ObjectType()
export class Major {
  @Field()
  name!: string;

  @Field()
  catalogYear!: string;

  @Field(() => [String])
  defaultPlanners!: string[];
}

@InputType()
export class MajorInput {
  @Field()
  @Length(1, 64)
  name!: string;

  @Field()
  catalogYear!: string;

  @Field()
  userId!: string;

  @Field()
  defaultPlannerId!: string;
}
