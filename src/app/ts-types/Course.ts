import { IsUUID, Matches, Length, Min, Max } from "class-validator";
import { ObjectType, Field, Int } from "type-graphql";

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

  @Field()
  @IsUUID("4")
  id!: string;

  @Field(() => Int)
  @Min(1)
  @Max(10)
  credits!: number;
}

/**
 * `DummyCourse` is a type to represent dummy courses for now.
 * 'number' is stored as a string, as some numbers are 12L, 115A etc.
 */
export interface DummyCourse {
  id: string;
  name: string;
  credits: number;
  department: string;
  number: string;
}

/**
 * `StoredCourse` is a type to represent courses selected by the user and stored in the database
 * or locally in cookies. The only difference between this and `DummyCourse` is that it has a uuid.
 * `uuid` is the unique id for the stored course, so drag and drop can work with duplicate courses
 * which must have unique ids for each draggable course.
 */
export interface StoredCourse extends DummyCourse {
  uuid: string;
}
