import { graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { describe, expect } from "@jest/globals";
import { CourseResolver } from "@/graphql/course/resolver";
import prisma from "@/lib/prisma";

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

const query2 = `
query {
  coursesBy(departmentCode: "CSE") {
    department
    departmentCode
    title
    number
    credits
    ge
    quartersOffered
  }
}`;
const query3 = `
query {
  coursesBy(departmentCode: "CSE", number: "3", ge: "MF") {
    department
    departmentCode
    title
    number
    credits
    ge
    quartersOffered
  }
}`;

const query4 = `
query {
  coursesBy(departmentCode: "", number: "3") {
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
      title: "Introduction to C Systems & Programming",
      description: "Students will learn how to program in C and Linux",
      number: "13S",
      credits: 5,
      prerequisites: "CSE 30 & CSE 12/12L",
      ge: [],
      quartersOffered: ["Fall", "Winter", "Spring"],
    },
  });
});

afterAll(async () => {
  await prisma.course.deleteMany();
  await prisma.$disconnect();
});

describe("test coursesBy", () => {
  it("dept + number, should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query,
    });
    expect(data).toBeDefined();
    const course = data?.coursesBy[0];

    expect(course).toBeDefined();
    expect(course).toEqual({
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      title: "Introduction to C Systems & Programming",
      number: "13S",
      credits: 5,
      ge: [],
      quartersOffered: ["Fall", "Winter", "Spring"],
    });
  });

  it("dept should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query2,
    });
    expect(data).toBeDefined();
    const course = data?.coursesBy[0];

    expect(course).toBeDefined();
    expect(course.title).toBeDefined();
    expect(course).toEqual({
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      title: "Introduction to C Systems & Programming",
      number: "13S",
      credits: 5,
      ge: [],
      quartersOffered: ["Fall", "Winter", "Spring"],
    });
  });

  it("ge + dept + number should return 0 result", async () => {
    const { data } = await graphql({
      schema,
      source: query3,
    });
    expect(data).toBeDefined();
    expect(data?.coursesBy).toHaveLength(0);
  });

  it("number should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query4,
    });
    expect(data).toBeDefined();
    const course = data?.coursesBy[0];

    expect(course).toBeDefined();
    expect(course).toEqual({
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      title: "Introduction to C Systems & Programming",
      number: "13S",
      credits: 5,
      ge: [],
      quartersOffered: ["Fall", "Winter", "Spring"],
    });
  });
});
