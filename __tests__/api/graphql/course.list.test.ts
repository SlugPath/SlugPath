import { graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { describe, expect } from "@jest/globals";
import { MemberResolver } from "@/graphql/course/resolver";

jest.setTimeout(10000);

const schema = buildSchemaSync({
  resolvers: [MemberResolver],
  validate: true,
});

const query = `
  query AllCourses {
        courses {
          id
          name
          department
          number
          credits
        }
      }`;

describe("Test All Courses", () => {
  it("Should return a course", async () => {
    const { data } = await graphql({
      schema,
      source: query,
      //contextValue: createMockContext(),
    });
    expect(data).toBeDefined();
    const courses = data?.courses;

    expect(courses).toBeDefined();
    expect(courses.length).toEqual(197);
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
