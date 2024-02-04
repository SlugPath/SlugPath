import { courseInfo } from "@/app/actions/course";
import { StoredCourse } from "@/app/types/Course";
import prisma from "@/lib/prisma";
import { compareCoursesByNum } from "@/lib/utils";

beforeAll(async () => {
  await prisma.course.createMany({
    data: [
      {
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
      {
        department: "Computer Science and Engineering",
        departmentCode: "CSE",
        title: "Introduction to Data Structures and Algorithms",
        description:
          "Introduction to data structures and algorithms. Abstract data types including stacks, queues, priority queues, hash tables, binary trees, search trees, balanced trees and graphs. Sorting; asymptotic analysis; fundamental graph algorithms including graph search, shortest path, and minimum spanning trees; concurrency and synchronization. Credit is not given for both this course and CSE 100.",
        number: "101",
        credits: 5,
        prerequisites: "None",
        ge: ["None"],
        quartersOffered: ["Fall", "Winter"],
      },
      {
        departmentCode: "CSE",
        department: "Computer Science and Engineering",
        title: "Some random cs class",
        number: "123",
        prerequisites: "None",
        credits: 5,
      },
    ],
  });
});

afterAll(async () => {
  await prisma.course.deleteMany();
  await prisma.$disconnect();
});

it("should return the specified course", async () => {
  const course = await courseInfo({
    departmentCode: "CSE",
    number: "3",
  });

  expect(course).toBeDefined();
  const { id, labels, ...rest } = course as StoredCourse;
  expect(id).toBeDefined();
  expect(labels).toBeDefined();
  expect(rest).toEqual({
    department: "Computer Science and Engineering",
    departmentCode: "CSE",
    title: "Personal Computer Concepts: Software and Hardware",
    description: "Introduction to personal computer hardware and software.",
    number: "3",
    credits: 5,
    prerequisites: "None",
    ge: ["mf"],
    quartersOffered: ["Fall", "Winter", "Spring"],
  });
});

it("should return the first course that matches the query input", async () => {
  const course = await courseInfo({
    departmentCode: "CSE",
  });

  expect(course).toBeDefined();
  expect(course?.number).toMatch(/[3|102]/g);
});

it("should return null if no courses match the query input", async () => {
  const course = await courseInfo({
    departmentCode: "MATH",
  });

  expect(course).toBeUndefined();
});

it("should set description as an empty string if not defined", async () => {
  const course = await courseInfo({
    departmentCode: "CSE",
    number: "123",
  });

  expect(course).toBeDefined();
  const { id, labels, ...rest } = course as StoredCourse;
  expect(id).toBeDefined();
  expect(labels).toBeDefined();
  expect(rest).toEqual({
    departmentCode: "CSE",
    credits: 5,
    department: "Computer Science and Engineering",
    title: "Some random cs class",
    number: "123",
    prerequisites: "None",
    description: "",
    ge: [],
    quartersOffered: [],
  });
});
it("compare courses by department", () => {
  const a: StoredCourse = {
    id: "foo",
    departmentCode: "CSE",
    number: "101",
    title: "Introduction to Data Structures and Algorithms",
    description: "Introduction to data structures and algorithms.",
    prerequisites: "Some lower-division CSE classes",
    ge: [],
    credits: 5,
    quartersOffered: ["Fall", "Winter", "Spring"],
    labels: [],
  };
  const b: StoredCourse = {
    id: "bar",
    departmentCode: "ANTH",
    number: "1",
    title: "Introduction to Anthropology",
    description: "Introduction to anthropology.",
    prerequisites: "",
    ge: [],
    credits: 5,
    quartersOffered: ["Fall", "Winter", "Spring"],
    labels: [],
  };

  expect(compareCoursesByNum(a, b)).toEqual(1);
  expect(compareCoursesByNum(b, a)).toEqual(-1);
});

it("compare courses by course number and letter suffix", () => {
  const a: any = {
    id: "sd",
    departmentCode: "CSE",
    number: "101",
    title: "Introduction to Data Structures and Algorithms",
    description: "Introduction to data structures and algorithms.",
    prerequisites: "Some lower-division CSE classes",
    ge: [],
    credits: 5,
    quartersOffered: ["Fall", "Winter", "Spring"],
    labels: [],
  };
  const b: any = {
    departmentCode: "CSE",
    number: "101M",
    title: "Introduction to Proof-Writing",
    description: "Introduction to proof-writing.",
    prerequisites: "CSE 101",
    ge: [],
    credits: 5,
    quartersOffered: ["Fall", "Winter"],
    labels: [],
  };

  expect(compareCoursesByNum(a, b)).toEqual(-1);
  expect(compareCoursesByNum(b, a)).toEqual(1);
});

it("compare courses by number", () => {
  const a: any = {
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
  const b: any = {
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
  const a: any = {
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
  const b: any = {
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
  const a: any = {
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

  const b: any = {
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
  const a: any = {
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

  const b: any = {
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
