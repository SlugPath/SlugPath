import { IsUUID, Length } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class UserMajorOutput {
  @Field()
  name!: string;

  @Field()
  catalogYear!: string;

  @Field()
  defaultPlannerId!: string;
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
  @IsUUID("4")
  defaultPlannerId!: string;
}

@ObjectType()
export class MajorUpdatedOutput {
  @Field()
  @Length(1)
  userId!: string;
}

@InputType()
export class MajorDefaultsInput {
  @Field()
  @Length(1, 64)
  name!: string;

  @Field()
  catalogYear!: string;
}
