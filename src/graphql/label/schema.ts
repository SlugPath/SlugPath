import { Field, InputType, ObjectType } from "type-graphql";

/**
 * `Label` is an `ObjectType` class used as a data transfer object.
 * It has validation functions on its fields to ensure the integrity
 * of data sent to the UI from GraphQL.
 */

@ObjectType()
export class Label {
  @Field()
  name!: string;

  @Field()
  color!: string;

  @Field()
  id!: string;
}

@InputType()
export class LabelInput {
  @Field()
  name!: string;

  @Field()
  color!: string;

  @Field()
  id!: string;
}
