import { CourseService } from "@/graphql/course/service";
import prisma from "@/lib/prisma";

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

describe("test courseBy", () => {
  it("should return the specified course", async () => {
    const service = new CourseService();

    const course = await service.courseBy({
      departmentCode: "CSE",
      number: "3",
    });

    expect(course).toBeDefined();
    expect(course).toEqual({
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
    const service = new CourseService();

    const course = await service.courseBy({
      departmentCode: "CSE",
    });

    expect(course).toBeDefined();
    expect(course?.number).toMatch(/[3|102]/g);
  });

  it("should return null if no courses match the query input", async () => {
    const service = new CourseService();

    const course = await service.courseBy({
      departmentCode: "MATH",
    });

    expect(course).toBeNull();
  });

  it("should set description as an empty string if not defined", async () => {
    const course = await new CourseService().courseBy({
      departmentCode: "CSE",
      number: "123",
    });

    expect(course).toBeDefined();
    expect(course).toEqual({
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
});
