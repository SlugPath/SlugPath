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

  @Field(() => [String])
  @Length(0, 4)
  quartersOffered!: string[];

  @Field()
  @IsInt()
  @Max(10)
  @Min(1)
  credits!: number;
}

/**
 * An input type that stores data within a quarter
 */
@InputType()
export class QuarterInput {
  @Field()
  id!: string;

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
  @Field(() => [QuarterInput])
  quarters!: QuarterInput[];

  @Field(() => Int)
  @Min(1)
  @Max(7)
  years!: number;
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

  @Field(() => [String])
  @Length(0, 4)
  quartersOffered!: string[];

  @Field()
  @IsInt()
  @Max(10)
  @Min(1)
  credits!: number;
}

/**
 * An object type that stores data within a quarter
 */
@ObjectType()
export class Quarter {
  @Field()
  id!: string;

  @Field()
  @Length(1, 16)
  title!: string;

  @Field(() => [StoredCourse])
  courses!: StoredCourse[];
}

@ObjectType()
export class PlannerTitle {
  @Field()
  title!: string;

  @Field()
  @IsUUID("4")
  id!: string;
}

/**
 * An object type that stores data within a planner
 */
@ObjectType()
export class PlannerData {
  @Field(() => [Quarter])
  quarters!: Quarter[];

  @Field(() => Int)
  @Min(1)
  @Max(7)
  years!: number;
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
@InputType()
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
