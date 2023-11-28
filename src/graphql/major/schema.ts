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
  catalog_year!: string;

  @Field()
  default_planner_id!: number;
}

@InputType()
export class MajorInput {
  @Field()
  name!: string;

  @Field()
  catalog_year!: string;

  @Field()
  default_planner_id!: number;
}
