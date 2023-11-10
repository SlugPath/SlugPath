import { graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { describe, expect } from "@jest/globals";
import { CourseResolver } from "@/graphql/course/resolver";
import prisma from "@/lib/prisma";

jest.setTimeout(10000);

const schema = buildSchemaSync({
  resolvers: [CourseResolver],
  validate: true,
});

const query = `
query {
  coursesBy(department: "CSE", number: "3") {
    credits
    department
    name
    number
  }
}`;

beforeAll(async () => {
  await prisma.course.create({
    data: {
      department: "CSE",
      number: "3",
      credits: 5,
      name: "Personal Computer Concepts: Software and Hardware",
    },
  });
});

afterAll(() => {
  prisma.course.deleteMany();
  prisma.$disconnect();
});

describe("test coursesBy", () => {
  it("should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query,
    });
    expect(data).toBeDefined();
    const course = data?.coursesBy[0];

    expect(course).toBeDefined();
    expect(course.name).toBeDefined();
    expect(course.name).toEqual(
      "Personal Computer Concepts: Software and Hardware",
    );
    expect(course.department).toBeDefined();
    expect(course.department).toEqual("CSE");
    expect(course.number).toBeDefined();
    expect(course.number).toEqual("3");
    expect(course.credits).toBeDefined();
  });
});
