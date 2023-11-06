import { IsInt, IsUUID, Length, Max, Min } from "class-validator";
import { Field, ObjectType, ArgsType, InputType, Int } from "type-graphql";

/**
 * An input type that stores data within a course
 */
@InputType()
export class StoredCourseInput {
  @Field()
  @Length(1, 32)
  department!: string;

  @Field()
  @Length(1, 3)
  number!: string;
}

/**
 * An input type that stores data within a quarter
 */
@InputType()
export class QuarterInput {
  @Field()
  @Length(1, 16)
  title!: string;

  @Field(() => [StoredCourseInput])
  courses!: StoredCourseInput[];
}

/**
 * An input type that stores data within a planner
 */
@InputType()
export class PlannerDataInput {
  @Field(() => QuarterInput, { name: "quarters" })
  quarters!: { [key: string]: QuarterInput };

  @Field(() => [String])
  quartersOrder!: string[];

  @Field(() => Int)
  @Min(1)
  @Max(7)
  years!: number;

  @Field(() => Int)
  @Min(1)
  @Max(4)
  quartersPerYear!: number;
}

/**
 * An object type that stores data within a course
 */
@ObjectType()
export class StoredCourse {
  @Field()
  @Length(1, 32)
  department!: string;

  @Field()
  @Length(1, 3)
  number!: string;
}

/**
 * An object type that stores data within a quarter
 */
@ObjectType()
export class Quarter {
  @Field()
  @Length(1, 16)
  title!: string;

  @Field(() => [StoredCourse])
  courses!: StoredCourse[];
}

/**
 * An object type that stores data within a planner
 */
@ObjectType()
export class PlannerData {
  @Field(() => Quarter, { name: "quarters" })
  quarters!: { [key: string]: Quarter };

  @Field(() => [String])
  quartersOrder!: string[];

  @Field(() => Int)
  @Min(1)
  @Max(7)
  years!: number;

  @Field(() => Int)
  @Min(1)
  @Max(4)
  quartersPerYear!: number;
}

/**
 * An object type that stores a planner's id
 */
@ObjectType()
export class PlannerId {
  @Field()
  @IsUUID("4")
  plannerId!: string;
}

/**
 * An argument/input type for creating or updating a planner
 */
@ArgsType()
export class PlannerCreateInput {
  @Field()
  userId!: string;

  @Field()
  @IsUUID("4")
  plannerId!: string;

  @Field(() => PlannerDataInput, { name: "plannerData" })
  plannerData!: PlannerDataInput;

  @Field()
  @Length(1, 32)
  title!: string;

  @Field()
  @IsInt()
  @Min(0)
  order!: number;
}

/**
 * An argument/input type for retrieving or deleting a planner
 */
@ArgsType()
export class PlannerRetrieveInput {
  @Field()
  userId!: string;

  @Field()
  @IsUUID("4")
  plannerId!: string;
}
