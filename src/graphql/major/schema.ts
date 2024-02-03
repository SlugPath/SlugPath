import { Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class UserMajorOutput {
  @Field()
  @Length(1, 64)
  name!: string;

  @Field()
  catalogYear!: string;

  @Field()
  defaultPlannerId!: string;

  @Field()
  id!: number;
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

  // optional so
  @Field()
  defaultPlannerId!: string;
}

@InputType()
export class MajorDefaultsInput {
  @Field()
  @Length(1, 64)
  name!: string;

  @Field()
  catalogYear!: string;
}
