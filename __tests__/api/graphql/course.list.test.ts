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
  coursesBy(departmentCode: "CSE", number: "3") {
    department
    departmentCode
    title
    number
    credits
    ge
    quartersOffered
  }
}`;

beforeAll(async () => {
  await prisma.course.create({
    data: {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      title: "Personal Computer Concepts: Software and Hardware",
      number: "3",
      credits: 5,
      prerequisites: "None",
      ge: ["mf"],
      quartersOffered: ["Fall", "Winter", "Spring"],
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
    expect(course.title).toBeDefined();
    expect(course.title).toEqual(
      "Personal Computer Concepts: Software and Hardware",
    );
    expect(course.department).toBeDefined();
    expect(course.department).toEqual("Computer Science and Engineering");
    expect(course.departmentCode).toBeDefined();
    expect(course.departmentCode).toEqual("CSE");
    expect(course.number).toBeDefined();
    expect(course.number).toEqual("3");
    expect(course.credits).toBeDefined();
    expect(course.credits).toEqual(5);
    expect(course.ge).toBeDefined();
    expect(course.ge).toEqual(["mf"]);
    expect(course.quartersOffered).toBeDefined();
    expect(course.quartersOffered).toEqual(["Fall", "Winter", "Spring"]);
  });
});
