import { graphql } from "graphql";
import { buildSchemaSync } from "type-graphql";
import { describe, expect } from "@jest/globals";
import { CourseResolver } from "@/graphql/course/resolver";
import prisma from "@/lib/prisma";
import { Course } from "@/graphql/course/schema";
import { compareCoursesByNum } from "@/graphql/course/service";

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
      title: "Personal Computer Concepts: Software and Hardware",
      description: "Introduction to personal computer hardware and software.",
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
  it("dept + number, should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query,
    });
    expect(data).toBeDefined();
    console.log(`DATA: ${JSON.stringify(data, null, 2)}`);
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

  it("dept should return 1 result", async () => {
    const { data } = await graphql({
      schema,
      source: query2,
    });
    expect(data).toBeDefined();
    console.log(`DATA: ${JSON.stringify(data, null, 2)}`);
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
    console.log(`DATA: ${JSON.stringify(data, null, 2)}`);
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

describe("test compareCoursesByNum", () => {
  it("compare courses by department", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101",
      title: "Introduction to Data Structures and Algorithms",
      description: "Introduction to data structures and algorithms.",
      prerequisites: "Some lower-division CSE classes",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter", "Spring"],
    };
    const b: Course = {
      department: "Anthropology",
      departmentCode: "ANTH",
      number: "1",
      title: "Introduction to Anthropology",
      description: "Introduction to anthropology.",
      prerequisites: "",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter", "Spring"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(1);
    expect(compareCoursesByNum(b, a)).toEqual(-1);
  });

  it("compare courses by course number and letter suffix", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101",
      title: "Introduction to Data Structures and Algorithms",
      description: "Introduction to data structures and algorithms.",
      prerequisites: "Some lower-division CSE classes",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter", "Spring"],
    };
    const b: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101M",
      title: "Introduction to Proof-Writing",
      description: "Introduction to proof-writing.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(-1);
    expect(compareCoursesByNum(b, a)).toEqual(1);
  });

  it("compare courses by number", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101",
      title: "Introduction to Data Structures and Algorithms",
      description: "Introduction to data structures and algorithms.",
      prerequisites: "Some lower-division CSE classes",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter", "Spring"],
    };
    const b: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "102",
      title: "Introduction to Algorithms Analysis",
      description: "Introduction to algorithms analysis.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(-1);
    expect(compareCoursesByNum(b, a)).toEqual(1);
  });

  it("compare courses by letter suffix", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101A",
      title: "Introduction to Data Structures and Algorithms",
      description: "Introduction to data structures and algorithms.",
      prerequisites: "Some lower-division CSE classes",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter", "Spring"],
    };
    const b: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101M",
      title: "Introduction to Proof-Writing",
      description: "Introduction to proof-writing.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(-1);
    expect(compareCoursesByNum(b, a)).toEqual(1);
  });

  it("compare two courses with same number and letter suffix", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101M",
      title: "Introduction to Proof-Writing",
      prerequisites: "CSE 101",
      description: "Introduction to proof-writing.",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    const b: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101M",
      title: "Introduction to Proof-Writing",
      description: "Introduction to proof-writing.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(0);
    expect(compareCoursesByNum(b, a)).toEqual(0);
  });

  it("compare two courses with same numbers", () => {
    const a: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101",
      title: "Introduction to Proof-Writing",
      description: "Introduction to proof-writing.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    const b: Course = {
      department: "Computer Science and Engineering",
      departmentCode: "CSE",
      number: "101",
      title: "Introduction to Proof-Writing",
      description: "Introduction to proof-writing.",
      prerequisites: "CSE 101",
      ge: [],
      credits: 5,
      quartersOffered: ["Fall", "Winter"],
    };

    expect(compareCoursesByNum(a, b)).toEqual(0);
    expect(compareCoursesByNum(b, a)).toEqual(0);
  });
});
