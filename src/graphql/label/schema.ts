// import { Length, Matches, Max, Min } from "class-validator";
import { Field, ObjectType } from "type-graphql";

/**
 * `Label` is an `ObjectType` class used as a data transfer object.
 * It has validation functions on its fields to ensure the integrity
 * of data sent to the UI from GraphQL.
 */
@ObjectType()
export class Label {
  @Field()
  // @Length(1, 50)
  name!: string;

  @Field()
  color!: string;

  @Field()
  id!: string;
}

/**
 * For querying labels by userId
 */
// @InputType()
// export class LabelInput {
//   @Field()
//   userId!: string;
// }
