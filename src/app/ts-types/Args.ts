import { IsInt, IsUUID, Length, Matches, Max, Min } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class QueryInput {
  @Field({ nullable: true })
  @Matches(/[A-Z]{2,6}/g)
  department?: string;

  @Field({ nullable: true })
  @Matches(/[0-9]{1,3}[A-Z]{1}/g)
  number?: string;

  @Field({ nullable: true })
  @Length(5, 100)
  name?: string;

  @Field({ nullable: true })
  @IsUUID("4")
  id?: string;

  @Field({ nullable: true })
  @IsInt()
  @Min(1)
  @Max(10)
  credits?: number;
}

@InputType()
export class AboveOrBelowInput {
  @Field()
  @Matches(/[A-Z]{2,6}/g)
  department!: string;

  @Field()
  @IsInt()
  @Min(1)
  @Max(299)
  courseNum!: number;
}
