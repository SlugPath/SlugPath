import { Field, ObjectType } from "type-graphql";
// import { Matches, Length } from "class-validator";

@ObjectType()
export class Course {
  @Field()
  id!: string;
  @Field()
  name!: string;
  @Field()
  department!: string;
  @Field()
  number!: string;
  @Field()
  credits!: number;
}
