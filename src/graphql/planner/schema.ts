import { IsUUID, Length, Max, Min } from "class-validator";
import { Field, ObjectType, InputType, Int } from "type-graphql";

/**
 * An object type that stores a user's id
 */
@ObjectType()
export class UserId {
  @Field()
  userId!: string;
}

/**
 * An input type for creating or updating a planner
 */
@InputType()
export class PlannerCreateInput {
  @Field()
  userId!: string;

  @Field()
  @IsUUID("4")
  plannerId!: string;

  @Field()
  plannerData!: PlannerData;

  @Field()
  @Length(1, 32)
  title!: string;

  @Field()
  active!: boolean;
}

/**
 * An input type for retrieving or deleting a planner
 */
@InputType()
export class PlannerRetrieveInput {
  @Field()
  userId!: string;

  @Field()
  @IsUUID("4")
  plannerId!: string;
}

/**
 * An object type that stores data within a planner
 */
@ObjectType()
export class PlannerData {
  @Field()
  quarters!: { [key: string]: Quarter };

  @Field()
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
