import { graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { describe, expect } from "@jest/globals";
import { CourseResolver } from "@/graphql/course/resolver";

jest.setTimeout(10000);

const schema = buildSchemaSync({
  resolvers: [CourseResolver],
  validate: true,
});

const query = `
query {
  coursesInOrder(department: "CSE", numCourses: 10) {
    credits
    department
    id
    name
    number
  }
}`;

describe("Test Courses InOrder", () => {
  it("Should return CSE 3 first", async () => {
    const { data } = await graphql({
      schema,
      source: query,
    });
    expect(data).toBeDefined();
    const courses = data?.coursesInOrder;

    expect(courses).toBeDefined();
    expect(courses.length).toEqual(10);
    expect(courses[0].id).toBeDefined();
    expect(courses[0].name).toBeDefined();
    expect(courses[0].name).toEqual(
      "Personal Computer Concepts: Software and Hardware",
    );
    expect(courses[0].department).toBeDefined();
    expect(courses[0].department).toEqual("CSE");
    expect(courses[0].number).toBeDefined();
    expect(courses[0].number).toEqual("3");
    expect(courses[0].credits).toBeDefined();
  });
});
