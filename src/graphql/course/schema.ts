import { IsUUID, Length, Matches, Max, Min } from "class-validator";
import { ArgsType, Field, ObjectType, InputType, Int } from "type-graphql";

/**
 * `Course` is an `ObjectType` class used as a data transfer object.
 * It has validation functions on its fields to ensure the integrity
 * of data sent to the UI from GraphQL.
 */
@ObjectType()
export class Course {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number!: string;

  @Field()
  @Length(5, 100)
  name!: string;

  @Field(() => Int)
  @Min(1)
  @Max(10)
  credits!: number;
}

/**
 * For querying courses based on course attributes
 */
@ArgsType()
export class QueryInput {
  @Field({ nullable: true })
  @Matches(/[A-Z]{2,6}/g)
  department?: string;

  @Field({ nullable: true })
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number?: string;

  @Field({ nullable: true })
  @Length(5, 100)
  name?: string;

  @Field({ nullable: true })
  @IsUUID("4")
  id?: string;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @Max(10)
  credits?: number;
}

/**
 * For the `createCourse` and `updateCourse` resolver functions.
 */
@InputType()
export class UpsertInput {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number!: string;

  @Field()
  @Length(5, 100)
  name!: string;

  @Field(() => Int)
  @Min(1)
  @Max(10)
  credits!: number;
}

/**
 * Used for deleting courses from the database
 */
@InputType()
export class DeleteInput {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]?/g)
  number!: string;
}

/**
 * Used for querying a number of courses in order of course number
 */
@ArgsType()
export class OrderedInput {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field(() => Int)
  @Min(1)
  @Max(390)
  numCourses!: number;
}

/**
 * Used for querying courses above or below a particular course number
 */
@ArgsType()
export class AboveOrBelowInput {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field(() => Int)
  @Min(1)
  @Max(299)
  courseNum!: number;
}
