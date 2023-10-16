import { IsUUID, Matches, Length, IsInt, Min, Max } from "class-validator";
import { ObjectType, Field } from "type-graphql";

/**
 * `Course` is an `ObjectType` class used as a data transfer object.
 * It has validation functions on its fields to ensure the integrity
 * of data sent to the UI from GraphQL.
 */
@ObjectType()
export default class Course {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number!: string;

  @Field()
  @Length(5, 100)
  name!: string;

  @Field({ nullable: true })
  @IsUUID("4")
  id?: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(10)
  credits!: number;
}
