import { StoredCourse } from "@/app/types/Course";
import { Label } from "@/app/types/Label";
import { PlannerData } from "@/app/types/Planner";
import { Quarter } from "@customTypes/Quarter";
import { Term } from "@customTypes/Quarter";
import { LabelColor } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { initialLabels } from "./labels";

const quarterNames = ["Fall", "Winter", "Spring", "Summer"];
export const years = 4;
export const quartersPerYear = 4;
export const EMPTY_PLANNER = "emptyPlanner";

export const initialPlanner = (): PlannerData => {
  return {
    quarters: createQuarters(),
    years,
    courses: [],
    labels: initialLabels(),
    notes: "",
    title: "New Planner",
    id: uuidv4(),
  };
};

export const emptyPlanner = (): PlannerData => {
  return {
    quarters: [],
    years,
    courses: [],
    labels: [],
    notes: "",
    id: uuidv4(),
    title: "",
  };
};

export function createQuarters() {
  const quarters: Quarter[] = [];
  for (let year = 0; year < years; year++) {
    for (let quarter = 0; quarter < quartersPerYear; quarter++) {
      const id = `quarter-${year}-${quarterNames[quarter]}`;
      quarters.push({
        id,
        title: `${quarterNames[quarter]}`,
        courses: [],
      });
    }
  }

  return quarters;
}

export const customCourse = (): StoredCourse => {
  return {
    id: uuidv4(),
    credits: 5,
    departmentCode: "",
    number: "",
    title: "Custom Course",
    ge: [],
    quartersOffered: ["Fall", "Winter", "Spring"],
    description: "",
    labels: [],
  };
};

export function getDeptAndNumber({
  departmentCode,
  number,
  title,
}: StoredCourse): string {
  if (departmentCode !== "" && number !== "") {
    return `${departmentCode} ${number}`;
  }
  return `${title}`;
}

export function createCourseDraggableId(
  course: StoredCourse & { suffix: string },
) {
  return JSON.stringify(course);
}

/**
 * Returns the real equivalent of a course if it exists.
 * Otherwise it returns a custom course with the custom title.
 * For use with seeding default planners
 * @param title title of the course
 */
export async function getRealEquivalent(
  prisma: any,
  title: string,
): Promise<StoredCourse> {
  const regex = /^[A-Z]{1,5} [0-9]{1,3}[A-Z]?$/;

  if (!regex.test(title)) {
    return {
      ...customCourse(),
      title,
    };
  }

  const [dept, num] = title.split(" ");
  const equivalent = await prisma.course.findFirst({
    where: {
      departmentCode: dept,
      number: num,
    },
  });

  // Should not happen
  if (equivalent === null) {
    return {
      ...customCourse(),
      title,
    };
  }

  return {
    ...customCourse(),
    title: equivalent.title,
    departmentCode: equivalent.departmentCode,
    number: equivalent.number,
    credits: equivalent.credits,
    ge: equivalent.ge,
    quartersOffered: equivalent.quartersOffered,
  };
}

/**
 * Finds a quarter with a given id in an array of `Quarter`
 * @param quarters array of quarters in a `CourseState` instance
 * @param id quarter id
 * @returns quarter and index where it was located
 */
export function findQuarter(
  quarters: Quarter[],
  id: string,
): { quarter: Quarter; idx: number } {
  const quarter = quarters.find((q) => q.id == id);
  const idx = quarters.findIndex((q) => q.id == id);
  if (quarter === undefined) throw new Error(`invalid quarter id: ${id}`);
  return { quarter, idx };
}

export function findCourseById(
  courseState: PlannerData,
  id: string,
): StoredCourse {
  const course = courseState.courses.find((c) => c.id === id);
  if (course === undefined) throw new Error("course not found");
  return course;
}

export function findCoursesInQuarter(
  courseState: PlannerData,
  qid: string,
): StoredCourse[] {
  const { quarter } = findQuarter(courseState.quarters, qid);
  return quarter.courses.map((cid) => findCourseById(courseState, cid));
}

export function isCustomCourse(c: StoredCourse): boolean {
  const { departmentCode, number } = c;
  return departmentCode === "" || number === "";
}

export function getTitle({ title, departmentCode, number }: StoredCourse) {
  return title !== undefined && title.length > 0
    ? title
    : `${departmentCode} ${number}`;
}

