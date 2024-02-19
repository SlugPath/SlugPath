import prisma from "@/lib/prisma";
import { compareCoursesByNum } from "@/lib/utils";
import { courseInfo, coursesBy, getSuggestedClasses } from "@actions/course";
import { StoredCourse } from "@customTypes/Course";
import crypto from "crypto";

describe("Course actions", () => {
  const hash = crypto.randomBytes(16).toString("hex");

  beforeAll(async () => {
    await prisma.course.createMany({
      data: [
        {
          department: "Computer Science and Engineering",
          departmentCode: "CSE",
          title: "Personal Computer Concepts: Software and Hardware",
          description:
            "Introduction to personal computer hardware and software.",
          number: `3${hash}`,
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
          number: `101${hash}`,
          credits: 5,
          prerequisites: "None",
          ge: ["None"],
          quartersOffered: ["Fall", "Winter"],
        },
        {
          departmentCode: "CSE",
          department: "Computer Science and Engineering",
          title: "Some random cs class",
          number: `123${hash}`,
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

  describe("courseInfo", () => {
    it("should return the specified course", async () => {
      const course = await courseInfo({
        departmentCode: "CSE",
        number: `3${hash}`,
      });

      expect(course).toBeDefined();
      const { id, labels, ...rest } = course as StoredCourse;
      expect(id).toBeDefined();
      expect(labels).toBeDefined();
      expect(rest).toEqual({
        departmentCode: "CSE",
        title: "Personal Computer Concepts: Software and Hardware",
        description: "Introduction to personal computer hardware and software.",
        number: `3${hash}`,
        credits: 5,
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
      expect(
        await courseInfo({
          departmentCode: "MATH",
        }),
      ).toBeUndefined();
    });

    it("should set description as an empty string if not defined", async () => {
      const course = await courseInfo({
        departmentCode: "CSE",
        number: `123${hash}`,
      });

      expect(course).toBeDefined();
      const { id, labels, ...rest } = course as StoredCourse;
      expect(id).toBeDefined();
      expect(labels).toBeDefined();
      expect(rest).toEqual({
        departmentCode: "CSE",
        credits: 5,
        title: "Some random cs class",
        number: `123${hash}`,
        description: "",
        ge: [],
        quartersOffered: [],
      });
    });
  });

  describe("coursesBy", () => {
    it("should return the specified course with the correct department", async () => {
      expect(await coursesBy({ departmentCode: "CSE" })).toHaveLength(3);

      expect(await coursesBy({ departmentCode: "ANTH" })).toHaveLength(0);
    });

    it("should return the specified course with the correct number", async () => {
      expect(await coursesBy({ number: `3${hash}` })).toHaveLength(2);
      expect(await coursesBy({ number: `101${hash}` })).toHaveLength(1);
      expect(await coursesBy({ number: `123${hash}` })).toHaveLength(1);
    });

    it("should return the specified course with the correct ge", async () => {
      expect(await coursesBy({ ge: "mf" })).toHaveLength(1);
      expect(await coursesBy({ ge: "ta" })).toHaveLength(0);
    });
  });

  describe("getSuggestedClasses", () => {
    it("should return the specified courses", async () => {
      expect(
        await getSuggestedClasses(
          ["CSE 101", "CSE 3", "CSE 101", "CSE 123"].map(
            (title) => title + hash,
          ),
        ),
      ).toHaveLength(3);
    });

    it("should return an empty array if no courses are found", async () => {
      expect(
        await getSuggestedClasses(["ANTH 1", "ANTH 2", "ANTH 3"]),
      ).toHaveLength(0);
    });

    it("should work with different capitalizations", async () => {
      expect(
        await getSuggestedClasses(
          ["CSE 101", "cse 3", "cse 101", "cse 123"].map(
            (title) => title + hash,
          ),
        ),
      ).toHaveLength(3);
    });
  });

  describe("compareCoursesByNum", () => {
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
  });
});
