import { IsUUID, Length, Matches, Max, Min } from "class-validator";
import { ArgsType, Field, ObjectType, Int } from "type-graphql";

/**
 * `Course` is an `ObjectType` class used as a data transfer object.
 * It has validation functions on its fields to ensure the integrity
 * of data sent to the UI from GraphQL.
 */
@ObjectType()
export class Course {
  @Field()
  @Length(3, 50)
  department!: string;

  @Field()
  @Matches(/[A-Z]{2,6}/g)
  departmentCode!: string;

  @Field()
  description!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number!: string;

  @Field()
  @Length(5, 100)
  title!: string;

  @Field(() => Int)
  @Min(1)
  @Max(10)
  credits!: number;

  @Field()
  @Length(4, 2000)
  prerequisites!: string;

  @Field(() => [String])
  ge!: string[];

  @Field(() => [String])
  @Length(0, 4)
  quartersOffered!: string[];
}

/**
 * `Department` is an `ObjectType` class used within GraphQL to represent
 * a department entity. Each `Department` object will have a `name` field that
 * reflects the name of a department within UCSC.
 */
@ObjectType()
export class Department {
  @Field()
  @Length(3, 50)
  name!: string;

  @Field()
  @Matches(/[A-Z]{2,6}/g)
  code!: string;
}

/**
 * For querying courses based on course attributes
 */
@ArgsType()
export class QueryInput {
  @Field({ nullable: true })
  @Length(3, 50)
  department?: string;

  @Field({ nullable: true })
  @Matches(/[A-Z]{0,6}/g)
  departmentCode?: string;

  @Field({ nullable: true })
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number?: string;

  @Field({ nullable: true })
  @Length(5, 100)
  title?: string;

  @Field({ nullable: true })
  @IsUUID("4")
  id?: string;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(10)
  credits?: number;

  @Field({ nullable: true })
  ge?: string;
}

@ArgsType()
export class SingleQueryInput {
  @Field({ nullable: true })
  @Matches(/[A-Z]{0,6}/g)
  departmentCode?: string;

  @Field({ nullable: true })
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number?: string;
}