export function createCourseFromId(id: string): Omit<StoredCourse, "id"> {
  try {
    const course = JSON.parse(id);
    return {
      title: course.title,
      departmentCode: course.departmentCode,
      number: course.number,
      quartersOffered: course.quartersOffered,
      credits: course.credits,
      description: course.description ?? "",
      ge: course.ge,
      labels: [],
    };
  } catch (e) {
    throw new Error(`Invalid course id ${id}`);
  }
}

/**
 * @param courses is a list of courses
 * @returns courses with duplicates removed
 */
export function getUniqueCourses(courses: StoredCourse[]): StoredCourse[] {
  const uniqueCourses = new Map();

  for (const { departmentCode, number, title, credits } of courses) {
    const key = `${departmentCode}|${number}|${title}|${credits}`;
    if (!uniqueCourses.has(key)) {
      uniqueCourses.set(key, { credits });
    }
  }
  return Array.from(uniqueCourses.values());
}

/**
 * Computes the total credits for courses
 * @param courses is a list of courses
 * @returns total number of credits not including repeated courses
 */
export function getTotalCredits(courses: StoredCourse[]): number {
  const uniqueCourses = getUniqueCourses(courses);
  return uniqueCourses.reduce((accumulatedCredits, course) => {
    return accumulatedCredits + course.credits;
  }, 0);
}

/**
 * @param courseState is the state of the course planner
 * @returns every GE in courses in courseState mapped to the courses that satisfy it
 */
export function GESMappedToCourses({
  courseState,
}: {
  courseState: PlannerData;
}) {
  const mapOfGeToCourses = new Map<string, string[]>();
  for (const course of courseState.courses) {
    if (course.ge.length > 0 && course.ge[0] !== "None") {
      for (let ge of course.ge) {
        // replaces pe-x with pe and pr-x with pr, where x is some letter
        if (ge.includes("pe")) {
          ge = "pe";
        } else if (ge.includes("pr")) {
          ge = "pr";
        }

        if (mapOfGeToCourses.has(ge)) {
          const courses = mapOfGeToCourses.get(ge);
          if (courses !== undefined) {
            courses.push(course.departmentCode + " " + course.number);
            mapOfGeToCourses.set(ge, courses);
          }
        } else {
          mapOfGeToCourses.set(ge, [
            course.departmentCode + " " + course.number,
          ]);
        }
      }
    }
  }
  return mapOfGeToCourses;
}

/**
 * @param ge is a list of GEs
 * @returns a list containing a label for the first GE in ge
 */
export function geLabels(ge: string[]): Label[] {
  if (ge.length > 0 && ge[0] !== "None") {
    const geLabel = {
      id: "ge",
      name: "GE",
      color: LabelColor.GREEN,
    };
    return [geLabel];
  }
  return [];
}

/**
 * Returns a list of all the satisfied GE's in a planner
 * @param planner a course planner object
 * @returns list of GEs satisfied
 */
export function getGeSatisfied(planner: PlannerData): string[] {
  return planner.courses.flatMap((c) => c.ge);
}

export function isCSE(course: StoredCourse): boolean {
  return course.departmentCode === "CSE";
}

/**
 * Extracts the term from a quarter ID
 * @param qid quarter Id of the format `quarter-{year}-{term}`
 * @returns term name
 */
export function extractTermFromQuarter(
  qid: string | undefined,
): Term | undefined {
  if (qid === undefined) return undefined;

  const tokens = qid.split("-");
  return tokens[tokens.length - 1] as Term;
}

export function isOffered(
  quartersOffered: string[],
  term: Term | undefined,
): boolean {
  if (term === undefined) return true;
  return quartersOffered.find((t) => (t as Term) == term) !== undefined;
}
/**
 * Copies a PlannerData, but changes the id's of the courses within the planner
 * to prevent data inconsistencies
 * Also adds a value for notes
 * @param defaultPlanner a defaultPlanner
 * @returns a unique PlannerData instance
 */
export function cloneDefaultPlanner(defaultPlanner: PlannerData): PlannerData {
  const clone = { ...defaultPlanner };
  // Create a lookup table between old ids and newStoredCourse
  const lookup = {} as any;
  defaultPlanner.courses.forEach((c) => {
    lookup[c.id] = { ...c, id: uuidv4() };
  });
  // Pass the new Stored courses to the clone
  clone.courses = Object.values(lookup);

  // Replace all the references in the quarters to course ids with their new
  // counterparts
  clone.quarters = defaultPlanner.quarters.map((q) => {
    return {
      ...q,
      courses: q.courses.map((crs) => {
        return lookup[crs].id;
      }),
      notes: "",
    };
  });
  return clone;
}
