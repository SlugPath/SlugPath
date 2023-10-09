import { Field, ObjectType, ArgsType } from "type-graphql";
import { Matches, Length } from "class-validator";

@ObjectType()
export class Member {
  @Field()
  @Matches(
    /[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}/,
  )
  id!: string;
  @Field()
  @Length(1, 32)
  name!: string;
  @Field()
  @Length(1, 32)
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email!: string;
}

@ArgsType()
export class MemberEmail {
  @Field()
  @Length(1, 32)
  @Matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email!: string;
}
