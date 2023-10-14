import { IsUUID, Length, Matches } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class QueryableCourseInput {
  @Field({nullable: true})
  @IsUUID('4')
  id?: string

  @Field({nullable: true})
  @Matches(/[A-Z]{2,6}/g)
  department?: string

  @Field({nullable: true})
  @Matches(/[0-9]{1,3}[A-Z]*/g)
  number?: string;

  @Field({nullable: true})
  @Length(5, 100)
  name?: string;

  @Field({nullable: true})
  credits?: number;
}

@InputType()
export class MutableCourseInput {
  @Field({nullable: true})
  @IsUUID('4')
  id?: string

  @Field({defaultValue: "CSE"})
  @Matches(/[A-Z]{2, 6}/g)
  department!: string;

  @Field()
  @Matches(/[0-9]{1,3}[A-Z]*/g)
  number!: string;

  @Field()
  @Length(5, 100)
  name!: string;

  @Field({defaultValue: 5})
  credits!: number;

}